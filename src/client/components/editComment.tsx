import React, { useEffect, useRef } from 'react';
import {
  Link, useHistory, useParams
} from 'react-router-dom';
import axios, { AxiosError, CancelTokenSource } from 'axios';
import { toast } from 'react-toastify';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import useForm from '../hooks/useForm';
import useLoading from '../hooks/useLoading';
import LoadingButton from './loadingButton';
import StarRating from './starRating';
import { ICampground, IComment } from '../interfaces';


interface IHistory {
  campground: ICampground;
  loggedInAsAdmin?: boolean;
  commentObj: IComment;
}

function EditComment() {
  const {
    location: {
      state: {
        campground,
        loggedInAsAdmin: adminBool,
        commentObj: {
          comment_id: commentId,
          user_id: userId,
          comment,
          rating,
          username,
          created_at
        }
      }
    },
    push
  } = useHistory<IHistory>();

  type IdParam = {
    id: string;
  }
  const { id } = useParams<IdParam>();

  const [loading, setLoadingFalse, setLoadingTrue] = useLoading(false);

  const initFormData = {
    commentId,
    userId,
    campgroundId: id,
    comment,
    user: { id: userId },
    adminBool,
    rating
  };
  const { values, handleChange, changeRating } = useForm(initFormData);

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
    cancelTokenRef.current = axios.CancelToken.source()
    const cancelToken = cancelTokenRef.current.token;
    const url = `/api/comments/${id}`;
    try {
      const { data, status } = await axios.put(url, values, { cancelToken });
      if (status === 200) {
        toast.success(data);
        push({
          pathname: `/campgrounds/${id}`,
          state: {
            campground,
            commentObj: {
              comment_id: commentId,
              user_id: userId,
              comment,
              rating,
              username,
              created_at
            }
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
        <h1 className="text-center color-dark-blue">Edit Review of<br />{campground.name}</h1>
        <br />
        <form
          className="entryBox centered"
          onSubmit={submitForm}
        >
          <div className="form-group">
            <StarRating
              currRating={values.rating && values.rating}
              handleChange={changeRating}
              readonly={false}
              className="star-lg m-1"
              divClassName="justify-centered mb-3"
            />
            <textarea
              className="form-control inputTextBox"
              name="comment"
              placeholder="Comment"
              rows={5}
              onChange={handleChange}
              value={values.comment || ''}
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

export default EditComment;
