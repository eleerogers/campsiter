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
      firstName,
      lastName,
      username,
      imageId
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

router.post('/',
  middleware.fileConverter,
  middleware.validUser,
  middleware.checkIfUsernameInUse,
  middleware.checkIfEmailInUse,
  middleware.picUploader,
  userController.register,
  (req, res) => {
    const { userId, correctAdminCode } = res.locals;
    const message = `YC User added with ID: ${userId}`;
    res.status(201).json({
      message,
      correctAdminCode
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
  middleware.picReplacer,
  userController.update,
  (req, res) => {
    const { correctAdminCode, userId } = res.locals;
    const {
      // id,
      // username,
      // firstName,
      // lastName,
      // email,
      image,
      imageId
    } = req.body;
    const message = `Updated user with ID: ${userId}`;
    res.status(201).json({
      message,
      correctAdminCode,
      admin: correctAdminCode,
      // id,
      // username,
      // first_name: firstName,
      // last_name: lastName,
      // email,
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
