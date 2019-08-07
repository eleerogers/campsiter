import React, { Component } from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import { Button, Container, Alert } from 'react-bootstrap';
import '../app.css';

class NewComment extends Component {
  state = {
    comment: '',
    campground: {},
    errorMessage: null
  }

  componentDidMount() {
    const { location } = this.props;
    const { state } = location;
    const { campground } = state;
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

  submitForm = (event) => {
    event.preventDefault();
    const { campground } = this.state;
    const { id } = this.props.match.params;
    const url = `/api/campgrounds/${id}/comments`;
    const { history, user } = this.props;
    const { comment } = this.state;
    const data = {
      comment, user
    };
    fetch(url, {
      method: 'POST',
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
              text: 'Successfully added comment',
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
    return (
      <div className="margin-top-50">
        {this.renderAlert()}
        <Container>
          <h1 className="text-center">Comment on This Campground</h1>
          <div className="entryBox centered">
            <div className="form-group">
              <input
                className="form-control"
                type="text"
                name="comment"
                placeholder="Comment"
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

export default withRouter(NewComment);
