import React, { Component } from 'react';

import {
  Link,
  withRouter
} from 'react-router-dom';
import { Button, Container, Alert } from 'react-bootstrap';
import '../app.css';

const axios = require('axios');


class NewCampground extends Component {
  state = {
    name: '',
    image: null,
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
    const url = '/api/campgrounds';
    const {
      name, image, description, campLocation, price
    } = this.state;
    const { history, user } = this.props;
    const fd = new FormData();
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };
    fd.append('image', image);
    fd.append('name', name);
    fd.append('description', description);
    fd.append('campLocation', campLocation);
    fd.append('price', price);
    fd.append('user_id', user.id);

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
                    placeholder="Image URL"
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
                  id="file-upload">
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
export default withRouter(NewCampground);
