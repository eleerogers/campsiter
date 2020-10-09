import React, { useContext, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { LoggedInAsContext } from './contexts/loggedInAsContext';
import useForm from '../hooks/useForm';
import useLoading from '../hooks/useLoading';
import LoadingButton from './loadingButton';


function Contact() {
  const {
    goBack,
    location: { state }
  } = useHistory();
  const { loggedInAs } = useContext(LoggedInAsContext);

  const emailTo = state && state.author && state.author.email || process.env.REACT_APP_ADMIN_EMAIL;
  const usernameTo = state && state.author && state.author.username || 'CampSiter';
  const subTitle = state && state.author 
  ? <>{state.author.first_name} {state.author.last_name} will receive your email address<br /> to be able to respond directly</>
  : 'Comments? Questions? Get in touch!';

  const initData = {
    firstName: '',
    lastName: '',
    email: '',
    message: '',
    emailTo,
    usernameTo
  };

  const { values, handleChange, set } = useForm(initData);

  useEffect(() => {
    if (window.pageYOffset > 115) {
      window.scrollTo(0, 0);
    }
  }, []);
  
  useEffect(() => {
    set(loggedInAs);
  }, [loggedInAs, set]);

  const [loading, setLoadingFalse, setLoadingTrue] = useLoading(false);

  const cancelTokenRef = useRef();
  useEffect(() => {
    return () => {
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel();
      }
    }
  }, []);
  
  async function submitForm(event) {
    event.preventDefault();
    setLoadingTrue();
    const url = '/api/users/contact';
    cancelTokenRef.current = axios.CancelToken.source()
    const cancelToken = cancelTokenRef.current.token;
    try {
      const { data: { message }, status } = await axios.post(url, values, { cancelToken });
      if (status === 201) {
        toast.success(message);
        goBack();
      }
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log(`axios call was cancelled`);
      } else {
        const { response: { data: message } } = err;
        toast.error(`${message}`);
      }
    } finally {
      setLoadingFalse();
    }
  }

  return (
    <div className="contact-padding-top marginBtm">
      <Container className="color-dark-blue">
        <h1 className="text-center">
          Contact {usernameTo}
        </h1>
        <p className="text-center"><i>
          {subTitle}
        </i></p>
        <br />
        <form
          className="entryBox centered"
          onSubmit={submitForm}
        >
          {!localStorage.userId &&
            <div className="form-group">
              <input
                className="form-control"
                type="email"
                name="email"
                placeholder="Your Email"
                onChange={handleChange}
                value={values.email}
                required
              />
            </div>
          }
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
              className="btn-block loading-button btn-orange btn-square"
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
            className="float-left go-back-btn"
          >
            Go Back
          </Button>
        </form>
      </Container>
    </div>
  );
}

export default Contact;