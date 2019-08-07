/* eslint-disable react/forbid-prop-types */
/* eslint-disable camelcase */
import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Alert } from 'react-bootstrap';
import PropTypes from 'prop-types';
import moment from 'moment';
import MapContainer from './map';

class CampgroundPage extends React.Component {
  state = {
    comments: [],
    author: {},
    campground: {},
    history: [],
    alertMessage: null
  }

  componentDidMount() {
    const { location, history } = this.props;
    const { state } = location;
    const { campground, alertMessage } = state;
    const { id, user_id } = campground;

    this.setState({ campground, history, alertMessage });

    fetch(`/api/campgrounds/${id}/comments`)
      .then(results => results.json())
      .then(comments => this.setState({ comments }));

    fetch(`/api/ycusers/${user_id}`)
      .then(results => results.json())
      .then(author => this.setState({ author }));
  }

  deleteCampgroundAndRedirect = (adminBool) => {
    const { campground, history } = this.state;
    const { id, user_id } = campground;
    const data = {
      adminBool,
      user: { id: user_id },
    };
    fetch(`/api/campgrounds/${id}`, {
      method: 'DELETE',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(() => { history.push({
        pathname: '/campgrounds',
        state: {
          alertMessage: {
            text: 'Successfully deleted campground',
            variant: 'success'
          }
        }
      });
      })
      .catch(error => console.error('Error:', error));
  }

  // this is actually for edit AND delete buttons... need to fix
  renderEditButton = () => {
    const { campground, author } = this.state;
    const { loggedInAs } = this.props;
    if (
      loggedInAs
      && author
      && loggedInAs.id === author.id
      || loggedInAs.admin
    ) {
      return (
        <React.Fragment>
          <Link to={{
            pathname: '/editCampground',
            state: {
              campground,
              loggedInAs
            }
          }}
          >
            <Button size="sm" variant="warning" className="mr-2">Edit Campground</Button>
          </Link>
          <Button size="sm" variant="danger" onClick={() => this.deleteCampgroundAndRedirect(loggedInAs.admin)}>Delete Campground</Button>
        </React.Fragment>
      );
    }
    return null;
  }

  renderCommentButtons = (commentObj, adminBool) => {
    const { loggedInAs } = this.props;
    const { campground } = this.state;
    const { id } = campground;
    if (
      loggedInAs
      && loggedInAs.id == commentObj.user_id
      || loggedInAs.admin
    ) {
      return (
        <div className="float-right">
          <Link to={{
            pathname: `/campgrounds/${id}/comments/edit`,
            state: {
              commentObj, campground, adminBool
            }
          }}
          >
            <Button size="sm" variant="warning" className="mr-2">Edit Comment</Button>
          </Link>
          <Button size="sm" variant="danger" onClick={e => this.deleteComment(e, commentObj, adminBool)}>Delete Comment</Button>
        </div>
      );
    }
    return null;
  }

  deleteComment = (event, commentObj, adminBool) => {
    event.preventDefault();
    const { campground } = this.state;
    const { id } = campground;
    const url = `/api/campgrounds/${id}/comments`;
    const { comment_id, user_id } = commentObj;
    const data = {
      adminBool,
      comment_id,
      user: {
        id: user_id
      }
    };
    fetch(url, {
      method: 'DELETE',
      body: JSON.stringify(data), // data can be `string` or {object}!
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.text())
      .then((text) => {
        this.setState({
          alertMessage: {
            text,
            variant: 'success'
          }
        });
      })
      .then(() => fetch(`/api/campgrounds/${id}/comments`))
      .then(results => results.json())
      .then(comments => this.setState({ comments }))
      .catch(error => console.error('Error:', error));
  }

  renderAlert = () => {
    const { alertMessage } = this.state;
    if (alertMessage) {
      const { text, variant } = alertMessage;
      return (
        <Alert variant={variant}>
          <span>{text}</span>
          <span className="float-right">
            <Button
              onClick={() => {
                this.setState({
                  alertMessage: null
                });
              }}
              variant="outline-success"
              size="sm"
            >
            X
            </Button>
          </span>
        </Alert>
      );
    }
    return null;
  }

  render() {
    const {
      campground, comments, author
    } = this.state;
    const { loggedInAs } = this.props;
    console.log('author: ', author);
    const {
      name, image, description, price, id, created_at
    } = campground;
    return (
      <div className="container">
        <div className="row my-3">
          <div className="col-md-3">
            <div className="list-group">
              <li className="list-group-item active">Info 1</li>
              <li className="list-group-item">Info 2</li>
              <li className="list-group-item">Info 3</li>
            </div>
            <div className="map col-md-12 mt-3">
              <MapContainer campground={campground} />
            </div>
          </div>
          <div className="col-md-9">
            {this.renderAlert()}
            <div className="card mb-3">
              <img className="img-responsive" alt={name} src={image} />
              <div className="card-body">
                <h6 className="float-right">
                  $
                  {price}
                  /night
                </h6>
                <h4>
                  <a href="#campground">{name}</a>
                </h4>
                <p>{description}</p>
                <p>
                  <em>
                    Submitted by:
                    {' '}
                    <Link to={{
                      pathname: `/ycusers/${author.id}`,
                      state: {
                        author
                      }
                    }}
                    >
                      {author.email}
                    </Link>
                    {' '}
                    {moment(created_at).fromNow()}
                  </em>
                </p>
                {this.renderEditButton()}
              </div>
            </div>
            <div className="card card-body bg-light">
              <div className="text-right">
                {loggedInAs.email && loggedInAs.email.length > 0
                  ? (
                    <Link to={{
                      pathname: `/campgrounds/${id}/comments/new`,
                      state: {
                        campground
                      }
                    }}
                    >
                      <Button size="sm" variant="success">Add New Comment</Button>
                    </Link>
                  )
                  : (
                    <Link to={{
                      pathname: '/login',
                    }}
                    >
                      <Button size="sm" variant="success">Login to Comment</Button>
                    </Link>
                  )
                }
              </div>
              <hr />
              {comments.map(comment => (
                <div className="row" key={comment.comment_id}>
                  <div className="col-md-12">
                    <strong>{comment.email}</strong>
                    <span className="float-right">
                      {moment(comment.created_at).fromNow()}
                    </span>
                    <br />
                    {comment.comment}
                    {this.renderCommentButtons(comment, loggedInAs.admin)}
                  </div>
                </div>
              ))}

            </div>
          </div>
        </div>

      </div>
    );
  }
}


CampgroundPage.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  loggedInAs: PropTypes.shape({
    id: PropTypes.string,
    password: PropTypes.string,
    email: PropTypes.string,
    created_at: PropTypes.string,
  }).isRequired,
};

export default CampgroundPage;
