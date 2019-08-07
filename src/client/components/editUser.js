import React, { Component } from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import { Button, Container, Alert } from 'react-bootstrap';
import '../app.css';


class EditUser extends Component {
  state = {
    id: null,
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    email: '',
    avatar: '',
    admin: '',
    adminCode: '',
    errorMessage: null
  }

  componentDidMount() {
    // const { location } = this.props;
    // const { state } = location;
    // const { loggedInAs } = state;
    const { loggedInAs } = this.props;
    const {
      id, username, first_name, last_name, email, password, avatar, admin
    } = loggedInAs;
    this.setState({
      id,
      username,
      first_name,
      last_name,
      email,
      password,
      avatar,
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
    // const { location } = this.props;
    // const { state } = location;
    // const { author } = state;
    const {
      id,
      username,
      password,
      first_name,
      last_name,
      email,
      avatar,
      admin,
      adminCode
    } = this.state;
    const data = {
      id,
      username,
      password,
      first_name,
      last_name,
      email,
      avatar,
      admin,
      adminCode
    };
    const { history } = this.props;
    let response = {};

    fetch('/api/ycusers', {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((res) => {
        response = res;
        if (res.status === 409) {
          this.setState({
            errorMessage: 'Email address already in use'
          });
        }
        if (res.status === 400) {
          console.log('yep 400!');
          this.setState({
            errorMessage: 'Invalid email and/or password'
          });
        }
        return res;
      })
      .then(res => res.json())
      .then((res) => {
        const { updateLoggedinasState } = this.props;
        const {
          admin,
          id,
          username,
          password,
          first_name,
          last_name,
          email,
          avatar,
          created_at,
        } = res;
        const { ok } = response;
        if (ok) {
          const { correctAdminCode } = res;
          let text = '';
          if (correctAdminCode) {
            text = 'Succesfully updated admin account.';
          } else {
            text = 'Succesfully updated account (non-admin).';
          }
          updateLoggedinasState({
            admin,
            id,
            username,
            password,
            first_name,
            last_name,
            email,
            avatar,
            created_at,
          });
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
                first_name,
                last_name,
                email,
                avatar
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
      first_name,
      last_name,
      email,
      password,
      avatar,
      adminCode
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
          <div className="entryBox centered">
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
                name="first_name"
                value={first_name}
                placeholder="First Name"
                onChange={this.onChange}
              />
            </div>
            <div className="form-group">
              <input
                className="form-control"
                type="text"
                name="last_name"
                value={last_name}
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
                className="form-control"
                type="text"
                name="avatar"
                value={avatar}
                placeholder="Avatar URL (optional)"
                onChange={this.onChange}
              />
            </div>
            {this.renderAdminBox()}
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
            {/* fix below to go back to profile */}
            <Link to="/campgrounds">
              <Button size="sm" variant="link">Go Back</Button>
            </Link>
          </div>
        </Container>
      </div>
    );
  }
}
export default withRouter(EditUser);
