const { Pool } = require('pg');

const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'api',
  password: 'password',
  port: 5432,
});


const getComments = (request, response) => {
  const campgroundId = request.params.campground_id;
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
    user, comment
  } = request.body;
  pool.query(
    'INSERT INTO comments (user_id, campground_id, comment) VALUES ($1, $2, $3)',
    [user.id, campgroundId, comment],
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
    comment_id, comment
  } = request.body;

  pool.query(
    'UPDATE comments SET comment = $1 WHERE comment_id = $2',
    [comment, comment_id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send('Successfully edited comment');
    }
  );
};

const deleteComment = (request, response) => {
  const { comment_id } = request.body;
  pool.query(
    'DELETE FROM comments WHERE comment_id = $1',
    [comment_id],
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
