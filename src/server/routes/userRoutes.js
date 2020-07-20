const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController');
const middleware = require('../middleware');


router.get('/',
  userController.getUsers,
  (req, res) => {
    const { users } = res.locals;
    res.status(200).json({ users });
  });


router.post('/login',
  middleware.getUserByEmail,
  userController.login,
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
  middleware.getUserByEmail,
  userController.resetPassword,
  (req, res) => {
    const { email } = res.locals;
    res.status(200).send(`An e-mail has been sent to ${email} with further instructions.`);
  });


router.post('/reset',
  middleware.getUserByToken,
  middleware.checkTokenExpiration,
  userController.updatePassword,
  (req, res) => {
    res.status(201).send('Successfully changed password. Please login.');
  });

router.post('/contact',
userController.contact,
(req, res) => {
    res.status(201).json({
      message: `Your message has been sent to ${req.body.usernameTo}!`
    })
  });


router.post('/',
  middleware.fileConverter,
  middleware.validUser,
  middleware.checkIfUsernameInUse,
  middleware.checkIfEmailInUse,
  middleware.picUploader,
  userController.register,
  (req, res) => {
    const { correctAdminCode } = res.locals;
    const message = correctAdminCode ? 'Succesfully created new admin account. Please login.' : 'Succesfully created new account. Please login.';
    res.status(201).json({
      message
    });
  });


router.get('/logout',
  userController.logout,
  (req, res) => {
    res.json({
      message: 'userId cookie cleared',
    });
  });


router.get('/:id',
  userController.getUserById,
  (req, res) => {
    const { user } = res.locals;
    res.status(200).json({ user });
  });


router.put('/',
  middleware.fileConverter,
  middleware.validEditUser,
  middleware.onUpdateCheckIfEmailInUse,
  middleware.picDeleter,
  middleware.picUploader,
  userController.update,
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
  userController.getUserByToken,
  (req, res) => {
    const { user } = res.locals;
    res.json({
      user
    });
  });


module.exports = router;
