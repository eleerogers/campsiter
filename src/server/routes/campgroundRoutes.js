const express = require('express');

const router = express.Router();
const campgroundController = require('../controllers/campgroundController');
const userController = require('../controllers/userController');
const middleware = require('../middleware');


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
    const {id} = res.locals;
    const message = 'Successfully added campground.';
    res.status(201).json({ message, id });
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


  router.put('/rating/:id',
  campgroundController.updateCampgroundRating,
  (req, res) => {
    console.log('end up PUT');
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
