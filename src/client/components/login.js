import React, { Component } from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import { Button, Container, Alert } from 'react-bootstrap';
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
            onSubmit={e => submitLogin(e, history)}
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
            <Link to="/campgrounds">
              <Button className="float-left" size="sm" variant="link">Go Back</Button>
            </Link>
          </form>
        </Container>
      </div>
    );
  }
}
export default withRouter(Login);
