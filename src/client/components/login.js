import React, { useEffect } from 'react';
import {
  Link,
  useHistory
} from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';
import PropTypes from 'prop-types';
import '../app.css';


function Login({
  loginFormValues, onFormChange, submitLogin, loggedInAs
}) {
  const { emailForm, passwordForm } = loginFormValues;
  const {
    // location: {
    //   state
    // },
    push,
    goBack,
    length
  } = useHistory();

  useEffect(() => {
    if (loggedInAs.id.length > 0) {
      push('/campgrounds');
    }
  }, [loggedInAs, push]);

  // useEffect(() => {
  //   setAlertMessage(null);
  //   if (state) {
  //     const { alertMessage: newAlertMsg } = state;
  //     setAlertMessage(newAlertMsg);
  //   }
  // }, [state]);

  // function renderAlert() {
  //   if (alertMessage) {
  //     const { text, variant } = alertMessage;
  //     return (
  //       <Alert variant={variant}>
  //         {text}
  //       </Alert>
  //     );
  //   }
  //   return null;
  // }

  function goBackOrToCampgrounds() {
    if (length > 2) {
      goBack();
    } else {
      push('/campgrounds');
    }
  }

  function loginHandler(e) {
    submitLogin(e, goBack);
  }

  return (
    <div className="margin-top-50">
      {/* {renderAlert()} */}
      <Container>
        <h1 className="text-center">Login to your account</h1>
        <br />
        <form
          className="entryBox centered"
          onSubmit={loginHandler}
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
  // alertMessage: PropTypes.shape({
  //   text: PropTypes.string,
  //   variant: PropTypes.string
  // }),
  // setAlertMessage: PropTypes.func.isRequired,
  loginFormValues: PropTypes.shape({
    emailForm: PropTypes.string,
    passwordForm: PropTypes.string,
  }).isRequired,
  onFormChange: PropTypes.func.isRequired,
  submitLogin: PropTypes.func.isRequired,
  loggedInAs: PropTypes.shape({
    id: PropTypes.string,
    password: PropTypes.string,
    email: PropTypes.string,
    created_at: PropTypes.string,
    admin: PropTypes.bool,
  })
};

Login.defaultProps = {
  // alertMessage: null,
  loggedInAs: null
};

export default Login;
