import React, { Component } from 'react';
import {
  withRouter
} from 'react-router-dom';
import { Button, Container, Alert } from 'react-bootstrap';
import PropTypes from 'prop-types';
import '../app.css';
import axios from 'axios';
import getUploadedFileName from '../utils/getUploadedFileName';


class Signup extends Component {
  state = {
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password1: '',
    password2: '',
    adminCode: '',
    errorMessage: null,
    imageFile: {},
    message: 'Select avatar image (optional)'
  }

  componentDidMount() {
    const { history, loggedInAs } = this.props;
    if (loggedInAs.id.length > 0) {
      history.push('/campgrounds');
    }
  }

  componentDidUpdate() {
    const { history, loggedInAs } = this.props;

    if (loggedInAs.id.length > 0) {
      history.push('/campgrounds');
    }
  }

  goBack = () => {
    const { history } = this.props;
    history.goBack();
  }

  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSelectFile = (event) => {
    this.setState({
      image: event.target.files[0]
    });
  }

  renderAlert = () => {
    const { errorMessage } = this.state;
    if (errorMessage) {
      return (
        <Alert variant="danger">
          {errorMessage}
        </Alert>
      );
    }
    return null;
  }

  getFileName = (e) => {
    getUploadedFileName(e, this.setState.bind(this));
  }

  submitForm = async (event) => {
    event.preventDefault();
    const { history } = this.props;
    const {
      username,
      password1,
      password2,
      firstName,
      lastName,
      email,
      imageFile,
      adminCode
    } = this.state;

    if (password1 === password2) {
      const fd = new FormData();
      fd.append('username', username);
      fd.append('password', password1);
      fd.append('firstName', firstName);
      fd.append('lastName', lastName);
      fd.append('email', email);
      fd.append('adminCode', adminCode);
      if (imageFile) {
        fd.append('image', imageFile);
      }

      const config = {
        headers: {
          'content-type': 'multipart/form-data'
        }
      };
      try {
        const {
          status,
          data: {
            message
          }
        } = await axios.post('/api/users', fd, config);
        if (status === 201) {
          history.push({
            pathname: '/login',
            state: {
              alertMessage: {
                text: message,
                variant: 'success'
              }
            }
          });
        }
      } catch (err) {
        const { response: { status, data: message } } = err;
        this.setState({
          errorMessage: `${message} (${status})`
        });
      }
    } else {
      this.setState({
        errorMessage: 'Passwords do not match.'
      });
    }
  }

  render() {
    const {
      message, username, password1, password2, email, firstName, lastName, adminCode
    } = this.state;
    return (
      <div className="margin-top-50">
        {this.renderAlert()}
        <Container>
          <h1 className="text-center">Create your account</h1>
          <br />
          <form
            className="entryBox centered"
            onSubmit={this.submitForm}
          >
            <div className="form-group">
              <input
                className="form-control"
                type="text"
                name="username"
                placeholder="Username"
                value={username}
                onChange={this.onChange}
              />
            </div>
            <div className="form-group">
              <input
                className="form-control"
                type="password"
                name="password1"
                placeholder="Password"
                value={password1}
                onChange={this.onChange}
              />
            </div>
            <div className="form-group">
              <input
                className="form-control"
                type="password"
                name="password2"
                placeholder="Verify Password"
                value={password2}
                onChange={this.onChange}
              />
            </div>
            <div className="form-group">
              <input
                className="form-control"
                type="text"
                name="firstName"
                placeholder="First Name"
                value={firstName}
                onChange={this.onChange}
              />
            </div>
            <div className="form-group">
              <input
                className="form-control"
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={lastName}
                onChange={this.onChange}
              />
            </div>
            <div className="form-group">
              <input
                className="form-control"
                type="text"
                name="email"
                placeholder="Email"
                value={email}
                onChange={this.onChange}
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="file-upload"
                className="btn btn-outline-primary btn-block"
              >
                <input
                  id="file-upload"
                  type="file"
                  name="image"
                  data-multiple-caption={message}
                  onChange={this.getFileName}
                />
                <span>{message}</span>
              </label>
            </div>
            <div className="form-group">
              <input
                className="form-control"
                type="text"
                name="adminCode"
                placeholder="Admin Code (if applicable)"
                value={adminCode}
                onChange={this.onChange}
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
            <Button onClick={this.goBack} className="float-left" size="sm" variant="link">Go Back</Button>
          </form>
        </Container>
      </div>
    );
  }
}

Signup.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired
  }).isRequired,
  loggedInAs: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired
};

export default withRouter(Signup);
