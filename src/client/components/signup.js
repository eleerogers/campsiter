import React, { Component } from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import { Button, Container, Alert } from 'react-bootstrap';
import '../app.css';

const axios = require('axios'); 


class Signup extends Component {
  state = {
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    adminCode: '',
    errorMessage: null,
    image: '',
    message: 'Select avatar image (optional)'
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

  getUploadedFileName = (e) => {
    const { files } = e.target;
    const { value } = e.target;
    let message;
    if (files && files.length > 1) message = `${files.length} files selected`;
    else message = value.split('\\').pop();

    if (message) this.setState({ ...this.state, message });
    this.setState({
      image: e.target.files[0]
    });
  }

  submitForm = (event) => {
    event.preventDefault();
    const { history } = this.props;
    const {
      username,
      password,
      first_name,
      last_name,
      email,
      image,
      adminCode
    } = this.state;
    const fd = new FormData();
    fd.append('username', username);
    fd.append('password', password);
    fd.append('first_name', first_name);
    fd.append('last_name', last_name);
    fd.append('email', email);
    fd.append('image', image);
    fd.append('adminCode', adminCode);

    // let response = {};
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };
    axios.post('/api/ycusers', fd, config)
      .catch((error) => {
        if (error.response.status === 409) {
          this.setState({
            errorMessage: 'Email address or user name already in use'
          });
        }
        if (error.response.status === 400) {
          this.setState({
            errorMessage: 'Invalid email and/or password'
          });
        }
        return error;
      })
      .then((res) => {
        const { status } = res;
        if (status === 201) {
          const { correctAdminCode } = res;
          let text = '';
          if (correctAdminCode) {
            text = 'Succesfully created new admin account. Please login.';
          } else {
            text = 'Succesfully created new account (non-admin). Please login.';
          }
          history.push({
            pathname: '/login',
            state: {
              alertMessage: {
                text,
                variant: 'success'
              }
            }
          });
        }
      })
      .catch(error => console.error('Error:', error));
  }

  render() {
    const { message } = this.state;
    return (
      <div className="margin-top-50">
        {this.renderAlert()}
        <Container>
          <h1 className="text-center">Create your account</h1>
          <br />
          <div className="entryBox centered">
            <div className="form-group">
              <input
                className="form-control"
                type="text"
                name="username"
                placeholder="Username"
                onChange={this.onChange}
              />
            </div>
            <div className="form-group">
              <input
                className="form-control"
                type="text"
                name="password"
                placeholder="Password"
                onChange={this.onChange}
              />
            </div>
            <div className="form-group">
              <input
                className="form-control"
                type="text"
                name="first_name"
                placeholder="First Name"
                onChange={this.onChange}
              />
            </div>
            <div className="form-group">
              <input
                className="form-control"
                type="text"
                name="last_name"
                placeholder="Last Name"
                onChange={this.onChange}
              />
            </div>
            <div className="form-group">
              <input
                className="form-control"
                type="text"
                name="email"
                placeholder="Email"
                onChange={this.onChange}
              />
            </div>
            {/* <div className="form-group">
              <input
                className="form-control"
                type="text"
                name="avatar"
                placeholder="Avatar URL (optional)"
                onChange={this.onChange}
              />
            </div> */}
            {/* <div className="form-group">
              <label
                className="btn btn-outline-primary btn-block"
                id="file"
                htmlFor="file"
              >
                <input
                  className="hidden"
                  type="file"
                  id="file"
                  name="image"
                  accept="image/*"
                  placeholder="Upload Avatar (optional)"
                  onChange={this.handleSelectFile}
                />
                  Select Image File
              </label>
            </div> */}
            <div className="form-group">
              <input
                id="file-upload"
                type="file"
                name="image"
                  // className="km-btn-file"
                data-multiple-caption={message}
                  // multiple={multiple}
                onChange={this.getUploadedFileName}
              />
              <label
                htmlFor="file-upload"
                className="btn btn-outline-primary btn-block"
                id="file-upload"
              >
                <span>{message}</span>
              </label>
            </div>
            <div className="form-group">
              <input
                className="form-control"
                type="text"
                name="adminCode"
                placeholder="Admin Code (if applicable)"
                onChange={this.onChange}
              />
            </div>
            <br />
            <div className="form-group">
              <Button
                className="btn-block"
                variant="primary"
                type="submit"
                onClick={this.submitForm}
              >
              Submit
              </Button>
            </div>
            <Link to="/campgrounds" className="float-left">
              <Button size="sm" variant="link">Go Back</Button>
            </Link>
          </div>
        </Container>
      </div>
    );
  }
}
export default withRouter(Signup);
