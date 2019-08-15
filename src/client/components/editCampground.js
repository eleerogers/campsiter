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
    image_id: '',
    description: '',
    campLocation: '',
    price: '',
    id: null,
    user_id: null,
    errorMessage: null,
    admin: false,
    message: 'Change Campground Image'
  }

  componentDidMount() {
    const { location } = this.props;
    const { state } = location;
    const { campground, loggedInAs } = state;
    const {
      name, image, image_id, description, price, id, user_id
    } = campground;
    const { admin } = loggedInAs;
    const campLocation = campground.location;
    this.setState({
      name,
      image,
      image_id,
      description,
      campLocation,
      price,
      id,
      user_id,
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
    const {
      name,
      image,
      image_id,
      description,
      campLocation,
      price,
      id,
      user_id,
      admin
    } = this.state;
    const url = `/api/campgrounds/${id}`;
    const { history } = this.props;

    const fd = new FormData();
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };
    fd.append('image', image);
    fd.append('image_id', image_id);
    fd.append('name', name);
    fd.append('description', description);
    fd.append('campLocation', campLocation);
    fd.append('price', price);
    fd.append('user_id', user_id);
    fd.append('admin', admin);

    axios.put(url, fd, config)
      .then((response) => {
        if (response.status === 401) {
          this.setState({
            errorMessage: 'You need to be logged in.'
          });
        } else if (response.status === 400) {
          this.setState({
            errorMessage: 'Invalid campground info.'
          });
        } else if (response.status === 200) {
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
      // .then((response) => {
      //   const campground = response;
      //   history.push({
      //     pathname: `/campgrounds/${id}`,
      //     state: {
      //       campground,
      //       alertMessage: {
      //         text: 'Successfully edited campground',
      //         variant: 'success'
      //       }
      //     }
      //   });
      // })
      .catch(error => console.error('Error:', error));
  }

  render() {
    const {
      name, image, description, campLocation, price, id, user_id, message
    } = this.state;
    const campground = {
      name, image, description, campLocation, price, id, user_id
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
              {/* <div className="form-group">
                <input
                  className="form-control"
                  type="text"
                  name="image"
                  value={image}
                  onChange={this.onChange}
                />
              </div> */}
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
              <br />
              <div className="form-group">
                <Button
                  className="btn-block"
                  variant="primary"
                  type="submit"
                  // onClick={this.submitForm}
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
export default withRouter(EditCampground);
