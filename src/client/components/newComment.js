import React, { Component } from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import { Button, Container, Alert } from 'react-bootstrap';
import axios from 'axios';
import PropTypes from 'prop-types';
import '../app.css';

class NewComment extends Component {
  state = {
    comment: '',
    campground: {},
    errorMessage: null
  }

  componentDidMount() {
    const {
      location: {
        state: {
          campground
        }
      }
    } = this.props;
    this.setState({ campground });
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
    const { campground, comment } = this.state;
    const {
      history, user, match: {
        params: {
          id
        }
      }
    } = this.props;
    const url = `/api/comments/${id}`;
    const commentData = {
      comment,
      userId: user.id
    };
    try {
      const { data, status } = await axios.post(url, commentData);
      if (status === 200) {
        history.push({
          pathname: `/campgrounds/${id}`,
          state: {
            campground,
            alertMessage: {
              text: data,
              variant: 'success'
            }
          }
        });
      }
    } catch (err) {
      const { response: { status, data } } = err;
      this.setState({
        errorMessage: `${data} (${status})`
      });
    }
  }

  render() {
    const { campground } = this.state;
    const { id } = campground;
    return (
      <div className="margin-top-50">
        {this.renderAlert()}
        <Container>
          <h1 className="text-center">Comment on This Campground</h1>
          <br />
          <form
            className="entryBox centered"
            onSubmit={this.submitForm}
          >
            <div className="form-group">
              <input
                className="form-control"
                type="text"
                name="comment"
                placeholder="Comment"
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
              pathname: `/campgrounds/${id}`,
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

NewComment.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      campground: PropTypes.shape({
        id: PropTypes.number.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    })
  }).isRequired
};

export default withRouter(NewComment);
