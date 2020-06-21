const pool = require('../pool');


const getComments = (request, response, next) => {
  const { campgroundId } = request.params;

  pool.query('SELECT username, comment, comment_id, user_id, comments.created_at FROM comments JOIN ycusers ON ycusers.id=comments.user_id WHERE comments.campground_id=$1 ORDER BY comment_id ASC', [campgroundId], (error, results) => {
    if (error) {
      console.error(error);
      throw error;
    }
    response.locals.comments = results.rows;
    next();
  });
};


const createComment = (request, response, next) => {
  const {
    campgroundId
  } = request.params;
  let {
    userId, comment
  } = request.body;
  comment = request.sanitize(comment);
  pool.query(
    'INSERT INTO comments (user_id, campground_id, comment) VALUES ($1, $2, $3)',
    [userId, campgroundId, comment],
    (error) => {
      if (error) {
        console.error(error);
        throw error;
      }
      next();
    }
  );
};


const editComment = (request, response, next) => {
  let {
    commentId, comment
  } = request.body;
  comment = request.sanitize(comment);

  pool.query(
    'UPDATE comments SET comment = $1 WHERE comment_id = $2',
    [comment, commentId],
    (error) => {
      if (error) {
        console.error(error);
        throw error;
      }
      next();
    }
  );
};


const deleteComment = (request, response, next) => {
  const { commentId } = request.body;
  pool.query(
    'DELETE FROM comments WHERE comment_id = $1',
    [commentId],
    (error) => {
      if (error) {
        console.error(error);
        throw error;
      }
      next();
    }
  );
};


module.exports = {
  getComments,
  createComment,
  editComment,
  deleteComment
};
