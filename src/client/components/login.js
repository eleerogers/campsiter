import React, { useEffect, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';
import PropTypes from 'prop-types';
import '../app.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { LoggedInAsContext } from './loggedInAsContext';


function Login({
  loginFormValues, onFormChange
}) {
  const { emailForm, passwordForm } = loginFormValues;
  const {
    push,
    goBack,
    length
  } = useHistory();
  const { loggedInAs, setLoggedInAs } = useContext(LoggedInAsContext);

  useEffect(() => {
    if (loggedInAs.id.length > 0) {
      push('/campgrounds');
    }
  }, [loggedInAs, push]);

  function goBackOrToCampgrounds() {
    if (length > 2) {
      goBack();
    } else {
      push('/campgrounds');
    }
  }

  // function submitLogin(e) {
  //   submitLogin(e, goBack);
  // }

  async function submitLogin(event) {
    event.preventDefault();
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
              className="form-control"
              type="text"
              name="emailForm"
              placeholder="Email"
              value={emailForm}
              onChange={onFormChange}
            />
          </div>
          <div className="form-group mb-1">
            <input
              className="form-control"
              type="password"
              name="passwordForm"
              placeholder="Password"
              value={passwordForm}
              onChange={onFormChange}
            />
          </div>
          <Link to="/forgot">
            <Button size="sm" variant="link">Forgot Password</Button>
          </Link>
          <br />
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
          <Button
            onClick={goBackOrToCampgrounds}
            className="float-left"
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

Login.propTypes = {
  loginFormValues: PropTypes.shape({
    emailForm: PropTypes.string,
    passwordForm: PropTypes.string,
  }).isRequired,
  onFormChange: PropTypes.func.isRequired
};

export default Login;
