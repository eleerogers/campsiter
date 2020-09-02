import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Comment from './comment';


function Comments({ campground, comments, deleteComment }) {
  return (
    <Fragment>
      {comments.map((comment) => (
        <Comment
          comment={comment}
          deleteComment={deleteComment}
          campground={campground}
          key={comment.comment_id}
        />
      ))}
    </Fragment>
  );
}

Comments.propTypes = {
  campground: PropTypes.shape({
    id: PropTypes.number.isRequired
  }).isRequired,
  comments: PropTypes.array,
  deleteComment: PropTypes.func.isRequired
};

export default Comments;
