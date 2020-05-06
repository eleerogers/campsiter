const express = require('express');

const router = express.Router();
const campgroundController = require('../controllers/campgroundController');
const middleware = require('../middleware');

router.get('/',
  campgroundController.getCampgrounds,
  (req, res) => {
    const { campgrounds } = res.locals;
    res.status(200).json({ campgrounds });
  });

router.get('/user/:id',
  campgroundController.getCampgroundsByUser,
  (req, res) => {
    const { campgrounds } = res.locals;
    res.status(200).json({ campgrounds });
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
    const { campgroundId } = res.locals;
    res.status(201).send(`Campground added with ID: ${campgroundId}`);
  });

router.put('/:id',
  middleware.fileConverter,
  middleware.allowAccess,
  middleware.validCampground,
  middleware.picReplacer,
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
    const { campgroundId } = res.locals;
    res.status(200).send(`Campground deleted with ID: ${campgroundId}`);
  });


module.exports = router;
