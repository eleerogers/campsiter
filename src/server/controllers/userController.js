const pool = require('../pool');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');


const getUsers = (request, response, next) => {
  pool.query('SELECT * FROM ycusers ORDER BY id ASC', (error, results) => {
    if (error) {
      console.error(error);
      throw error;
    }
    response.locals.users = results.rows;
    next();
  });
};


const getUserById = (request, response, next) => {
  const id = parseInt(request.params.id, 10);
  pool.query('SELECT * FROM ycusers WHERE id = $1', [id], (error, results) => {
    if (error) {
      console.error(error);
      response.status(404).json({
        error: 'User not found'
      });
    }
    [response.locals.user] = results.rows;
    next();
  });
};


const register = async (req, res, next) => {
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

  try {
    const password = await bcrypt.hash(req.body.password, 10);
    const queryString = 'INSERT INTO ycusers (username, password, first_name, last_name, email, image, image_id, admin) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id';
    const valueArr = [
      username, password, firstName, lastName, email, image, imageId, correctAdminCode
    ];
    await pool.query(queryString, valueArr);
    res.locals.correctAdminCode = correctAdminCode;
    next();
  } catch (err) {
    console.error(err);
    throw err;
  }
};


const update = (req, res, next) => {
  const {
    id,
    // username,
    firstName,
    lastName,
    email,
    image,
    imageId,
    admin,
    adminCode
  } = req.body;
  const updatedAdmin =
    adminCode === process.env.ADMIN_PASSWORD
    ? admin === 'false'
    : admin === 'true';

  const queryString = 'UPDATE ycusers SET first_name=$1, last_name=$2, email=$3, image=$4, image_id=$5, admin=$6 WHERE id=$7 RETURNING *';
  const valueArr = [firstName, lastName, email, image, imageId, updatedAdmin, id];

  pool.query(queryString, valueArr, (error, results) => {
    if (error) {
      console.error(error);
      throw error;
    }
    res.locals.updatedAdmin = updatedAdmin;
    // res.locals.userId = results.rows[0].id;
    next();
  });
};


const login = (req, res, next) => {
  const { password, user } = req.body;
  if (!user) {
    res.status(400).send('Invalid email');
  } else {
    bcrypt
      .compare(password, user.password)
      .then((result) => {
        if (result) {
          res.cookie('userId', user.id, {
            httpOnly: true,
            signed: true
          });
          res.locals.user = user;
          next();
        } else {
          res.status(400).send('Incorrect password');
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }
};


const logout = (req, res, next) => {
  res.clearCookie('userId');
  next();
};


const resetPassword = async (req, res, next) => {
  res.locals.email = req.body.email;
  try {
    const buf = crypto.randomBytes(20);
    const token = buf.toString('hex');
    const tokenExpires = Date.now() + 3600000;
    await pool.query('UPDATE ycusers SET reset_password_token=$1, reset_password_expires=$2 WHERE email=$3 RETURNING *', [token, tokenExpires, req.body.email]);
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'edwinleerogers@gmail.com',
        pass: process.env.GMAILPW
      },
      port: 587,
      secure: false, // true for 465, false for other ports
    });
    await transporter.sendMail({
      to: req.body.email,
      from: 'CampSiter@example.com',
      subject: 'CampSiter Password Reset',
      text: `${'You are receiving this because you (or someone else) have requested the reset of the password for your CampSiter account.\n\n'
      + 'Please click on the following link, or paste this into your browser to complete the process:\n\n'
      + 'http://'}${req.headers.host}/reset/${token}\n\n`
      + 'If you did not request this, please ignore this email and your password will remain unchanged.\n'
    });
    next();
  } catch (err) {
    console.error(err);
    next(err);
  }
};


const updatePassword = async (req, res, next) => {
  try {
    const password = await bcrypt.hash(req.body.password, 10);
    await pool.query('UPDATE ycusers SET password = $1 WHERE id = $2 RETURNING id', [password, req.body.user.id]);
    next();
  } catch (err) {
    console.error(err);
  }
};


const getUserByToken = (req, res, next) => {
  const resetPasswordToken = req.params.reset_password_token;
  pool.query('SELECT * FROM ycusers WHERE reset_password_token = $1', [resetPasswordToken], (error, results) => {
    if (error || results.rows.length === 0) {
      res.status(404).send('Not found');
    } else {
      const [user] = results.rows;
      res.locals.user = user;
      next();
    }
  });
};


module.exports = {
  getUsers,
  getUserById,
  register,
  update,
  login,
  logout,
  resetPassword,
  updatePassword,
  getUserByToken
};
