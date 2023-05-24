import express, { Router } from 'express';
import {
  getUsers,
  getUserById,
  register,
  update,
  login,
  logout,
  resetPassword,
  updatePassword,
  getUserByToken,
  contact
} from '../controllers/userController';
import {
  fileConverter,
  picUploader,
  picDeleter,
  validUser,
  validEditUser,
  getUserByEmail,
  getUserByToken as getUserByTokenMW,
  checkIfEmailInUse,
  onUpdateCheckIfEmailInUse,
  checkIfUsernameInUse,
  checkTokenExpiration
} from '../middleware';

const router: Router = express.Router();


router.get('/',
  getUsers,
  (req, res) => {
    const { users } = res.locals;
    res.status(200).json({ users });
  });


router.post('/login',
  getUserByEmail,
  login,
  (req, res) => {
    const { user } = res.locals;
    const {
      id,
      email,
      admin,
      image,
      first_name: firstName,
      last_name: lastName,
      username,
      image_id: imageId
    } = user;
    res.json({
      id,
      email,
      admin,
      image,
      firstName,
      lastName,
      username,
      imageId
    });
  });


router.post('/forgot',
  getUserByEmail,
  resetPassword,
  (req, res) => {
    const { email } = res.locals;
    res.status(200).send(`An e-mail has been sent to ${email} with further instructions.`);
  });


router.post('/reset',
  getUserByTokenMW,
  checkTokenExpiration,
  updatePassword,
  (req, res) => {
    res.status(201).send('Successfully changed password. Please login.');
  });

router.post('/contact',
contact,
(req, res) => {
    res.status(201).json({
      message: `Your message has been sent to ${req.body.usernameTo}!`
    })
  });


router.post('/',
  fileConverter,
  validUser,
  checkIfUsernameInUse,
  checkIfEmailInUse,
  picUploader,
  register,
  (req, res) => {
    const { correctAdminCode } = res.locals;
    const message = correctAdminCode ? 'Succesfully created new admin account. Please login.' : 'Succesfully created new account. Please login.';
    res.status(201).json({
      message
    });
  });


router.get('/logout',
  logout,
  (req, res) => {
    res.json({
      message: 'userId cookie cleared',
    });
  });


router.get('/:id',
  getUserById,
  (req, res) => {
    const { user } = res.locals;
    res.status(200).json({ user });
  });


router.put('/',
  fileConverter,
  validEditUser,
  onUpdateCheckIfEmailInUse,
  picDeleter,
  picUploader,
  update,
  (req, res) => {
    const { updatedAdmin } = res.locals;
    const {
      image,
      imageId
    } = req.body;
    const message = updatedAdmin ? 'Succesfully edited admin account.' : 'Succesfully edited account.';
    res.status(201).json({
      message,
      admin: updatedAdmin,
      image,
      image_id: imageId
    });
  });


router.get('/token/:reset_password_token',
  getUserByToken,
  (req, res) => {
    const { user } = res.locals;
    res.json({
      user
    });
  });


export default router;
