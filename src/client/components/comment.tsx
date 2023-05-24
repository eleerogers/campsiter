import React from 'react';
import moment from 'moment-mini';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { useLoggedInAsContext } from './contexts/loggedInAsContext';
import DeleteModal from './deleteModal';
import StarRating from './starRating';
import { ICampground, IComment, ILoggedInAsContext } from '../interfaces';


interface Props {
  campground: {
    id: number;
  };
  comment: IComment;
  deleteComment: (commentObj: IComment, loggedInAsAdmin: boolean) => Promise<void>;
}

function Comment({
  comment, deleteComment, campground
}: Props) {
  const {
    loggedInAs: {
      id: loggedInAsId,
      admin: loggedInAsAdmin
    }
  } = useLoggedInAsContext() as ILoggedInAsContext;
  const {
    id: campgroundId,
  } = campground;
  const {
    comment_id,
    rating,
    user_id,
    username,
    created_at,
    comment: commentText
  } = comment;
  

  function renderCommentButtons(commentObj: IComment) {
    const loggedInAsIdInteger = parseInt(loggedInAsId, 10);
    if (
      loggedInAsIdInteger === commentObj.user_id
      || loggedInAsAdmin
    ) {
      return (
        <div className="float-right">
          <Link to={{
            pathname: `/campgrounds/${campgroundId}/comments/edit`,
            state: {
              commentObj,
              campground,
              loggedInAsAdmin
            }
          }}
          >
            <Button
              size="sm"
              variant="warning"
              className="mr-2 btn-square"
            >
              Edit
            </Button>
          </Link>
          <DeleteModal<IComment>
            itemType="review"
            itemObj={commentObj}
            handleDelete={deleteComment}
            loggedInAsAdminBool={loggedInAsAdmin}
          >
            Delete
          </DeleteModal>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="col-md-12 mb-2" key={comment_id}>
      <div className="card">
        <div className="card-body">
          {
            rating && rating > 0 &&
            <div>
              <StarRating
                currRating={rating}
                readonly={true}
                className="star-sm"
                divClassName="mb-2"
              />
            </div>
          }
          <p className="card-title">
            <Link className="text-primary" to={`/ycusers/${user_id}`}>
              <strong>
                {username}
              </strong>
            </Link>
            <span className="float-right">
              {moment(created_at).fromNow()}
            </span>
          </p>
          <p className="card-text float-left keepTextSpacing">{commentText}</p>
          <div className="float-right">
            {renderCommentButtons(comment)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Comment;
