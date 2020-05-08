import React, { Component } from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import { Button, Container, Alert } from 'react-bootstrap';
import '../app.css';
import axios from 'axios';
import PropTypes from 'prop-types';
import getUploadedFileName from '../utils/getUploadedFileName';


class EditUser extends Component {
  state = {
    id: null,
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    image: '',
    imageId: '',
    imageFile: null,
    admin: '',
    adminCode: '',
    errorMessage: null,
    message: 'Change Profile Image'
  }

  componentDidMount() {
    const {
      history,
      loggedInAs: {
        id: idFromState
      },
      location: {
        state: {
          author: {
            id,
            username,
            first_name: firstName,
            last_name: lastName,
            email,
            image,
            image_id: imageId,
            admin
          }
        }
      }
    } = this.props;
    if (idFromState.length === 0 || idFromState !== id) {
      history.push('/campgrounds');
    }
    this.setState({
      id,
      username,
      firstName,
      lastName,
      email,
      image,
      imageId,
      admin
    });
  }

  componentDidUpdate() {
    const {
      history,
      loggedInAs: {
        id
      }
    } = this.props;

    if (id.length === 0) {
      history.push('/campgrounds');
    }
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

  getFileName = (e) => {
    getUploadedFileName(e, this.setState.bind(this));
  }

  submitForm = async (event) => {
    event.preventDefault();
    const { history, updateLoggedinasState } = this.props;
    const {
      id,
      username,
      firstName,
      lastName,
      email,
      image,
      imageFile,
      imageId,
      adminCode
    } = this.state;

    const fd = new FormData();
    fd.append('id', id);
    fd.append('username', username);
    fd.append('firstName', firstName);
    fd.append('lastName', lastName);
    fd.append('email', email);
    fd.append('adminCode', adminCode);
    fd.append('imageId', imageId);
    if (imageFile) {
      fd.append('image', imageFile);
    } else {
      fd.append('image', image);
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
          message,
          admin,
          image: newImageLink,
          image_id: newImageId
        }
      } = await axios.put('/api/users', fd, config);
      if (status === 201) {
        updateLoggedinasState({
          admin,
          id,
          username,
          firstName,
          lastName,
          email,
          image: newImageLink,
          imageId: newImageId,
        });
        history.push({
          pathname: `/ycusers/${id}`,
          state: {
            alertMessage: {
              text: message,
              variant: 'success'
            },
            // author: {
            //   admin,
            //   id,
            //   username,
            //   first_name: firstName,
            //   last_name: lastName,
            //   email,
            //   image: newImageLink,
            //   image_id: newImageId,
            // }
          }
        });
      }
    } catch (err) {
      const { response: { status, data: message } } = err;
      this.setState({
        errorMessage: `${message} (${status})`
      });
    }
    // axios.put('/api/users', fd, config)
    //   .then((res) => {
    //     // const { updateLoggedinasState } = this.props;
    //     const {
    //       admin,
    //       // password,
    //       // createdAt,
    //       image: newImageLink,
    //       image_id: newImageId
    //     } = res.data;
    //     const { status } = res;
    //     if (status === 201) {
    //       updateLoggedinasState({
    //         admin,
    //         id,
    //         username,
    //         // password,
    //         firstName,
    //         lastName,
    //         email,
    //         image: newImageLink,
    //         imageId: newImageId,
    //         // createdAt,
    //       });
    //       // const { correctAdminCode } = res;
    //       let text = '';
    //       if (correctAdminCode) {
    //         text = 'Succesfully edited admin account.';
    //       } else {
    //         text = 'Succesfully edited account (non-admin).';
    //       }
    //       history.push({
    //         pathname: `/ycusers/${id}`,
    //         state: {
    //           alertMessage: {
    //             text,
    //             variant: 'success'
    //           },
    //           author: {
    //             admin,
    //             id,
    //             username,
    //             first_name: firstName,
    //             last_name: lastName,
    //             email,
    //             image: newImageLink,
    //             image_id: newImageId,
    //           }
    //         }
    //       });
    //     }
    //   })
    //   .catch((error) => {
    //     if (error.response.status === 409) {
    //       this.setState({
    //         errorMessage: 'Email address or user name already in use'
    //       });
    //     }
    //     if (error.response.status === 400) {
    //       this.setState({
    //         errorMessage: 'Invalid account information.'
    //       });
    //     }
    //     return error;
    //   });
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
      id,
      username,
      firstName,
      lastName,
      email,
      image,
      imageId,
      originalImage,
      admin,
      message
    } = this.state;
    const author = {
      id,
      username,
      first_name: firstName,
      last_name: lastName,
      email,
      image,
      image_id: imageId,
      originalImage,
      admin,
      message
    };
    return (
      <div className="margin-top-50">
        {this.renderAlert()}
        <Container>
          <h1 className="text-center">
            Edit account details:
            {' '}
            {username}
          </h1>
          <br />
          <form
            className="entryBox centered"
            onSubmit={this.submitForm}
          >
            <div className="form-group">
              <input
                className="form-control"
                type="text"
                name="firstName"
                value={firstName || ''}
                placeholder="First Name"
                onChange={this.onChange}
              />
            </div>
            <div className="form-group">
              <input
                className="form-control"
                type="text"
                name="lastName"
                value={lastName || ''}
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
            <Link to={{
              pathname: `/ycusers/${id}`,
              state: {
                author
              }
            }}
            >
              <Button size="sm" variant="link">Go Back</Button>
            </Link>
          </form>
        </Container>
      </div>
    );
  }
}


EditUser.propTypes = {
  loggedInAs: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  updateLoggedinasState: PropTypes.func.isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      author: PropTypes.shape({
        id: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        username: PropTypes.string,
        first_name: PropTypes.string,
        last_name: PropTypes.string,
        image: PropTypes.string.isRequired,
        image_id: PropTypes.string.isRequired,
        admin: PropTypes.bool,
      })
    })
  }).isRequired
};

export default withRouter(EditUser);
