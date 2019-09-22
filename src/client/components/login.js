import React, { Component } from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import { Button, Container, Alert } from 'react-bootstrap';
import PropTypes from 'prop-types';
import '../app.css';


class Login extends Component {
  state = {
    alertMessage: null
  }

  componentDidMount() {
    const { location } = this.props;
    const { state } = location;
    if (state) {
      const { alertMessage } = state;
      this.setState({ alertMessage });
    }
  }

  renderAlert = () => {
    const { errorMessage } = this.props;
    if (errorMessage) {
      return (
        <Alert variant="danger">
          {errorMessage}
        </Alert>
      );
    }
    return null;
  }

  renderSucessAlert = () => {
    const { alertMessage } = this.state;
    if (alertMessage) {
      const { text, variant } = alertMessage;
      return (
        <Alert variant={variant}>
          {text}
        </Alert>
      );
    }
    return null;
  }

  goBack = () => {
    const { history } = this.props;
    history.goBack();
  }

  render() {
    const {
      emailForm,
      passwordForm,
      onFormChange,
      submitLogin,
      history
    } = this.props;
    return (
      <div className="margin-top-50">
        {this.renderAlert()}
        {this.renderSucessAlert()}
        <Container>
          <h1 className="text-center">Login to your account</h1>
          <br />
          <form
            className="entryBox centered"
            onSubmit={(e) => submitLogin(e, history)}
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
            <Button onClick={this.goBack} className="float-left" size="sm" variant="link">Go Back</Button>
          </form>
        </Container>
      </div>
    );
  }
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
  submitLogin: PropTypes.func.isRequired
};

Login.defaultProps = {
  errorMessage: null,
  emailForm: '',
  passwordForm: ''
};

export default withRouter(Login);
