const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const async = require('async');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const connectionString = process.env.CONNECTION_STRING;

const pool = new Pool({
  connectionString
});


const getYCUsers = (request, response) => {
  pool.query('SELECT * FROM ycusers ORDER BY id ASC', (error, results) => {
    if (error) {
      console.error(error);
      throw error;
    }
    response.status(200).json(results.rows);
  });
};


const getYCUserById = (request, response) => {
  const id = parseInt(request.params.id, 10);
  pool.query('SELECT * FROM ycusers WHERE id = $1', [id], (error, results) => {
    if (error) {
      console.error(error);
      response.status(404).json({
        error: 'YC user not found'
      });
      return;
    }
    response.status(200).json(results.rows[0]);
  });
};


const ycRegister = (req, res) => {
  const {
    username,
    firstName,
    lastName,
    email,
    adminCode
  } = req.body;
  let {
    image,
    imageId,
  } = req.body;
  if (!image) {
    image = 'https://res.cloudinary.com/eleerogers/image/upload/v1565769595/tg6i3wamwkkevynyqaoe.jpg';
    imageId = 'tg6i3wamwkkevynyqaoe';
  }
  const correctAdminCode = adminCode === process.env.ADMIN_PASSWORD;

  bcrypt.hash(req.body.password, 10)
    .then((password) => {
      const queryString = 'INSERT INTO ycusers (username, password, first_name, last_name, email, image, image_id, admin) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id';
      const valueArr = [
        username, password, firstName, lastName, email, image, imageId, correctAdminCode
      ];

      pool.query(queryString, valueArr, (error, results) => {
        if (error) {
          console.error(error);
          throw error;
        }
        const message = `YC User added with ID: ${results.rows[0].id}`;
        res.status(201).json({
          message,
          correctAdminCode
        });
      });
    });
};


const ycUpdate = (req, res) => {
  const {
    id,
    username,
    firstName,
    lastName,
    email,
    image,
    imageId,
    admin,
    adminCode
  } = req.body;

  const correctAdminCode = adminCode === process.env.ADMIN_PASSWORD || admin;

  const queryString = 'UPDATE ycusers SET first_name=$1, last_name=$2, email=$3, image=$4, image_id=$5, admin=$6 WHERE id=$7 RETURNING *';
  const valueArr = [firstName, lastName, email, image, imageId, correctAdminCode, id];

  pool.query(queryString, valueArr, (error, results) => {
    if (error) {
      console.error(error);
      throw error;
    }
    const message = `YC User added with ID: ${results.rows[0].id}`;
    res.status(201).json({
      message,
      correctAdminCode,
      admin: correctAdminCode,
      id,
      username,
      first_name: firstName,
      last_name: lastName,
      email,
      image,
      image_id: imageId
    });
  });
};


const ycLogin = (req, res) => {
  const { password, user } = req.body;
  if (!user) {
    res.status(400).send(new Error('Invalid email'));
  } else {
    bcrypt
      .compare(password, user.password)
      .then((result) => {
        if (result) {
          res.cookie('userId', user.id, {
            httpOnly: true,
            signed: true
          });
          res.json({
            id: user.id,
            email: user.email,
            admin: user.admin,
            image: user.image,
            firstName: user.first_name,
            lastName: user.last_name,
            username: user.username,
            imageId: user.image_id
          });
        } else {
          res.status(400).send(new Error('Incorrect password'));
        }
      });
  }
};


const ycLogout = (req, res) => {
  res.clearCookie('userId');
  res.json({
    message: 'userId cookie cleared',
  });
};


const resetPassword = (req, res, next) => {
  async.waterfall([
    function createToken(done) {
      crypto.randomBytes(20, (err, buf) => {
        const token = buf.toString('hex');
        done(err, token);
      });
    },
    function addToken(token, done) {
      const tokenExpires = Date.now() + 3600000;
      pool.query('UPDATE ycusers SET reset_password_token=$1, reset_password_expires=$2 WHERE email=$3 RETURNING *', [token, tokenExpires, req.body.email], (err) => {
        if (err) {
          console.error(err);
          throw err;
        }
        done(err, token, req.body);
      });
    },
    async function emailLink(token, user) {
      // create reusable transporter object using the default SMTP transport
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'edwinleerogers@gmail.com',
          pass: process.env.GMAILPW
        },
        port: 587,
        secure: false, // true for 465, false for other ports
      });

      // send mail with defined transport object
      await transporter.sendMail({
        to: user.email,
        from: 'yelpcamp2@example.com',
        subject: 'YelpCamp2 Password Reset',
        text: `${'You are receiving this because you (or someone else) have requested the reset of the password for your YelpCamp2 account.\n\n'
          + 'Please click on the following link, or paste this into your browser to complete the process:\n\n'
          + 'http://'}${req.headers.host}/reset/${token}\n\n`
          + 'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      });
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    }
  ], (err) => {
    if (err) return next(err);
    return res.redirect('/forgot');
  });
};

const updatePassword = (req, res) => {
  bcrypt.hash(req.body.password, 10)
    .then((password) => {
      pool.query('UPDATE ycusers SET password = $1 WHERE id = $2 RETURNING id', [password, req.body.user.id], (error, results) => {
        if (error) {
          throw error;
        }
        const message = `Password changed for YC User with ID: ${results.rows[0].id}`;
        res.status(201).json({
          message,
        });
      });
    });
};

const getUserByToken = (req, res) => {
  const resetPasswordToken = req.params.reset_password_token;
  pool.query('SELECT * FROM ycusers WHERE reset_password_token = $1', [resetPasswordToken], (error, results) => {
    if (error || results.rows.length === 0) {
      res.status(404).send(new Error('not found'));
    } else {
      const [user] = results.rows;
      res.json({
        user
      });
    }
  });
};


module.exports = {
  getYCUsers,
  getYCUserById,
  ycRegister,
  ycUpdate,
  ycLogin,
  ycLogout,
  resetPassword,
  updatePassword,
  getUserByToken
};
