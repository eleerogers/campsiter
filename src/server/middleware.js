const { Pool } = require('pg');
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;

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
    console.log('error', err);
    next(err);
  }
}).single('image');

const fileConverter = (req, res, next) => {
  console.log('fileConverter');
  upload(req, res, (err) => {
    if (req.fileValidationError || err) {
      return res.status(400).send(req.fileValidationError);
    }
    next();
  });
};

const picUploader = (req, res, next) => {
  console.log('picUploader');
  if (req.file) {
    cloudinary.uploader.upload(req.file.path, (error, result) => {
      if (error) {
        console.log('ERROR2: ', error);
      }
      const image = result.secure_url;
      const image_id = result.public_id;
      req.body.image = image;
      req.body.image_id = image_id;
      next();
    });
  } else {
    next();
  }
};

const picReplacer = (req, res, next) => {
  console.log('req.file: ', req.file);
  console.log('req.body.image_id: ', req.body.image_id);
  if (req.file && req.body.image_id !== 'tg6i3wamwkkevynyqaoe') {
    cloudinary.uploader.destroy(req.body.image_id);
  }
  if (req.file) {
    cloudinary.uploader.upload(req.file.path, (error, result) => {
      if (error) {
        console.log('ERROR: ', error);
      }
      const image = result.secure_url;
      const image_id = result.public_id;
      req.body.image = image;
      req.body.image_id = image_id;
      next();
    });
  } else {
    next();
  }
};

const picDeleter = (req, res, next) => {
  if (req.body.image_id !== 'tg6i3wamwkkevynyqaoe') {
    cloudinary.uploader.destroy(req.body.image_id, (error, result) => {
      if (error) {
        console.log('ERROR: ', error);
        res.status(400).send(new Error(error));
      }
      next();
    });
  } else {
    next();
  }
};

const validUser = (req, res, next) => {
  const validEmail = typeof req.body.email === 'string' && req.body.email.trim() != '';
  const validPassword = typeof req.body.password === 'string' && req.body.password.trim() != '';
  const validUsername = typeof req.body.username === 'string' && req.body.username.trim() != '';
  const validFirstName = typeof req.body.first_name === 'string' && req.body.first_name.trim() != '';
  const validLastName = typeof req.body.last_name === 'string' && req.body.last_name.trim() != '';
  console.log()
  if (
    validEmail
    && validPassword
    && validUsername
    && validFirstName
    && validLastName
  ) {
    next();
  } else {
    res.status(400).send(new Error('invalid login information!'));
  }
};

const getUserByEmail = (req, res, next) => {
  pool.query('SELECT * FROM ycusers WHERE email = $1', [req.body.email], (error, results) => {
    if (error || results.rows.length === 0) {
      res.status(404).send(new Error('user not found'));
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

const checkIfEmailInUse = (req, res, next) => {
  pool.query('SELECT * FROM ycusers WHERE email = $1', [req.body.email], (error, results) => {
    if (error || results.rows.length > 0) {
      res.status(409).send(new Error('email in use'));
    } else {
      next();
    }
  });
};

const onUpdateCheckIfEmailInUse = (req, res, next) => {
  pool.query('SELECT * FROM ycusers WHERE email = $1 AND id != $2', [req.body.email, req.body.id], (error, results) => {
    if (error || results.rows.length > 0) {
      res.status(409).send(new Error('email in use'));
    } else {
      next();
    }
  });
};

const checkIfUsernameInUse = (req, res, next) => {
  pool.query('SELECT * FROM ycusers WHERE username = $1', [req.body.username], (error, results) => {
    if (error || results.rows.length > 0) {
      res.status(409).send(new Error('username in use'));
    } else {
      next();
    }
  });
};

function allowAccess(req, res, next) {
  console.log('allowAccess');
  const cookieId = parseInt(req.signedCookies.user_id, 10);
  const userId = parseInt(req.body.user_id, 10);
  if (cookieId !== userId && !req.body.adminBool) {
    res.status(401).send(new Error('Un-authorized'));
  } else {
    next();
  }
}

const validCampground = (req, res, next) => {
  const validName = typeof req.body.name === 'string' && req.body.name.trim() != '';
  const validImage = req.body.image_id || req.file && typeof req.file.path === 'string' && req.file.path.trim() != '';
  const validDescription = typeof req.body.description === 'string' && req.body.description.trim() != '';
  const validLocation = typeof req.body.campLocation === 'string' && req.body.campLocation.trim() != '';
  const validPrice = typeof req.body.price === 'string' && req.body.price.trim() != '';
  if (
    validName
    && validImage
    && validDescription
    && validLocation
    && validPrice
  ) {
    next();
  } else {
    res.status(400).send(new Error('invalid campground information!'));
  }
};

const validComment = (req, res, next) => {
  if (
    typeof req.body.comment === 'string'
    && req.body.comment.trim() != ''
  ) {
    next();
  } else {
    res.status(400).send(new Error('invalid comment'));
  }
};

const checkTokenExpiration = (req, res, next) => {
  const currentTime = Date.now();
  if (currentTime < req.body.user.reset_password_expires) {
    next();
  } else {
    res.status(410).send();
  }
};


module.exports = {
  fileConverter,
  picUploader,
  picReplacer,
  picDeleter,
  validUser,
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
