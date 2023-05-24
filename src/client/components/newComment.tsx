import React, { useContext, useEffect, useRef, useMemo } from 'react';
import {
  Link, useHistory, useParams
} from 'react-router-dom';
import axios, { AxiosError, CancelTokenSource } from 'axios';
import { toast } from 'react-toastify';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { LoggedInAsContext } from './contexts/loggedInAsContext';
import useForm from '../hooks/useForm';
import useLoading from '../hooks/useLoading';
import LoadingButton from './loadingButton';
import StarRating from './starRating';
import { ICampground, IComment, ILoggedInAsContext } from '../interfaces';


interface IHistory {
  campground: ICampground;
  commentObj?: IComment;
  comments?: IComment[];
  loggedInAsId?: string;
}

function NewComment() {
  const {
    loggedInAs: {
      id: userId,
      admin: adminBool
    }
  } = useContext(LoggedInAsContext) as ILoggedInAsContext;
  const initData = useMemo(() => {
    return {
      rating: 0,
      comment: '',
      userId,
      adminBool,
      avgRating: null
    }
  }, [adminBool, userId]);
  const {
      values,
      handleChange,
      changeRating,
      set
  } = useForm(initData);
  
  useEffect(() => {
    if (initData.userId !== values.userId) {
      set(initData);
    }
  }, [set, initData, values.userId]);

  const {
    location: {
      state: {
        campground,
        comments
      }
    },
    push
  } = useHistory<IHistory>();

  type IdParam = {
    id: string;
  }
  const { id } = useParams<IdParam>();
  
  useEffect(() => {
    if (!localStorage.userId) {
      push('/login');
    }
  }, [push]);

  useEffect(() => {
    if (comments) {
      var prevReview = comments.find(comment => {
        return comment.user_id === Number(userId);
      });
    }
    if (prevReview) {
      push({
        pathname: `/campgrounds/${campground.id}/comments/edit`,
        state: {
          campground,
          loggedInAsId: userId,
          commentObj: prevReview
        }
      })
    }
  }, [push, campground, comments, userId]);  

  const [loading, setLoadingFalse, setLoadingTrue] = useLoading(false);

  const cancelTokenRef = useRef<CancelTokenSource>();
  useEffect(() => {
    return () => {
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel();
      }
    }
  }, []);
  
  async function submitForm(event: React.FormEvent) {
    event.preventDefault();
    setLoadingTrue();
    const url = `/api/comments/${id}`;
    cancelTokenRef.current = axios.CancelToken.source();
    const cancelToken = cancelTokenRef.current.token;
    try {
      const { data, status } = await axios.post(url, values, { cancelToken });
      if (status === 200) {
        toast.success(data);
        push({
          pathname: `/campgrounds/${id}`,
          state: {
            campground
          }
        });
      }
    } catch (error) {
      const err = error as AxiosError;
      if (axios.isCancel(err)) {
        console.log(`axios call was cancelled`);
      } else {
        if (err.response && err.response.data) {
          const { response: { data: message } } = err;
          toast.error(`${message}`);
        }
      }
    } finally {
      setLoadingFalse();
    }
  }

  return (
    <div className="comment-padding-top marginBtm">
      <Container>
        <h1 className="text-center color-dark-blue">Review<br /> {campground.name}</h1>
        <br />
        <form
          className="entryBox centered"
          onSubmit={submitForm}
        >
          <div className="form-group">
            <StarRating
              currRating={values.rating}
              handleChange={changeRating}
              readonly={false}
              className="star-lg m-1"
              divClassName="justify-centered mb-3"
            />
            <textarea
              className="form-control inputTextBox mt-4"
              name="comment"
              placeholder="Comment"
              rows={5}
              onChange={handleChange}
              value={values.comment}
            />
          </div>
          <br />
          <div className="form-group">
            <LoadingButton
              isLoading={loading}
              className="btn-block loading-button btn-orange btn-square"
              variant="primary"
              type="submit"
            >
              Submit
            </LoadingButton>
          </div>
          <Link to={{
            pathname: `/campgrounds/${id}`,
            state: {
              campground
            }
          }}
          >
            <Button
              size="sm"
              variant="link"
              className="float-left go-back-btn"
            >
              Go Back
            </Button>
          </Link>
        </form>
      </Container>
    </div>
  );
}

export default NewComment;
