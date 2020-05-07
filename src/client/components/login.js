import React, { useState, useEffect } from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import { Button, Container, Alert } from 'react-bootstrap';
import PropTypes from 'prop-types';
import '../app.css';


function Login({
  location, errorMessage, history, emailForm, passwordForm, onFormChange, submitLogin, loggedInAs
}) {
  const [alertMsg, setAlertMsg] = useState(null);

  useEffect(() => {
    if (loggedInAs.id.length > 0) {
      history.push('/campgrounds');
    }
    const { state } = location;
    if (state) {
      const { alertMessage } = state;
      setAlertMsg(alertMessage);
    }
  }, [loggedInAs]);

  const renderAlert = () => {
    if (errorMessage) {
      return (
        <Alert variant="danger">
          {errorMessage}
        </Alert>
      );
    }
    return null;
  };

  const renderSucessAlert = () => {
    if (alertMsg) {
      const { text, variant } = alertMsg;
      return (
        <Alert variant={variant}>
          {text}
        </Alert>
      );
    }
    return null;
  };

  const goBack = () => {
    if (window.history.length > 2) {
      history.goBack();
    } else {
      history.push('/campgrounds');
    }
  };

  return (
    <div className="margin-top-50">
      {renderAlert()}
      {renderSucessAlert()}
      <Container>
        <h1 className="text-center">Login to your account</h1>
        <br />
        <form
          className="entryBox centered"
          onSubmit={(e) => submitLogin(e, goBack)}
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
          <Button onClick={goBack} className="float-left" size="sm" variant="link">Go Back</Button>
        </form>
      </Container>
    </div>
  );
}

Login.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      alertMessage: PropTypes.shape({
        text: PropTypes.string,
        variant: PropTypes.string
      }),
    })
  }).isRequired,
  errorMessage: PropTypes.string,
  emailForm: PropTypes.string,
  passwordForm: PropTypes.string,
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
  errorMessage: null,
  emailForm: '',
  passwordForm: '',
  loggedInAs: null
};

export default withRouter(Login);
