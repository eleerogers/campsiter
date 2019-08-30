import React, { Component } from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import { Button, Container, Alert } from 'react-bootstrap';
import PropTypes from 'prop-types';
import '../app.css';

const axios = require('axios');


class EditCampground extends Component {
  state = {
    name: '',
    image: '',
    imageId: '',
    description: '',
    campLocation: '',
    price: '',
    id: null,
    userId: null,
    errorMessage: null,
    admin: false,
    message: 'Change Campground Image'
  }

  componentDidMount() {
    const { location } = this.props;
    const { state } = location;
    const { campground, loggedInAs } = state;
    const {
      name,
      image,
      image_id: imageId,
      description,
      price,
      id,
      user_id: userId,
      location: campLocation,
      lat,
      lng
    } = campground;
    const { admin } = loggedInAs;
    this.setState({
      name,
      image,
      imageId,
      description,
      campLocation,
      price,
      id,
      userId,
      lat,
      lng,
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
    if (message) this.setState(prevState => ({ ...prevState, message }));
    this.setState({
      image: e.target.files[0]
    });
  }

  submitForm = (event) => {
    event.preventDefault();
    const {
      name,
      image,
      imageId,
      description,
      campLocation,
      price,
      id,
      userId,
      admin,
    } = this.state;
    const priceNoDollarSign = price.replace(/\$/gi, '');
    console.log('priceNoDollarSign', priceNoDollarSign);
    const url = `/api/campgrounds/${id}`;
    const { history } = this.props;

    const fd = new FormData();
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };
    fd.append('image', image);
    fd.append('imageId', imageId);
    fd.append('name', name);
    fd.append('description', description);
    fd.append('campLocation', campLocation);
    fd.append('price', priceNoDollarSign);
    fd.append('userId', userId);
    fd.append('adminBool', admin);

    axios.put(url, fd, config)
      .catch((error) => {
        if (error.response.status === 401) {
          this.setState({
            errorMessage: 'You need to be logged in.'
          });
        }
        if (error.response.status === 400) {
          this.setState({
            errorMessage: 'Invalid campground info.'
          });
        }
        return error;
      })
      .then((response) => {
        if (response.status === 200) {
          const campground = response.data;
          history.push({
            pathname: `/campgrounds/${id}`,
            state: {
              campground,
              alertMessage: {
                text: 'Successfully edited campground',
                variant: 'success'
              }
            }
          });
        }
      })
      .catch(error => console.error('Error:', error));
  }

  render() {
    const {
      name,
      image,
      imageId,
      description,
      campLocation,
      price,
      id,
      userId,
      message,
      lat,
      lng
    } = this.state;
    const campground = {
      name,
      image,
      image_id: imageId,
      description,
      location: campLocation,
      price,
      id,
      user_id: userId,
      lat,
      lng
    };
    return (
      <div className="margin-top-50">
        {this.renderAlert()}
        <Container>
          <h1 className="text-center">
            Edit Campground:
            {' '}
            {name}
          </h1>
          <br />
          <form onSubmit={this.submitForm}>
            <div className="entryBox centered">
              <div className="form-group">
                <input
                  className="form-control"
                  type="text"
                  name="name"
                  value={name}
                  onChange={this.onChange}
                  placeholder="Name of Campground"
                />
              </div>
              <div className="form-group">
                <input
                  className="form-control"
                  type="text"
                  name="description"
                  value={description}
                  onChange={this.onChange}
                  placeholder="Description"
                />
              </div>
              <div className="form-group">
                <input
                  className="form-control"
                  type="text"
                  name="campLocation"
                  value={campLocation}
                  onChange={this.onChange}
                  placeholder="Location"
                />
              </div>
              <div className="form-group">
                <input
                  className="form-control"
                  type="text"
                  name="price"
                  value={price}
                  onChange={this.onChange}
                  placeholder="Price"
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
              <Link to={{
                pathname: `/campgrounds/${id}`,
                state: {
                  campground
                }
              }}
              >
                <Button size="sm" variant="link">Go Back</Button>
              </Link>
            </div>
          </form>
        </Container>
      </div>
    );
  }
}

EditCampground.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      campground: PropTypes.shape({
        id: PropTypes.number.isRequired,
        user_id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        image_id: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        price: PropTypes.string.isRequired,
        location: PropTypes.string.isRequired,
        lat: PropTypes.number.isRequired,
        lng: PropTypes.number.isRequired
      }).isRequired,
      alertMessage: PropTypes.shape({
        text: PropTypes.string,
        variant: PropTypes.string
      }),
    }).isRequired,
  }).isRequired,
  loggedInAs: PropTypes.shape({
    admin: PropTypes.bool,
  }).isRequired,
};

export default withRouter(EditCampground);
