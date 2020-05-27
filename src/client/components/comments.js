import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import Comment from './comment';


function Comments({ campground }) {
  const [comments, setComments] = useState([]);
  const {
    id: campgroundId,
  } = campground;

  useEffect(() => {
    axios.get(`/api/comments/${campgroundId}`)
      .then(({ data: { comments: incomingComments } }) => {
        setComments(incomingComments);
      })
      .catch((err) => { console.error(err); });
  }, [campgroundId]);

  async function deleteComment(commentObj, loggedInAsAdmin) {
    try {
      const url = `/api/comments/${campgroundId}`;
      const {
        comment_id: commentId,
        user_id: commentUserId
      } = commentObj;
      const commentData = {
        loggedInAsAdmin,
        commentId,
        userId: commentUserId
      };
      const {
        data: {
          comments: updatedComments,
          message
        }
      } = await axios.delete(url, { data: commentData });
      setComments(updatedComments);
      toast.success(message);
    } catch (err) {
      const { response: { status, statusText } } = err;
      toast.error(`${statusText} (${status})`);
    }
  }

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
