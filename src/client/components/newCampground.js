import React, { Component } from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import { Button, Container, Alert } from 'react-bootstrap';
import '../app.css';


class NewCampground extends Component {
  state = {
    name: '',
    image: '',
    description: '',
    campLocation: '',
    price: '',
    errorMessage: null
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
    const url = '/api/campgrounds';
    const {
      name, image, description, campLocation, price
    } = this.state;
    const { history, user } = this.props;
    const data = {
      name, image, description, campLocation, price, user
    };
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(data), // data can be `string` or {object}!
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((res) => {
        if (res.ok) {
          history.push({
            pathname: '/campgrounds',
            state: {
              alertMessage: {
                text: 'Successfully added campground',
                variant: 'success'
              }
            }
          });
        } else {
          if (res.status === 401) {
            this.setState({
              errorMessage: 'You need to be logged in.'
            });
          }
          if (res.status === 400) {
            this.setState({
              errorMessage: 'Invalid campground info.'
            });
          }
        }
      })
      .catch(error => console.error('Error:', error));
  }

  render() {
    return (
      <div className="margin-top-50">
        {this.renderAlert()}
        <Container>
          <h1 className="text-center">Create a New Campground</h1>
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
                name="image"
                placeholder="Image URL"
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
              <Button
                className="btn-block"
                variant="primary"
                type="submit"
                onClick={this.submitForm}
              >
              Submit
              </Button>
            </div>
            <Link to="/campgrounds">
              <Button size="sm" variant="link">Go Back</Button>
            </Link>
          </div>
        </Container>
      </div>
    );
  }
}
export default withRouter(NewCampground);
