import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Container, Alert } from 'react-bootstrap';
import PropTypes from 'prop-types';
import '../app.css';


class Reset extends Component {
  state = {
    alertMessage: null,
    variant: null,
    password1: '',
    password2: '',
    email: ''
  }

  componentDidMount() {
    const { match } = this.props;
    const { params } = match;
    const {
      reset_password_token: resetPasswordToken
    } = params;
    fetch(`/api/users/token/${resetPasswordToken}`)
      .then(res => res.json())
      .then((res) => {
        const { email } = res.user;
        this.setState({
          email
        });
      });
  }

  onFormChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  submitEmailReset = (event) => {
    event.preventDefault();
    const { history, match } = this.props;
    const { params } = match;
    const {
      reset_password_token: resetPasswordToken
    } = params;
    const { password1, password2 } = this.state;
    if (password1 !== '') {
      if (password1 === password2) {
        const data = {
          password: password1,
          reset_password_token: resetPasswordToken
        };
        fetch('/api/users/reset', {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then((res) => {
            if (res.status === 410) {
              this.setState({
                alertMessage: 'Reset link has expired',
                variant: 'danger'
              });
            }
            if (res.status === 201) {
              history.push({
                pathname: '/login',
                state: {
                  alertMessage: {
                    text: 'Successfully changed password. Please login.',
                    variant: 'success'
                  }
                }
              });
            }
          });
      } else {
        this.setState({
          alertMessage: 'Passwords do not match',
          variant: 'danger'
        });
      }
    } else {
      this.setState({
        alertMessage: 'Password cannot be blank',
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
    const { password1, password2, email } = this.state;
    return (
      <div className="margin-top-50">
        {this.renderAlert()}
        <Container>
          <h2 className="text-center">
            Reset Password:
          </h2>
          <h4 className="text-center">{ email }</h4>
          <br />
          <form
            className="entryBox centered"
            onSubmit={e => this.submitEmailReset(e)}
          >
            <div className="form-group">
              <input
                className="form-control"
                type="password"
                name="password1"
                placeholder="New Password"
                value={password1}
                onChange={this.onFormChange}
              />
            </div>
            <div className="form-group">
              <input
                className="form-control"
                type="password"
                name="password2"
                placeholder="Confirm Password"
                value={password2}
                onChange={this.onFormChange}
              />
            </div>
            <div className="form-group">
              <Button
                className="btn-block"
                variant="primary"
                type="submit"
              >
              Reset Password
              </Button>
            </div>
          </form>
        </Container>
      </div>
    );
  }
}

Reset.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      reset_password_token: PropTypes.string.isRequired
    })
  }).isRequired
};

export default withRouter(Reset);
