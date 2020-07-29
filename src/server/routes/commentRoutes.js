const express = require('express');

const router = express.Router();
const commentController = require('../controllers/commentController');
const middleware = require('../middleware');


router.get('/:campgroundId',
  commentController.getComments,
  (req, res) => {
    const { comments } = res.locals;
    res.status(200).json({ comments });
  });


router.post('/:campgroundId',
  middleware.allowAccess,
  middleware.validComment,
  commentController.createComment,
  (req, res) => {
    res.status(200).send(
      'Successfully added review'
    );
  });


router.put('/:campgroundId',
  middleware.allowAccess,
  middleware.validComment,
  commentController.editComment,
  (req, res) => {
    res.status(200).send('Successfully edited review');
  });


router.delete('/:campgroundId',
  middleware.allowAccess,
  commentController.deleteComment,
  commentController.getComments,
  (req, res) => {
    const message = 'Review successfully deleted';
    const { comments } = res.locals;
    res.status(200).json({ comments, message });
  });


module.exports = router;
