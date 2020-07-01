import React from 'react';
import {
  Link, useHistory, useParams
} from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import useForm from '../hooks/useForm';
import useLoading from '../hooks/useLoading';
import LoadingButton from './loadingButton';

function EditComment() {
  const {
    location: {
      state: {
        campground,
        adminBool,
        commentObj: {
          comment_id: commentId,
          user_id: userId,
          comment
        }
      }
    },
    push
  } = useHistory();

  const { id } = useParams();

  const [loading, setLoadingFalse, setLoadingTrue] = useLoading(false);

  const initFormData = {
    commentId,
    userId,
    campgroundId: id,
    comment,
    user: { id: userId },
    adminBool
  };
  const { values, handleChange } = useForm(initFormData);

  async function submitForm(event) {
    event.preventDefault();
    setLoadingTrue();
    const url = `/api/comments/${id}`;
    try {
      const { data, status } = await axios.put(url, values);
      if (status === 200) {
        toast.success(data);
        push({
          pathname: `/campgrounds/${id}`,
          state: {
            campground
          }
        });
      }
    } catch (err) {
      const { response: { status, data } } = err;
      toast.error(`${data} (${status})`);
    } finally {
      setLoadingFalse();
    }
  }

  return (
    <div className="comment-padding-top marginBtm">
      <Container>
        <h1 className="text-center color-dark-blue">Edit Comment on<br /> {campground.name}</h1>
        <br />
        <form
          className="entryBox centered"
          onSubmit={submitForm}
        >
          <div className="form-group">
            <textarea
              className="form-control inputTextBox"
              type="text"
              name="comment"
              placeholder="Comment"
              rows="5"
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
              className="float-left text-primary text-primary-hover"
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
