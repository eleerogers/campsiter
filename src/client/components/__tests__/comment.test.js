import React from 'react';
import { shallow } from '../../../enzyme';
import Comment from '../comment';
import * as LoggedInAsContext from '../contexts/loggedInAsContext';


describe('Comment tests', () => {
  const exampleComment = {
    comment: "Beautiful, magical lake",
    comment_id: 207,
    created_at: "2020-07-16T16:16:36.564Z",
    rating: 5,
    user_id: 135,
    username: "melaniexoxo@hotmail.com"
  }
  const campground = {
    id: 1
  }

  const deleteComment = () => {};

  const contextValues = {
    loggedInAs: {
      id: '',
      password: '',
      email: '',
      created_at: '',
      admin: false,
      image: '',
      imageId: '',
      firstName: '',
      lastName: '',
      username: ''
    }
  };

  jest
    .spyOn(LoggedInAsContext, 'useLoggedInAsContext')
    .mockImplementation(() => contextValues);

  it('should render the comment text', () => {
    const wrapper = shallow(
      <Comment
        comment={exampleComment}
        campground={campground}
        deleteComment={deleteComment}
      />
    );
    const commentTextP = wrapper.find('p.card-text');

    expect(commentTextP.text()).toEqual('Beautiful, magical lake');
  })

  it('should render the username', () => {
    const wrapper = shallow(
      <Comment
        comment={exampleComment}
        campground={campground}
        deleteComment={deleteComment}
      />
    );
    const commentTextP = wrapper.find('p.card-title > .text-primary');

    expect(commentTextP.text()).toEqual('melaniexoxo@hotmail.com');
  })

})