const { Pool } = require('pg');
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const { promisify } = require('util');

const unlinkAsync = promisify(fs.unlink);

const connectionString = process.env.CONNECTION_STRING;

const pool = new Pool({
  connectionString
});

cloudinary.config({
  cloud_name: 'eleerogers',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const imageFilter = (req, file, cb) => {
  // accept image files only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    req.fileValidationError = 'Only image files are allowed!';
    return cb(null, false, new Error('Only image files are allowed!'));
  }
  return cb(null, true);
};

const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename(req, file, cb) {
    cb(null, `IMAGE-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10000000 },
  fileFilter: imageFilter,
  onError: (err, next) => {
    console.error(err);
    next(err);
  }
}).single('image');

const fileConverter = (req, res, next) => {
  upload(req, res, (err) => {
    if (req.fileValidationError || err) {
      return res.status(400).send(req.fileValidationError || err.message);
    }
    return next();
  });
};

const picUploader = async (req, res, next) => {
  try {
    if (req.file) {
      const {
        secure_url: image,
        public_id: imageId
      } = await cloudinary.uploader.upload(req.file.path);
      req.body.image = image;
      req.body.imageId = imageId;
      await unlinkAsync(req.file.path);
    }
  } catch (err) {
    console.error(err);
  } finally {
    next();
  }
};

const picDeleter = async (req, res, next) => {
  try {
    // req.body.delete signals that it should still delete the picture
    // even though there isn't another picture to replace it
    if ((req.file || req.body.delete) && req.body.imageId !== 'tg6i3wamwkkevynyqaoe') {
      const { result } = await cloudinary.uploader.destroy(req.body.imageId);
      if (result === 'not found') {
        console.error('image not found');
      }
    }
    next();
  } catch (err) {
    console.error(err);
    res.status(400).send('Bad request');
  }
};

const validUser = async (req, res, next) => {
  const validEmail = typeof req.body.email === 'string' && req.body.email.trim() !== '';
  const validPassword = typeof req.body.password === 'string' && req.body.password.trim() !== '';
  const validUsername = typeof req.body.username === 'string' && req.body.username.trim() !== '';
  const validFirstName = typeof req.body.firstName === 'string' && req.body.firstName.trim() !== '';
  const validLastName = typeof req.body.lastName === 'string' && req.body.lastName.trim() !== '';
  if (
    validEmail
    && validPassword
    && validUsername
    && validFirstName
    && validLastName
  ) {
    next();
  } else {
    try {
      await unlinkAsync(req.file.path);
    } catch (err) {
      console.error(err);
    } finally {
      res.status(400).send('Invalid account information');
    }
  }
};


const validEditUser = (req, res, next) => {
  const validEmail = typeof req.body.email === 'string' && req.body.email.trim() !== '';
  // const validUsername = typeof req.body.username === 'string' && req.body.username.trim() !== '';
  const validFirstName = typeof req.body.firstName === 'string' && req.body.firstName.trim() !== '';
  const validLastName = typeof req.body.lastName === 'string' && req.body.lastName.trim() !== '';
  if (
    validEmail
    // && validUsername
    && validFirstName
    && validLastName
  ) {
    next();
  } else {
    res.status(400).send('invalid account information!');
  }
};


const getUserByEmail = (req, res, next) => {
  let { email } = req.body;
  email = req.sanitize(email);
  pool.query('SELECT * FROM ycusers WHERE email = $1', [email], (error, results) => {
    if (error || results.rows.length === 0) {
      res.status(404).send('User not found');
    } else {
      [req.body.user] = results.rows;
      next();
    }
  });
};


const getUserByToken = (req, res, next) => {
  pool.query('SELECT * FROM ycusers WHERE reset_password_token = $1', [req.body.reset_password_token], (error, results) => {
    if (error || results.rows.length === 0) {
      res.status(404).send(new Error('not found'));
    } else {
      [req.body.user] = results.rows;
      next();
    }
  });
};


const checkIfEmailInUse = async (req, res, next) => {
  try {
    const { rows: { length } } = await pool.query('SELECT * FROM ycusers WHERE email = $1', [req.body.email]);
    if (length > 0) {
      await unlinkAsync(req.file.path);
      res.status(409).send('Email address already in use');
    } else {
      next();
    }
  } catch (err) {
    console.error(err);
    await unlinkAsync(req.file.path);
    res.status(400).send('Bad request');
  }
};


const onUpdateCheckIfEmailInUse = async (req, res, next) => {
  try {
    const { rows: { length } } = await pool.query('SELECT * FROM ycusers WHERE email = $1 AND id != $2', [req.body.email, req.body.id]);
    if (length > 0) {
      if (req.file) {
        await unlinkAsync(req.file.path);
      }
      res.status(409).send('Email address already in use');
    } else {
      next();
    }
  } catch (err) {
    console.error(err);
    if (req.file) {
      await unlinkAsync(req.file.path);
    }
    res.status(400).send('Bad request');
  }
};


const checkIfUsernameInUse = async (req, res, next) => {
  try {
    const { rows: { length } } = await pool.query('SELECT * FROM ycusers WHERE username = $1', [req.body.username]);
    if (length > 0) {
      await unlinkAsync(req.file.path);
      res.status(409).send('Username already in use.');
    } else {
      next();
    }
  } catch (err) {
    console.error(err);
    await unlinkAsync(req.file.path);
    res.status(400).send('Bad request');
  }
};


function allowAccess(req, res, next) {
  const cookieId = parseInt(req.signedCookies.userId, 10);
  const userId = parseInt(req.body.userId, 10);
  if (cookieId !== userId && !req.body.adminBool) {
    res.status(401).send('Unauthorized');
  } else {
    next();
  }
}


const validCampground = (req, res, next) => {
  const validName = typeof req.body.name === 'string' && req.body.name.trim() !== '';
  const validImage = req.body.imageId || (req.file && typeof req.file.path === 'string' && req.file.path.trim() !== '');
  const validDescription = typeof req.body.description === 'string' && req.body.description.trim() !== '';
  const validLocation = typeof req.body.campLocation === 'string' && req.body.campLocation.trim() !== '';
  const validPrice = typeof req.body.price === 'string' && req.body.price.trim() !== '';
  if (
    validName
    && validImage
    && validDescription
    && validLocation
    && validPrice
  ) {
    next();
  } else {
    res.status(400).send('Invalid campground information');
  }
};


const validComment = (req, res, next) => {
  if (
    typeof req.body.comment === 'string'
    && req.body.comment.trim() !== ''
  ) {
    next();
  } else {
    res.status(400).send('Invalid comment');
  }
};


const checkTokenExpiration = (req, res, next) => {
  const currentTime = Date.now();
  if (currentTime < req.body.user.reset_password_expires) {
    next();
  } else {
    res.status(410).send('Reset link has expired');
  }
};


module.exports = {
  fileConverter,
  picUploader,
  // picReplacer,
  picDeleter,
  validUser,
  validEditUser,
  getUserByEmail,
  getUserByToken,
  checkIfEmailInUse,
  onUpdateCheckIfEmailInUse,
  checkIfUsernameInUse,
  allowAccess,
  validCampground,
  validComment,
  checkTokenExpiration
};
