const express = require('express');

const router = express.Router();
const campgroundController = require('../controllers/campgroundController');
const userController = require('../controllers/userController');
const middleware = require('../middleware');

router.get('/mapkey',
  (req, res) => {
    const { REACT_APP_GOOGLE_API_KEY: mapKey } = process.env;
    res.status(200).send(mapKey);
  });

router.get('/',
  campgroundController.getCampgrounds,
  (req, res) => {
    const { campgrounds } = res.locals;
    res.status(200).json({ campgrounds });
  });

router.get('/user/:id',
  campgroundController.getCampgroundsByUser,
  userController.getUserById,
  (req, res) => {
    const { campgrounds, user } = res.locals;
    res.status(200).json({ campgrounds, user });
  });

router.get('/:id',
  campgroundController.getCampgroundById,
  (req, res) => {
    const { campground } = res.locals;
    res.status(200).json({ campground });
  });

router.post('/',
  middleware.fileConverter,
  middleware.allowAccess,
  middleware.validCampground,
  middleware.picUploader,
  campgroundController.createCampground,
  (req, res) => {
    res.status(201).send('Successfully added campground');
  });

router.put('/:id',
  middleware.fileConverter,
  middleware.allowAccess,
  middleware.validCampground,
  middleware.picDeleter,
  middleware.picUploader,
  campgroundController.updateCampground,
  (req, res) => {
    const { campground } = res.locals;
    const message = 'Successfully edited campground';
    res.status(200).json({ campground, message });
  });

router.delete('/:id',
  middleware.allowAccess,
  middleware.picDeleter,
  campgroundController.deleteCampground,
  (req, res) => {
    res.status(200).send('Campground successfully deleted');
  });


module.exports = router;
