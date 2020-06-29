import React, { useEffect, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { LoggedInAsContext } from './contexts/loggedInAsContext';
import useForm from '../hooks/useForm';
import useLoading from '../hooks/useLoading';
import LoadingButton from './loadingButton';



function Login() {
  const loginInit = {
    emailForm: '',
    passwordForm: '',
  };
  const {
    handleChange: loginFormHandleChange,
    values: {
      emailForm,
      passwordForm
    }
  } = useForm(loginInit);

  const {
    push,
    goBack,
    length
  } = useHistory();
  const { loggedInAs, setLoggedInAs } = useContext(LoggedInAsContext);

  const [loading, setLoadingFalse, setLoadingTrue] = useLoading(false);

  useEffect(() => {
    if (loggedInAs.id.length > 0) {
      push('/campgroundsHome');
    }
  }, [loggedInAs, push]);

  // after doing a password reset this prevents
  // sending you back to the 'enter new password page'
  // after pressing the 'go back' link
  function goBackOrToCampgrounds() {
    if (length > 2) {
      goBack();
    } else {
      push('/campgroundsHome');
    }
  }

  async function submitLogin(event) {
    event.preventDefault();
    setLoadingTrue();
    try {
      const loginInfo = {
        email: emailForm,
        password: passwordForm
      };
      const { data } = await axios.post('/api/users/login/', loginInfo);
      localStorage.userId = data.id;
      setLoggedInAs(data);
      goBack();
    } catch (err) {
      const { response: { status, data: message } } = err;
      toast.error(`${message} (${status})`);
    } finally {
      setLoadingFalse();
    }
  }

  return (
    <div className="margin-top-50">
      <Container>
        <h1 className="text-center">Login to your account</h1>
        <br />
        <form
          className="entryBox centered"
          onSubmit={submitLogin}
        >
          <div className="form-group">
            <input
              className="form-control shadow-none"
              type="text"
              name="emailForm"
              placeholder="Email"
              value={emailForm}
              onChange={loginFormHandleChange}
            />
          </div>
          <div className="form-group mb-1">
            <input
              className="form-control shadow-none"
              type="password"
              name="passwordForm"
              placeholder="Password"
              value={passwordForm}
              onChange={loginFormHandleChange}
            />
          </div>
          <Link to="/forgot">
            <Button className="go-back-btn" size="sm" variant="link">Forgot Password</Button>
          </Link>
          <br />
          <br />
          <div className="form-group">
            <LoadingButton
              isLoading={loading}
              className="btn-block loading-button btn-orange btn-square shadow-none"
              variant="primary"
              type="submit"
            >
              Submit
            </LoadingButton>
          </div>
          <Button
            onClick={goBackOrToCampgrounds}
            className="float-left marginBtm go-back-btn"
            size="sm"
            variant="link"
          >
            Go Back
          </Button>
        </form>
      </Container>
    </div>
  );
}

export default Login;
