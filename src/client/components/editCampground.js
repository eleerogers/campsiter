import React, { Component } from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import { Button, Container, Alert } from 'react-bootstrap';
import PropTypes from 'prop-types';
import '../app.css';


class EditCampground extends Component {
  state = {
    name: '',
    image: '',
    description: '',
    campLocation: '',
    price: '',
    id: null,
    user_id: null,
    errorMessage: null,
    admin: false,
  }

  componentDidMount() {
    const { location } = this.props;
    const { state } = location;
    const { campground, loggedInAs } = state;
    const {
      name, image, description, price, id, user_id
    } = campground;
    const { admin } = loggedInAs;
    const campLocation = campground.location;
    this.setState({
      name,
      image,
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

  submitForm = (event) => {
    event.preventDefault();
    const {
      name,
      image,
      description,
      campLocation,
      price,
      id,
      user_id,
      admin
    } = this.state;
    const url = `/api/campgrounds/${id}`;
    const { history } = this.props;
    const data = {
      adminBool: admin,
      name,
      image,
      description,
      campLocation,
      price,
      user: { id: user_id }
    };
    fetch(url, {
      method: 'PUT',
      body: JSON.stringify(data), // data can be `string` or {object}!
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      if (response.status === 401) {
        this.setState({
          errorMessage: 'You need to be logged in.'
        });
      } else if (response.status === 400) {
        this.setState({
          errorMessage: 'Invalid campground info.'
        });
      } else return response;
    })
      .then(response => response.json())
      .then((response) => {
        const campground = response;
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
      })
      .catch(error => console.error('Error:', error));
  }

  render() {
    const {
      name, image, description, campLocation, price, id, user_id
    } = this.state;
    const campground = {
      name, image, description, campLocation, price, id, user_id
    };
    return (
      <div className="margin-top-50">
        {this.renderAlert()}
        <Container>
          <h1 className="text-center">Edit Campground</h1>
          <div className="entryBox centered">
            <div className="form-group">
              <input
                className="form-control"
                type="text"
                name="name"
                value={name}
                onChange={this.onChange}
              />
            </div>
            <div className="form-group">
              <input
                className="form-control"
                type="text"
                name="image"
                value={image}
                onChange={this.onChange}
              />
            </div>
            <div className="form-group">
              <input
                className="form-control"
                type="text"
                name="description"
                value={description}
                onChange={this.onChange}
              />
            </div>
            <div className="form-group">
              <input
                className="form-control"
                type="text"
                name="campLocation"
                value={campLocation}
                onChange={this.onChange}
              />
            </div>
            <div className="form-group">
              <input
                className="form-control"
                type="text"
                name="price"
                value={price}
                onChange={this.onChange}
              />
            </div>
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
        </Container>
      </div>
    );
  }
}
export default withRouter(EditCampground);
