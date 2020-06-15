import React from 'react';
import PropTypes from 'prop-types';
import Comment from './comment';
import useGetAndDeleteComments from '../hooks/useGetAndDeleteComments';


function Comments({ campground }) {
  const [comments, deleteComment] = useGetAndDeleteComments(campground);

  return (
    <>
      {comments.map((comment) => (
        <Comment
          comment={comment}
          deleteComment={deleteComment}
          campground={campground}
          key={comment.comment_id}
        />
      ))}
    </>
  );
}

Comments.propTypes = {
  campground: PropTypes.shape({
    id: PropTypes.number.isRequired
  }).isRequired
};

export default Comments;
