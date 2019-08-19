import React, { Component } from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import { Button, Container, Alert } from 'react-bootstrap';
import '../app.css';

class EditComment extends Component {
  state = {
    comment_id: null,
    user_id: null,
    campground_id: null,
    comment: '',
    campground: {},
    errorMessage: null,
    adminBool: false,
  }

  componentDidMount() {
    const { location } = this.props;
    const { state } = location;
    const { commentObj, campground, adminBool } = state;
    const {
      comment_id, user_id, comment
    } = commentObj;
    const campground_id = campground.id;
    this.setState({
      comment_id,
      user_id,
      campground_id,
      comment,
      campground,
      adminBool
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
    const { id } = this.props.match.params;
    const { history } = this.props;
    const url = `/api/campgrounds/${id}/comments`;
    const {
      comment_id,
      user_id,
      campground_id,
      comment,
      campground,
      adminBool
    } = this.state;
    const data = {
      comment_id,
      user_id,
      campground_id,
      comment,
      user: {
        id: user_id
      },
      adminBool
    };
    fetch(url, {
      method: 'PUT',
      body: JSON.stringify(data), // data can be `string` or {object}!
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      if (res.ok) {
        history.push({
          pathname: `/campgrounds/${id}`,
          state: {
            campground,
            alertMessage: {
              text: 'Successfully edited comment',
              variant: 'success'
            }
          }
        });
      } else {
        if (res.status === 401) {
          this.setState({
            errorMessage: 'You need to be logged in'
          });
        }
        if (res.status === 400) {
          this.setState({
            errorMessage: 'Invalid comment'
          });
        }
      }
    })
      .catch(error => console.error('Error:', error));
  }

  render() {
    const { comment, campground, campground_id } = this.state;
    return (
      <div className="margin-top-50">
        {this.renderAlert()}
        <Container>
          <h1 className="text-center">Edit Your Comment</h1>
          <br />
          <form
            className="entryBox centered"
            onSubmit={this.submitForm}
          >
            <div className="form-group">
              <input
                value={comment}
                className="form-control"
                type="text"
                name="comment"
                onChange={this.onChange}
              />
            </div>
            <br />
            <div className="form-group">
              <Button
                className="btn-block"
                variant="primary"
                type="submit"
              >
              Submit
              </Button>
            </div>
            <Link to={{
              pathname: `/campgrounds/${campground_id}`,
              state: {
                campground
              }
            }}
            >
              <Button size="sm" variant="link">Go Back</Button>
            </Link>
          </form>
        </Container>
      </div>
    );
  }
}

export default withRouter(EditComment);
