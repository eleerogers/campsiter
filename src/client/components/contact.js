import React, { useContext, useEffect } from 'react';
import {
  Link, useHistory, useParams
} from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Button, Container } from 'react-bootstrap';
import { LoggedInAsContext } from './contexts/loggedInAsContext';
import useForm from '../hooks/useForm';
import useLoading from '../hooks/useLoading';
import LoadingButton from './loadingButton';

function Contact() {
  const { loggedInAs } = useContext(LoggedInAsContext);

  const initData = {
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  };
  const { values, handleChange, set } = useForm(initData);
  
  useEffect(() => {
    set(loggedInAs);
  }, [loggedInAs, set]);

  const { goBack } = useHistory();

  const [loading, setLoadingFalse, setLoadingTrue] = useLoading(false);

  async function submitForm(event) {
    event.preventDefault();
    setLoadingTrue();
    const url = `/api/users/contact`;
    try {
      const { data: { message }, status } = await axios.post(url, values);
      if (status === 201) {
        toast.success(message);
        goBack();
      }
    } catch (err) {
      const { response: { status, data } } = err;
      toast.error(`${data} (${status})`);
    } finally {
      setLoadingFalse();
    }
  }

  return (
    <div className="margin-top-50 marginBtm">
      <Container>
        <h1 className="text-center">
          Contact CampSiter
        </h1>
        <br />
        <form
          className="entryBox centered"
          onSubmit={submitForm}
        >
          <div className="form-group">
            <input
              className="form-control"
              type="text"
              name="firstName"
              placeholder="First Name"
              onChange={handleChange}
              value={values.firstName}
              required
            />
          </div>
          <div className="form-group">
            <input
              className="form-control"
              type="text"
              name="lastName"
              placeholder="Last Name (or initial)"
              onChange={handleChange}
              value={values.lastName}
              required
            />
          </div>
          <div className="form-group">
            <input
              className="form-control"
              type="text"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              value={values.email}
              required
            />
          </div>
          <div className="form-group">
            <textarea
              className="form-control inputTextBox"
              type="text"
              name="message"
              placeholder="Message"
              rows="5"
              onChange={handleChange}
              value={values.comment}
              required
            />
          </div>
          <br />
          <div className="form-group">
            <LoadingButton
              isLoading={loading}
              className="btn-block loading-button"
              variant="primary"
              type="submit"
            >
              Submit
            </LoadingButton>
          </div>
          <Button
            onClick={goBack}
            size="sm"
            variant="link"
            className="float-left"
          >
            Go Back
          </Button>
        </form>
      </Container>
    </div>
  );
}

export default Contact;