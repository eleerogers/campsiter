const { Pool } = require('pg');

const connectionString = process.env.CONNECTION_STRING;

const pool = new Pool({
  connectionString
});

const getComments = (request, response) => {
  const { campgroundId } = request.params;

  pool.query('SELECT email, comment, comment_id, user_id, comments.created_at FROM comments JOIN ycusers ON ycusers.id=comments.user_id WHERE comments.campground_id=$1 ORDER BY comment_id ASC', [campgroundId], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const createComment = (request, response) => {
  const {
    campgroundId
  } = request.params;
  const {
    userId, comment
  } = request.body;
  pool.query(
    'INSERT INTO comments (user_id, campground_id, comment) VALUES ($1, $2, $3)',
    [userId, campgroundId, comment],
    (error) => {
      if (error) {
        throw error;
      }
      response.status(200).send(
        'Successfully added comment'
      );
    }
  );
};

const editComment = (request, response) => {
  const {
    commentId, comment
  } = request.body;

  pool.query(
    'UPDATE comments SET comment = $1 WHERE comment_id = $2',
    [comment, commentId],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send('Successfully edited comment');
    }
  );
};

const deleteComment = (request, response) => {
  const { commentId } = request.body;
  pool.query(
    'DELETE FROM comments WHERE comment_id = $1',
    [commentId],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send('Comment successfully deleted');
    }
  );
};

module.exports = {
  getComments,
  createComment,
  editComment,
  deleteComment
};
