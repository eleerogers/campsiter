import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';


function useGetAndDeleteComments(campground) {
  const [comments, setComments] = useState([]);
  const {
    id: campgroundId,
  } = campground;

  useEffect(() => {
    let mounted = true;
    axios.get(`/api/comments/${campgroundId}`)
      .then(({ data: { comments: incomingComments } }) => {
        if (mounted) {
          setComments(incomingComments);
        }
      })
      .catch((err) => { console.error(err); });
    return () => { mounted = false; };
  }, [campgroundId]);

  async function deleteComment(commentObj, loggedInAsAdmin) {
    try {
      const url = `/api/comments/${campgroundId}`;
      const {
        comment_id: commentId,
        user_id: commentUserId
      } = commentObj;
      const commentData = {
        adminBool: loggedInAsAdmin,
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

  return [comments, deleteComment];

}

export default useGetAndDeleteComments;
