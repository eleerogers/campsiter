import React, { Component } from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import { Button, Container, Alert } from 'react-bootstrap';
import '../app.css';


// eslint-disable-next-line react/prefer-stateless-function
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
    const { reset_password_token } = params;
    fetch(`/api/ycusers/token/${reset_password_token}`)
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
    const { history } = this.props;
    const { password1, password2 } = this.state;
    const { reset_password_token } = this.props.match.params;
    if (password1 !== '') {
      if (password1 === password2) {
        const data = {
          password: password1,
          reset_password_token
        };
        fetch('/api/reset', {
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
    // const data = {
    //   email
    // }
    // fetch('api/reset', {
    //   method: 'POST',
    //   body: JSON.stringify(data),
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // })
    //   .then((res) => {
    //     console.log('res.status: ', res.status);
    //     //response = res;
    //     if (res.status === 404) {
    // this.setState({
    //   alertMessage: 'Email address not found',
    //   variant: 'danger'
    // });
    //     }
    //     if (res.status === 200) {
    //       this.setState({
    //         alertMessage: `An e-mail has been sent to ${email} with further instructions.`,
    //         variant: 'success'
    //       });
    //     }
    //     return res;
    //   });
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
              {/* <h6 className="float-left">New Password:</h6> */}
              <input
                className="form-control"
                type="text"
                name="password1"
                placeholder="New Password"
                value={password1}
                onChange={this.onFormChange}
              />
            </div>
            {/* <br /> */}
            <div className="form-group">
              {/* <h6 className="float-left">Confirm Password</h6> */}
              <input
                className="form-control"
                type="text"
                name="password2"
                placeholder="Confirm Password"
                value={password2}
                onChange={this.onFormChange}
              />
            </div>
            {/* <br /> */}
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
export default withRouter(Reset);
