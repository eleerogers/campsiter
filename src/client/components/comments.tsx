import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Comment from './comment';
import { ICampground, IComment } from '../interfaces';

interface Props {
  campground: {
    id: number
  };
  comments: IComment[];
  deleteComment: (commentObj: IComment, loggedInAsAdmin: boolean) => Promise<void>;
}

function Comments({ campground, comments, deleteComment }: Props) {
  return (
    <Fragment>
      {comments.map((comment) => (
        <Comment
          comment={comment}
          deleteComment={deleteComment}
          campground={campground}
          key={comment.comment_id}
        />
      ))}
    </Fragment>
  );
}

Comments.propTypes = {
  campground: PropTypes.shape({
    id: PropTypes.number.isRequired
  }).isRequired,
  comments: PropTypes.array,
  deleteComment: PropTypes.func.isRequired
};

export default Comments;
