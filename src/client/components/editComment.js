import React from 'react';
import {
  Link,
  useHistory,
  useParams
} from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Button, Container } from 'react-bootstrap';
import useForm from '../hooks/useForm';
import '../app.css';

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
    }
  }

  return (
    <div className="margin-top-50">
      <Container>
        <h1 className="text-center">Comment on This Campground</h1>
        <br />
        <form
          className="entryBox centered"
          onSubmit={submitForm}
        >
          <div className="form-group">
            <input
              className="form-control"
              type="text"
              name="comment"
              placeholder="Comment"
              onChange={handleChange}
              value={values.comment || ''}
            />
          </div>
          <br />
          <div className="form-group">
            <Button
              className="btn-block"
              variant="primary"
              type="submit"
            >
              Submit
            </Button>
          </div>
          <Link to={{
            pathname: `/campgrounds/${id}`,
            state: {
              campground
            }
          }}
          >
            <Button size="sm" variant="link">Go Back</Button>
          </Link>
        </form>
      </Container>
    </div>
  );
}

export default EditComment;
