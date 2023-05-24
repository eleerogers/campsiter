import { Request, Response, NextFunction } from 'express';
import pool from '../pool';



export const getComments = (request: Request, response: Response, next: NextFunction) => {
  const { campgroundId } = request.params;

  pool.query('SELECT username, comment, comment_id, user_id, comments.created_at, rating FROM comments JOIN ycusers ON ycusers.id=comments.user_id WHERE comments.campground_id=$1 ORDER BY comment_id ASC', [campgroundId], (error, results) => {
    if (error) {
      console.error(error);
      response.status(400).send('Problem fetching comments');
      return;
    }
    response.locals.comments = results.rows;
    next();
  });
};


export const createComment = (request: Request, response: Response, next: NextFunction) => {
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
        response.status(400).send('Problem creating comment');
        return;
      }
      next();
    }
  );
};


export const editComment = (request: Request, response: Response, next: NextFunction) => {
  const {
    commentId, comment, rating
  } = request.body;

  pool.query(
    'UPDATE comments SET comment=$1, rating=$2 WHERE comment_id=$3',
    [comment, rating, commentId],
    (error) => {
      if (error) {
        console.error(error);  
        response.status(404).send('Problem editing comment');
        return;
      }
      next();
    }
  );
};


export const deleteComment = (request: Request, response: Response, next: NextFunction) => {
  const { commentId } = request.body;
  pool.query(
    'DELETE FROM comments WHERE comment_id = $1',
    [commentId],
    (error) => {
      if (error) {
        console.error(error);
        response.status(400).send('Problem deleting comment');
        return;
      }
      next();
    }
  );
};
