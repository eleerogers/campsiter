import React, { Component } from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import { Button, Container, Alert } from 'react-bootstrap';
import PropTypes from 'prop-types';
import '../app.css';
import axios from 'axios';


class NewCampground extends Component {
  state = {
    name: '',
    imageFile: null,
    description: '',
    campLocation: '',
    price: '',
    errorMessage: null,
    message: 'Select Campground Image'
  }

  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  // handleSelectFile = (event) => {
  //   this.setState({
  //     image: event.target.files[0]
  //   });
  // }

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
    if (message) this.setState(prevState => ({ ...prevState, message }));
    this.setState({
      imageFile: e.target.files[0]
    });
  }

  submitForm = (event) => {
    event.preventDefault();
    const url = '/api/campgrounds';
    const {
      name, imageFile, description, campLocation, price
    } = this.state;
    const { history, user } = this.props;
    const fd = new FormData();
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };
    fd.append('image', imageFile);
    fd.append('name', name);
    fd.append('description', description);
    fd.append('campLocation', campLocation);
    fd.append('price', price);
    fd.append('userId', user.id);

    axios.post(url, fd, config)
      .catch((error) => {
        if (error.response.status === 401) {
          this.setState({
            errorMessage: 'Must be logged in.'
          });
        }
        if (error.response.status === 400) {
          this.setState({
            errorMessage: 'Invalid campground info.'
          });
        }
        return error;
      })
      .then((res) => {
        if (res.status === 201) {
          history.push({
            pathname: '/campgrounds',
            state: {
              alertMessage: {
                text: 'Successfully added campground',
                variant: 'success'
              }
            }
          });
        }
      });
  }


  render() {
    const { message } = this.state;
    return (
      <div className="margin-top-50">
        {this.renderAlert()}
        <Container>
          <h1 className="text-center">Create a New Campground</h1>
          <br />
          <form onSubmit={this.submitForm}>
            <div className="entryBox centered">
              <div className="form-group">
                <input
                  className="form-control"
                  type="text"
                  name="name"
                  placeholder="Name"
                  onChange={this.onChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="form-control"
                  type="text"
                  name="description"
                  placeholder="Description"
                  onChange={this.onChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="form-control"
                  type="text"
                  name="campLocation"
                  placeholder="Location"
                  onChange={this.onChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="form-control"
                  type="text"
                  name="price"
                  placeholder="Price ($/night)"
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
                    onChange={this.getUploadedFileName}
                  />
                  <span>{message}</span>
                </label>
              </div>
              <br />
              <div className="form-group">
                <Button
                  className="btn-block"
                  variant="primary"
                  type="submit"
                  size="lg"
                >
                Submit
                </Button>
              </div>
              <Link to="/campgrounds">
                <Button size="sm" variant="link">Go Back</Button>
              </Link>
            </div>
          </form>
        </Container>
      </div>
    );
  }
}

NewCampground.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export default withRouter(NewCampground);
