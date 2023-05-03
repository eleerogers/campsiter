import express from 'express';

const router = express.Router();
import {
  getCampgrounds,
  getCampgroundsByUser,
  getCampgroundById,
  createCampground,
  updateCampground,
  updateCampgroundRating,
  deleteCampground,
} from '../controllers/campgroundController';
import { getUserById } from '../controllers/userController';
import {
  fileConverter,
  picUploader,
  picDeleter,
  allowAccess,
  validCampground,
} from '../middleware';


router.get('/',
  getCampgrounds,
  (req, res) => {
    const { campgrounds } = res.locals;
    res.status(200).json({ campgrounds });
  });


router.get('/user/:id',
  getCampgroundsByUser,
  getUserById,
  (req, res) => {
    const { campgrounds, user } = res.locals;
    res.status(200).json({ campgrounds, user });
  });


router.get('/:id',
  getCampgroundById,
  (req, res) => {
    const { campground } = res.locals;
    res.status(200).json({ campground });
  });


router.post('/',
  fileConverter,
  allowAccess,
  validCampground,
  picUploader,
  createCampground,
  (req, res) => {
    const {id} = res.locals;
    const message = 'Successfully added campground.';
    res.status(201).json({ message, id });
  });


router.put('/:id',
  fileConverter,
  allowAccess,
  validCampground,
  picDeleter,
  picUploader,
  updateCampground,
  (req, res) => {
    const { campground } = res.locals; 
    const message = 'Successfully edited campground';
    res.status(200).json({ campground, message });
  });


  router.put('/rating/:id',
  updateCampgroundRating,
  (req, res) => {
    const { campground } = res.locals;
    const message = 'Successfully edited campground';
    res.status(200).json({ campground, message });
  });


router.delete('/:id',
  allowAccess,
  picDeleter,
  deleteCampground,
  (req, res) => {
    res.status(200).send('Campground successfully deleted');
  });


export default router;
