const pool = require('../pool');


const getComments = (request, response, next) => {
  const { campgroundId } = request.params;

  pool.query('SELECT username, comment, comment_id, user_id, comments.created_at, rating FROM comments JOIN ycusers ON ycusers.id=comments.user_id WHERE comments.campground_id=$1 ORDER BY comment_id ASC', [campgroundId], (error, results) => {
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
  const {
    userId, comment, rating
  } = request.body;
  pool.query(
    'INSERT INTO comments (user_id, campground_id, comment, rating) VALUES ($1, $2, $3, $4)',
    [userId, campgroundId, comment, rating],
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
  const {
    commentId, comment, rating
  } = request.body;

  pool.query(
    'UPDATE comments SET comment=$1, rating=$2 WHERE comment_id=$3',
    [comment, rating, commentId],
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
