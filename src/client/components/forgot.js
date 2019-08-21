import React, { Component } from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import { Button, Container, Alert } from 'react-bootstrap';
import PropTypes from 'prop-types';
import '../app.css';


class Forgot extends Component {
  state = {
    alertMessage: null,
    variant: null,
    email: ''
  }

  componentDidMount() {
    const { location } = this.props;
    const { state } = location;
    if (state) {
      const { alertMessage } = state;
      this.setState({ alertMessage });
    }
  }

  onFormChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  submitEmailReset = (event) => {
    event.preventDefault();
    const { email } = this.state;
    const data = {
      email
    };
    fetch('api/forgot', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((res) => {
        if (res.status === 404) {
          this.setState({
            alertMessage: 'Email address not found',
            variant: 'danger'
          });
        }
        if (res.status === 200) {
          this.setState({
            alertMessage: `An e-mail has been sent to ${email} with further instructions.`,
            variant: 'success'
          });
        }
        return res;
      });
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
            onSubmit={e => this.submitEmailReset(e)}
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
  location: PropTypes.shape({
    state: PropTypes.shape({
      alertMessage: PropTypes.shape({
        text: PropTypes.string,
        variant: PropTypes.string
      }),
    }),
  }).isRequired,
};

export default withRouter(Forgot);
