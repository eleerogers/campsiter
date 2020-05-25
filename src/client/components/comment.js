import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import DeleteModal from './deleteModal';

function Comment({
  comment, loggedInAs, deleteComment, campground
}) {
  const {
    id: campgroundId,
  } = campground;
  const {
    id: loggedInAsId,
    admin: loggedInAsAdmin
  } = loggedInAs;
  function renderCommentButtons(commentObj, adminBool) {
    const loggedInAsIdInteger = parseInt(loggedInAsId, 10);
    const commentUserId = parseInt(commentObj.user_id, 10);
    if (
      (loggedInAs
      && loggedInAsIdInteger === commentUserId)
      || loggedInAsAdmin
    ) {
      return (
        <div className="float-right">
          <Link to={{
            pathname: `/campgrounds/${campgroundId}/comments/edit`,
            state: {
              commentObj, campground, adminBool
            }
          }}
          >
            <Button
              size="sm"
              variant="warning"
              className="mr-2"
            >
              Edit Comment
            </Button>
          </Link>
          <DeleteModal
            itemType="comment"
            itemObj={commentObj}
            handleDelete={deleteComment}
            loggedInAsAdminBool={adminBool}
          >
            Delete Comment
          </DeleteModal>
        </div>
      );
    }
    return null;
  }

  return (
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
            {renderCommentButtons(comment, loggedInAsAdmin)}
          </div>
        </div>
      </div>
    </div>
  );
}

Comment.propTypes = {
  campground: PropTypes.shape({
    id: PropTypes.number.isRequired
  }).isRequired,
  loggedInAs: PropTypes.shape({
    id: PropTypes.string,
    admin: PropTypes.bool
  }),
  comment: PropTypes.shape({
    comment_id: PropTypes.number.isRequired,
    comment: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired
  }).isRequired,
  deleteComment: PropTypes.func.isRequired
};

Comment.defaultProps = {
  loggedInAs: {
    id: null,
    admin: false
  }
};

export default Comment;
