import React, { Component } from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import { Button, Container, Alert } from 'react-bootstrap';
import '../app.css';


// eslint-disable-next-line react/prefer-stateless-function
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

  submitLoginThenRedirect = (e) => {
    const { submitLogin, history } = this.props;
    submitLogin(e, history);
    // .then(() => {
    //   history.push('/campgrounds');
    // });
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
    } = this.props;
    return (
      <div className="margin-top-50">
        {this.renderAlert()}
        {this.renderSucessAlert()}
        <Container>
          <h1 className="text-center">Login to your account</h1>
          <div className="entryBox centered">
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
            <div className="form-group">
              <input
                className="form-control"
                type="password"
                name="passwordForm"
                placeholder="Password"
                value={passwordForm}
                onChange={onFormChange}
              />
            </div>
            <div className="form-group">
              <Button
                className="btn-block"
                variant="primary"
                type="submit"
                onClick={e => this.submitLoginThenRedirect(e)}
              >
              Submit
              </Button>
            </div>
            <Link to="/forgot">
              <Button size="sm" variant="link">Forgot Password</Button>
            </Link>
            <br />
            <br />
            <Link to="/campgrounds">
              <Button size="sm" variant="link">Go Back</Button>
            </Link>
          </div>
        </Container>
      </div>
    );
  }
}
export default withRouter(Login);
