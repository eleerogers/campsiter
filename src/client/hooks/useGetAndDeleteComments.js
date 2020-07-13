import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';


function useGetAndDeleteComments(campground) {
  const [comments, setComments] = useState([]);
  const [currAvgRating, setCurrAvgRating] = useState();
  const {
    id: campgroundId,
    rating
  } = campground;

  useEffect(() => {
    let mounted = true;
    axios.get(`/api/comments/${campgroundId}`)
      .then(({ data: { comments: incomingComments } }) => {
        if (mounted && comments.length !== incomingComments.length) {
          setComments(incomingComments);
        }
      })
      .then(() => {
        if (comments.length) {
          const avgRating = comments.reduce((a, b) => {
            return a + b.rating;
          }, 0) / comments.length;
          setCurrAvgRating(avgRating.toFixed(2));
        } else {
          setCurrAvgRating("0");
        }
      })
      .catch((err) => { console.error(err); });
    return () => { mounted = false; };
  }, [campgroundId, comments]);

  useEffect(() => {
    if (currAvgRating !== rating) {
      const url = `/api/campgrounds/rating/${campgroundId}`;
      const updatedCG = {
        ...campground,
        rating: currAvgRating
      }
      axios.put(url, updatedCG);
    }
  }, [campground, campgroundId, currAvgRating, rating])

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

  return [comments, deleteComment, currAvgRating];

}

export default useGetAndDeleteComments;
