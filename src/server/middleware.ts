import pool from './pool';
import { Request, Response, NextFunction } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { promisify } from 'util';
const unlinkAsync = promisify(fs.unlink);


cloudinary.config({
  cloud_name: 'eleerogers',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

interface RequestFile extends Request {
  fileValidationError?: string
}

const imageFilter = (req: RequestFile, file: Express.Multer.File, cb: FileFilterCallback) => {
  // accept image files only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    req.fileValidationError = 'Only image files are allowed!';
    return cb(null, false);
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
  fileFilter: imageFilter
}).single('image');

export const fileConverter = (req: RequestFile, res: Response, next: NextFunction) => {
  upload(req, res, (err) => {
    if (req.fileValidationError || err) {
      return res.status(400).send(req.fileValidationError || err.message);
    }
    return next();
  });
};

export const picUploader = async (req: Request, res: Response, next: NextFunction) => {
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

export const picDeleter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // req.body.delete signals that it should still delete the picture even though there isn't another picture to replace it
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


export const validUser = async (req: Request, res: Response, next: NextFunction) => {
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
      if (req.file) {
        await unlinkAsync(req.file.path);
      }
    } catch (err) {
      console.error(err);
    } finally {
      res.status(400).send('Error: Be sure to enter all required fields');
    }
  }
};


export const validEditUser = (req: Request, res: Response, next: NextFunction) => {
  const validEmail = typeof req.body.email === 'string' && req.body.email.trim() !== '';
  const validFirstName = typeof req.body.firstName === 'string' && req.body.firstName.trim() !== '';
  const validLastName = typeof req.body.lastName === 'string' && req.body.lastName.trim() !== '';
  if (
    validEmail
    && validFirstName
    && validLastName
  ) {
    next();
  } else {
    res.status(400).send('Error: Be sure to enter all required fields');
  }
};


export const getUserByEmail = (req: Request, res: Response, next: NextFunction) => {
  let { email } = req.body;
  if (email === '') {
    res.status(400).send('Enter email address');
  }
  email = email.toLowerCase();
  pool.query('SELECT * FROM ycusers WHERE email = $1', [email], (error: Error, results) => {
    if (error || results.rows.length === 0) {
      res.status(404).send('User not found');
    } else {
      [req.body.user] = results.rows;
      next();
    }
  });
};


export const getUserByToken = (req: Request, res: Response, next: NextFunction) => {
  pool.query('SELECT * FROM ycusers WHERE reset_password_token = $1', [req.body.reset_password_token], (error: Error, results) => {
    if (error || results.rows.length === 0) {
      res.status(404).send(new Error('not found'));
    } else {
      [req.body.user] = results.rows;
      next();
    }
  });
};


export const checkIfEmailInUse = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  const emailLC = email.toLowerCase();
  try {
    const { rows: { length } } = await pool.query('SELECT * FROM ycusers WHERE email = $1', [emailLC]);
    if (length > 0 && req.file) {
      await unlinkAsync(req.file.path);
      res.status(409).send('Email address already in use');
    } else {
      req.body.email = emailLC;
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


export const onUpdateCheckIfEmailInUse = async (req: Request, res: Response, next: NextFunction) => {
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


export const checkIfUsernameInUse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { rows: { length } } = await pool.query('SELECT * FROM ycusers WHERE username = $1', [req.body.username]);
    if (length > 0 && req.file) {
      await unlinkAsync(req.file.path);
      res.status(409).send('Username already in use.');
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


export function allowAccess(req: Request, res: Response, next: NextFunction) {
  const cookieId = parseInt(req.signedCookies.userId, 10);
  const userId = parseInt(req.body.userId, 10);
  if (cookieId !== userId && !req.body.adminBool) {
    console.log('allow access error')
    res.status(401).send('Unauthorized');
  } else {
    next();
  }
}


export const validCampground = (req: Request, res: Response, next: NextFunction) => {
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
    res.status(400).send('Error: Be sure to enter all required fields');
  }
};


export const validComment = (req: Request, res: Response, next: NextFunction) => {
  if (
    typeof req.body.comment === 'string'
    && req.body.comment.trim() !== ''
  ) {
    next();
  } else {
    res.status(400).send('Invalid comment');
  }
};


export const checkTokenExpiration = (req: Request, res: Response, next: NextFunction) => {
  const currentTime = Date.now();
  if (currentTime < req.body.user.reset_password_expires) {
    next();
  } else {
    res.status(410).send('Reset link has expired');
  }
};
