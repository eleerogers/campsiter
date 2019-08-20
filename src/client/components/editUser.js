import React, { Component } from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import { Button, Container, Alert } from 'react-bootstrap';
import '../app.css';

const axios = require('axios');


class EditUser extends Component {
  state = {
    id: null,
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    // password: '',
    image: '',
    imageId: '',
    admin: '',
    adminCode: '',
    errorMessage: null,
    message: 'Change Profile Image'
  }

  componentDidMount() {
    // const { location } = this.props;
    // const { state } = location;
    // const { loggedInAs } = state;
    const { loggedInAs } = this.props;
    const {
      id,
      username,
      firstName,
      lastName,
      email,
      // password,
      image,
      imageId,
      admin
    } = loggedInAs;
    this.setState({
      id,
      username,
      firstName,
      lastName,
      email,
      // password,
      image,
      imageId,
      admin
    });
  }

  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
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
      id,
      username,
      // password,
      firstName,
      lastName,
      email,
      image,
      imageId,
      // admin,
      adminCode
    } = this.state;
    const fd = new FormData();
    fd.append('id', id);
    fd.append('username', username);
    // fd.append('password', password);
    fd.append('firstName', firstName);
    fd.append('lastName', lastName);
    fd.append('email', email);
    fd.append('image', image);
    fd.append('imageId', imageId);
    // fd.append('admin', admin);
    fd.append('adminCode', adminCode);

    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };
    axios.put('/api/ycusers', fd, config)
      .catch((error) => {
        // response = res;
        if (error.response.status === 409) {
          this.setState({
            errorMessage: 'Email address or user name already in use'
          });
        }
        if (error.response.status === 400) {
          this.setState({
            errorMessage: 'Invalid email'
          });
        }
        return error;
      })
      .then((res) => {
        const { updateLoggedinasState } = this.props;
        const {
          admin,
          // id,
          // username,
          password,
          // first_name: firstName,
          // last_name: lastName,
          // email,
          // image,
          // image_id: imageId,
          createdAt,
        } = res.data;
        const { status } = res;
        if (status === 201) {
          updateLoggedinasState({
            admin,
            id,
            username,
            password,
            firstName,
            lastName,
            email,
            image,
            imageId,
            createdAt,
          });
          const { correctAdminCode } = res;
          let text = '';
          if (correctAdminCode) {
            text = 'Succesfully edited admin account.';
          } else {
            text = 'Succesfully edited account (non-admin).';
          }
          history.push({
            pathname: `/ycusers/${id}`,
            state: {
              alertMessage: {
                text,
                variant: 'success'
              },
              author: {
                admin,
                id,
                username,
                firstName,
                lastName,
                email,
                image,
                imageId
              }
            }
          });
        }
      })
      .catch(error => console.error('Error:', error));
  }


  renderAdminBox = () => {
    const { admin } = this.state;
    if (!admin) {
      return (
        <div className="form-group">
          <input
            className="form-control"
            type="text"
            name="adminCode"
            placeholder="Admin Code (if applicable)"
            onChange={this.onChange}
          />
        </div>
      );
    }
    return null;
  }

  render() {
    const {
      username,
      firstName,
      lastName,
      email,
      password,
      image,
      imageId,
      adminCode,
      message
    } = this.state;
    return (
      <div className="margin-top-50">
        {this.renderAlert()}
        <Container>
          <h1 className="text-center">
            Edit your account details:
            {' '}
            {username}
          </h1>
          <br />
          <form
            className="entryBox centered"
            onSubmit={this.submitForm}
          >
            {/* <div className="form-group">
              <input
                className="form-control"
                type="text"
                name="username"
                value={username}
                placeholder="Username"
                onChange={this.onChange}
              />
            </div>
            <div className="form-group">
              <input
                className="form-control"
                type="text"
                name="password"
                value={password}
                placeholder="Password"
                onChange={this.onChange}
              />
            </div> */}
            <div className="form-group">
              <input
                className="form-control"
                type="text"
                name="firstName"
                value={firstName}
                placeholder="First Name"
                onChange={this.onChange}
              />
            </div>
            <div className="form-group">
              <input
                className="form-control"
                type="text"
                name="lastName"
                value={lastName}
                placeholder="Last Name"
                onChange={this.onChange}
              />
            </div>
            <div className="form-group">
              <input
                className="form-control"
                type="text"
                name="email"
                value={email}
                placeholder="Email"
                onChange={this.onChange}
              />
            </div>
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
            {this.renderAdminBox()}
            <div className="form-group">
              <Button
                className="btn-block"
                variant="primary"
                type="submit"
              >
              Submit
              </Button>
            </div>
            {/* fix below to go back to profile */}
            <Link to="/campgrounds">
              <Button size="sm" variant="link">Go Back</Button>
            </Link>
          </form>
        </Container>
      </div>
    );
  }
}
export default withRouter(EditUser);
