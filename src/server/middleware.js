const { Pool } = require('pg');

const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'api',
  password: 'password',
  port: 5432,
});


const validUser = (req, res, next) => {
  const validEmail = typeof req.body.email === 'string' && req.body.email.trim() != '';
  const validPassword = typeof req.body.password === 'string' && req.body.password.trim() != '';
  if (validEmail && validPassword) {
    next();
  } else {
    console.log('400 on the backend')
    res.status(400).send(new Error('invalid login information!'));
  }
};

const getUserByEmail = (req, res, next) => {
  console.log('getUserByEmail');
  pool.query('SELECT * FROM ycusers WHERE email = $1', [req.body.email], (error, results) => {
    if (error || results.rows.length === 0) {
      res.status(404).send(new Error('user not found'));
    } else {
      [req.body.user] = results.rows;
      console.log('req.body.user', req.body.user);
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
  const cookieId = parseInt(req.signedCookies.user_id, 10);
  const userId = parseInt(req.body.user.id, 10);
  if (cookieId !== userId && !req.body.adminBool) {
    req.flash('error', 'You need to be logged in to do that.');
    res.status(401).send(new Error('Un-authorized'));
  } else {
    next();
  }
}

const validCampground = (req, res, next) => {
  const validName = typeof req.body.name === 'string' && req.body.name.trim() != '';
  const validImage = typeof req.body.image === 'string' && req.body.image.trim() != '';
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
