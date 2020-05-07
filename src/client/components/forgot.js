import React, { Component } from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import { Button, Container, Alert } from 'react-bootstrap';
import axios from 'axios';
import PropTypes from 'prop-types';
import '../app.css';


class Forgot extends Component {
  state = {
    alertMessage: null,
    variant: null,
    email: ''
  }

  componentDidMount() {
    const {
      history,
      loggedInAs,
      location: {
        state
      }
    } = this.props;

    if (loggedInAs.id.length > 0) {
      history.push('/campgrounds');
    }

    if (state) {
      const { alertMessage } = state;
      this.setState({ alertMessage });
    }
  }

  componentDidUpdate() {
    const { history, loggedInAs } = this.props;

    if (loggedInAs.id.length > 0) {
      history.push('/campgrounds');
    }
  }

  onFormChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  submitEmailReset = async (event) => {
    event.preventDefault();
    const { history } = this.props;
    const { email } = this.state;
    try {
      const { data, status } = await axios.post('api/users/forgot', { email });
      if (status === 200) {
        history.push({
          pathname: '/campgrounds',
          state: {
            alertMessage: {
              text: data,
              variant: 'success'
            }
          }
        });
      }
    } catch (err) {
      const { response: { status, statusText } } = err;
      this.setState({
        alertMessage: `${statusText} (${status})`,
        variant: 'danger'
      });
    }
  }

  renderAlert = () => {
    const { alertMessage, variant } = this.state;
    if (alertMessage) {
      return (
        <Alert variant={variant}>
          {alertMessage}
        </Alert>
      );
    }
    return null;
  }

  render() {
    const { email } = this.state;
    return (
      <div className="margin-top-50">
        {this.renderAlert()}
        <Container>
          <h1 className="text-center">Forgot Password</h1>
          <br />
          <form
            className="entryBox centered"
            onSubmit={(e) => this.submitEmailReset(e)}
          >
            <div className="form-group">
              <input
                className="form-control"
                type="text"
                name="email"
                placeholder="Email"
                value={email}
                onChange={this.onFormChange}
              />
            </div>
            <br />
            <div className="form-group">
              <Button
                className="btn-block"
                variant="primary"
                type="submit"
              >
                Reset Password
              </Button>
            </div>
            <Link to="/login">
              <Button size="sm" variant="link">Go Back</Button>
            </Link>
          </form>
        </Container>
      </div>
    );
  }
}

Forgot.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      alertMessage: PropTypes.shape({
        text: PropTypes.string,
        variant: PropTypes.string
      }),
    }),
  }).isRequired,
  loggedInAs: PropTypes.shape({
    id: PropTypes.string,
    password: PropTypes.string,
    email: PropTypes.string,
    created_at: PropTypes.string,
    admin: PropTypes.bool,
  }).isRequired
};

export default withRouter(Forgot);
