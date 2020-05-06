import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Alert } from 'react-bootstrap';
import PropTypes from 'prop-types';
import moment from 'moment';
import axios from 'axios';
import MapContainer from './map';

class CampgroundPage extends React.Component {
  state = {
    comments: [],
    author: {},
    campground: {},
    history: [],
    alertMessage: null
  }

  async componentDidMount() {
    try {
      const {
        location: {
          state: {
            campground, alertMessage
          }
        }, history
      } = this.props;
      const { id, user_id: userId } = campground;

      this.setState({ campground, history, alertMessage });

      const { data: { comments } } = await axios.get(`/api/comments/${id}`);
      this.setState({ comments });

      const { data: { user } } = await axios.get(`/api/users/${userId}`);
      this.setState({ author: user });
    } catch (err) {
      console.error(err);
    }
  }

  deleteCampgroundAndRedirect = async (adminBool) => {
    try {
      const {
        campground: {
          id, user_id: userId, image_id: imageId
        },
        history
      } = this.state;

      const data = {
        adminBool,
        userId,
        imageId
      };

      await axios.delete(`/api/campgrounds/${id}`, { data });

      history.push({
        pathname: '/campgrounds',
        state: {
          alertMessage: {
            text: 'Successfully deleted campground',
            variant: 'success'
          }
        }
      });
    } catch (err) {
      const { response: { status } } = err;
      if (status === 401) {
        this.setState({
          alertMessage: {
            text: 'Permission denied',
            variant: 'danger'
          }
        });
      } else if (status === 400) {
        this.setState({
          alertMessage: {
            text: 'Error deleting picture',
            variant: 'danger'
          }
        });
      }
    }
  }

  renderEditDeleteBtns = () => {
    const { campground, author } = this.state;
    const { loggedInAs } = this.props;
    if (
      (loggedInAs
      && author
      && loggedInAs.id === author.id)
      || loggedInAs.admin
    ) {
      return (
        <>
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
        </>
      );
    }
    return null;
  }

  renderCommentButtons = (commentObj, adminBool) => {
    const { loggedInAs } = this.props;
    const { campground } = this.state;
    const { id } = campground;
    const loggedInAsId = parseInt(loggedInAs.id, 10);
    const commentUserId = parseInt(commentObj.user_id, 10);
    if (
      (loggedInAs
      && loggedInAsId === commentUserId)
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
          <Button size="sm" variant="danger" onClick={(e) => this.deleteComment(e, commentObj, adminBool)}>Delete Comment</Button>
        </div>
      );
    }
    return null;
  }

  deleteComment = async (event, commentObj, adminBool) => {
    try {
      event.preventDefault();
      const { campground: { id } } = this.state;
      const url = `/api/comments/${id}`;
      const { comment_id: commentId, user_id: userId } = commentObj;
      const commentData = {
        adminBool,
        commentId,
        userId
      };

      const { data: text } = await axios.delete(url, { data: commentData });

      this.setState({
        alertMessage: {
          text,
          variant: 'success'
        }
      });

      const { data: { comments } } = await axios.get(`/api/comments/${id}`);

      this.setState({ comments });
    } catch (err) {
      console.error(err);
    }
  }

  renderAlert = () => {
    const { history } = this.props;
    const { alertMessage, campground } = this.state;
    const { id } = campground;
    if (alertMessage) {
      const { text, variant } = alertMessage;
      const btnVariant = `outline-${alertMessage.variant}`;
      return (
        <Alert variant={variant}>
          <span>{text}</span>
          <span className="float-right">
            <Button
              onClick={() => {
                history.replace(`${id}`, { campground, alertMessage: null });
                this.setState({
                  alertMessage: null
                });
              }}
              variant={btnVariant}
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
    const { loggedInAs } = this.props;
    const {
      campground, comments, author
    } = this.state;
    const {
      name, image, description, price, id, created_at: createdAt
    } = campground;
    return (
      <div className="container">
        <div className="row my-3">
          <div className="col-md-3">
            <div className="map col-md-12 d-none d-md-block">
              <MapContainer campground={campground} />
            </div>
          </div>
          <div className="col-md-9">
            {this.renderAlert()}
            <div className="card mb-3">
              <img className="img-responsive cover" alt={name} src={image} />
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
                    {moment(createdAt).fromNow()}
                  </em>
                </p>
                {this.renderEditDeleteBtns()}
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
                  )}
              </div>
              <hr />
              <div className="row">
                {comments.map((comment) => (
                  <div className="col-md-12 mb-2" key={comment.comment_id}>
                    <div className="card">
                      <div className="card-body">
                        <p className="card-title">
                          <strong>{comment.email}</strong>
                          <span className="float-right">
                            {moment(comment.created_at).fromNow()}
                          </span>
                        </p>
                        <p className="card-text float-left">{comment.comment}</p>
                        <div className="float-right">
                          {this.renderCommentButtons(comment, loggedInAs.admin)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CampgroundPage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired
  }).isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      campground: PropTypes.shape({
        id: PropTypes.number.isRequired,
        user_id: PropTypes.number.isRequired
      }).isRequired,
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
  }).isRequired,
};

export default CampgroundPage;
