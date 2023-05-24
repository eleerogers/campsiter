import express from 'express';

const router = express.Router();
import {
  getComments,
  createComment,
  editComment,
  deleteComment
} from '../controllers/commentController';
import {
  allowAccess,
  validComment,
} from '../middleware';


router.get('/:campgroundId',
  getComments,
  (req, res) => {
    const { comments } = res.locals;
    res.status(200).json({ comments });
  });


router.post('/:campgroundId',
  allowAccess,
  validComment,
  createComment,
  (req, res) => {
    res.status(200).send(
      'Successfully added review'
    );
  });


router.put('/:campgroundId',
  allowAccess,
  validComment,
  editComment,
  (req, res) => {
    res.status(200).send('Successfully edited review');
  });


router.delete('/:campgroundId',
  allowAccess,
  deleteComment,
  getComments,
  (req, res) => {
    const message = 'Review successfully deleted';
    const { comments } = res.locals;
    res.status(200).json({ comments, message });
  });


export default router;
