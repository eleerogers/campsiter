import React, { Component } from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import { Button, Container, Alert } from 'react-bootstrap';
import '../app.css';


class Signup extends Component {
  state = {
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    adminCode: '',
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
    const {
      username,
      password,
      first_name,
      last_name,
      email,
      avatar,
      adminCode
    } = this.state;
    const data = {
      username,
      password,
      first_name,
      last_name,
      email,
      avatar,
      adminCode
    };
    const { history } = this.props;
    let response = {};

    fetch('/api/ycusers', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((res) => {
        response = res;
        if (res.status === 409) {
          this.setState({
            errorMessage: 'Email address or user name already in use'
          });
        }
        if (res.status === 400) {
          this.setState({
            errorMessage: 'Invalid email and/or password'
          });
        }
        return res;
      })
      .then(res => res.json())
      .then((res) => {
        const { ok } = response;
        if (ok) {
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
    return (
      <div className="margin-top-50">
        {this.renderAlert()}
        <Container>
          <h1 className="text-center">Create your account</h1>
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
            <div className="form-group">
              <input
                className="form-control"
                type="text"
                name="avatar"
                placeholder="Avatar URL (optional)"
                onChange={this.onChange}
              />
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
export default withRouter(Signup);
