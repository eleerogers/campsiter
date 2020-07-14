import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';


function useGetAndDeleteComments(campground) {
  const {
    id: campgroundId,
    rating
  } = campground;
  const [comments, setComments] = useState([]);
  const [currAvgRating, setCurrAvgRating] = useState(null);

  useEffect(() => {
    let mounted = true;
    axios.get(`/api/comments/${campgroundId}`)
      .then(({ data: { comments: incomingComments } }) => {
        if (mounted && comments.length !== incomingComments.length) {
          setComments(incomingComments);
        }
      })
      .then(() => {
        if (comments.length > 0) {
          let numRatings = 0;
          const avgRating = comments.reduce((a, b) => {
            const bNumRating = Number(b.rating);
            if (bNumRating > 0) {
              numRatings += 1;
              return a + bNumRating;
            } else {
              return a;
            }
          }, 0) / numRatings;
          setCurrAvgRating(avgRating.toFixed(2));
        } else {
          setCurrAvgRating("0");
        }
      })
      .then(() => {
        if (
          Number(currAvgRating) > 0
          || currAvgRating === "0" && comments.length === 0
        ) {
          const url = `/api/campgrounds/rating/${campgroundId}`;
          const updatedCG = {
            ...campground,
            rating: currAvgRating
          }
          axios.put(url, updatedCG);
        }
      })
      .catch((err) => { console.error(err); });
    return () => { mounted = false; };
  }, [campgroundId, comments, campground, currAvgRating, rating]);

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
