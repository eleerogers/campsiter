import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import { LoggedInAsContext } from './contexts/loggedInAsContext';
// import useLoading from '../hooks/useLoading';
import useHover from '../hooks/useHover';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope as fasEnvelope } from '@fortawesome/free-solid-svg-icons'
import { faEnvelope as farEnvelope } from '@fortawesome/free-regular-svg-icons'

function UserPicDisplay({ author, userId, userPicLoading, setUserPicLoadingFalse }) {
  // const [loading, setLoadingFalse] = useLoading();
  const [hovered, ref] = useHover();
  const {
    loggedInAs: {
      id: loggedInAsId,
      admin: loggedInAsAdmin
    }
  } = useContext(LoggedInAsContext);

  function renderEditButton() {
    if (
      loggedInAsId === userId
      || loggedInAsAdmin
    ) {
      return (
        <>
          <Link to={{
            pathname: '/editUser',
            state: { author }
          }}
          >
            <Button
              size="sm"
              variant="warning"
              className="mr-2 user-edit-btn btn-square"
            >
              Edit User
            </Button>
          </Link>
        </>
      );
    }
    return null;
  }

  const {
    first_name: firstName,
    last_name: lastName,
    image,
    email,
    username
  } = author;
  // const mailTo = `mailto:${email}`;
  const lNameOrInitial = lastName.length === 1 ? lastName + '.' : lastName;

  return (
    <div
      className={`transition ${userPicLoading ? 'loading' : 'done'}`}
    >
      <h1 className="color-dark-blue user-h1-mobile">{username}</h1>
      {' '}
      <div className="card user-card">
        <img
          className="card-img-top"
          src={image}
          alt={email}
          onLoad={setUserPicLoadingFalse}
        />
        <div className="card-body">
          <p className="card-text">
            {firstName}
            &nbsp;
            {lNameOrInitial}
            &nbsp;&nbsp;
            <Link 
              to={{
                pathname: '/contact',
                state: { author }
              }}
              ref={ref}
            >
              {loggedInAsId &&
              <FontAwesomeIcon
                color="#29ABE0"
                icon={hovered ? fasEnvelope : farEnvelope}
              />}
            </Link>
          </p>
        </div>
      </div>
      {renderEditButton()}
    </div>
  );
}

UserPicDisplay.propTypes = {
  author: PropTypes.shape({
    first_name: PropTypes.string.isRequired,
    last_name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired
  }).isRequired,
  userId: PropTypes.string.isRequired,
  userPicLoading: PropTypes.bool.isRequired,
  setUserPicLoadingFalse: PropTypes.func.isRequired
};

export default UserPicDisplay;
