import { useState, useEffect, useRef } from 'react';
import axios, { AxiosError, CancelTokenSource } from 'axios';
import { toast } from 'react-toastify';
import { ICampground, IComment } from '../interfaces';


function useGetAndDeleteComments(campground: ICampground) {
  const {
    id: campgroundId
  } = campground;
  const [comments, setComments] = useState<IComment[]>([]);
  const [currAvgRating, setCurrAvgRating] = useState('');
  const [avgCalculated, setAvgCalculated] = useState(false);

  useEffect(() => {
    let useEffectSource = axios.CancelToken.source();
    if (campgroundId > 0 && comments.length === 0) {
      axios.get(`/api/comments/${campgroundId}`, { cancelToken: useEffectSource.token})
        .then(({ data: { comments: incomingComments } }) => {
          if (comments.length !== incomingComments.length) {
            setComments(incomingComments);
          }
        })
        .catch((err) => {
          if (axios.isCancel(err)) {
            console.log(`axios call was cancelled`);
          } else {
            console.error(err);
          }
        });
    }
    return () => { useEffectSource.cancel() };
  }, [campgroundId, comments.length]);

  useEffect(() => {
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
      const avgRatingFixed = avgRating.toFixed(2);
      if (currAvgRating !== avgRatingFixed) {
        setCurrAvgRating(avgRatingFixed);
      }
      setAvgCalculated(true);
    } else {
      setCurrAvgRating("0");
    }
    
  }, [comments, currAvgRating]);

  useEffect(() => {
    let useEffectSource = axios.CancelToken.source();
    if (avgCalculated && campground.rating !== currAvgRating) {
      const url = `/api/campgrounds/rating/${campgroundId}`;
      const updatedCG = {
        ...campground,
        rating: currAvgRating
      }
      axios.put(
        url, updatedCG, 
        { cancelToken: useEffectSource.token }
      )
      .catch((err) => { console.log("problem updating campground rating", err) });
    }
    return () => { useEffectSource.cancel() };
  }, [currAvgRating, campground, campgroundId, avgCalculated]);


  const cancelTokenRef = useRef<CancelTokenSource>();
  useEffect(() => {
    return () => {
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel();
      }
    }
  }, []);
  
  async function deleteComment(commentObj: IComment, loggedInAsAdmin: boolean) {
    cancelTokenRef.current = axios.CancelToken.source();
    const cancelToken = cancelTokenRef.current.token;
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
      } = await axios.delete(url, { data: commentData, cancelToken });
      setComments(updatedComments);
      toast.success(message);
    } catch (error) {
      const err = error as AxiosError
      if (axios.isCancel(err)) {
        console.log(`axios call was cancelled`);
      } else {
        if (err.response && err.response.data) {
          const { response: { data: message } } = err;
          toast.error(`${message}`);
        }
      }
    }
  }

  return [comments, deleteComment, currAvgRating] as const;

}

export default useGetAndDeleteComments;
