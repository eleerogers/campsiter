import React, { Component } from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import { Button, Container, Alert } from 'react-bootstrap';
import '../app.css';
import PropTypes from 'prop-types';
import axios from 'axios';


class EditComment extends Component {
  state = {
    commentId: null,
    userId: null,
    campgroundId: null,
    comment: '',
    campground: {},
    errorMessage: null,
    adminBool: false,
  }

  componentDidMount() {
    const {
      location: {
        state: {
          campground, adminBool, commentObj: {
            comment_id: commentId,
            user_id: userId,
            comment
          }
        }
      }
    } = this.props;
    const campgroundId = campground.id;
    this.setState({
      commentId,
      userId,
      campgroundId,
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

  submitForm = async (event) => {
    event.preventDefault();
    const {
      history, match: {
        params: {
          id
        }
      }
    } = this.props;
    const url = `/api/comments/${id}`;
    const {
      commentId,
      userId,
      campgroundId,
      comment,
      campground,
      adminBool
    } = this.state;
    try {
      const data = {
        commentId,
        userId,
        campgroundId,
        comment,
        user: {
          id: userId
        },
        adminBool
      };
      const { data: responseData, status } = await axios.put(url, data);
      if (status === 200) {
        history.push({
          pathname: `/campgrounds/${id}`,
          state: {
            campground,
            alertMessage: {
              text: responseData,
              variant: 'success'
            }
          }
        });
      }
    } catch (err) {
      const { response: { status, data } } = err;
      history.push({
        pathname: `/campgrounds/${id}`,
        state: {
          campground,
          alertMessage: {
            text: `${data} (${status})`,
            variant: 'danger'
          }
        }
      });
    }
  }

  render() {
    const { comment, campground, campgroundId } = this.state;
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
              pathname: `/campgrounds/${campgroundId}`,
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

EditComment.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      campground: PropTypes.shape({
        id: PropTypes.number.isRequired,
      }).isRequired,
      commentObj: PropTypes.shape({
        comment_id: PropTypes.number.isRequired,
        user_id: PropTypes.number.isRequired,
        comment: PropTypes.string.isRequired,
      }),
      adminBool: PropTypes.bool.isRequired
    }).isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    })
  }).isRequired
};

export default withRouter(EditComment);
