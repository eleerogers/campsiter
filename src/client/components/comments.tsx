import React, { Fragment } from 'react';
import Comment from './comment';
import { IComment } from '../interfaces';

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

export default Comments;
