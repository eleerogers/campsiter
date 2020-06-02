import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { LoggedInAsContext } from './loggedInAsContext';

function UserPicDisplay({ author, userId }) {
  const [loading, setLoading] = useState(true);

  function picLoad() {
    setLoading(false);
  }

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
              className="mr-2"
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
    email
  } = author;
  const mailTo = `mailto:${email}`;

  return (
    <div
      className={`transition ${loading ? 'loading' : 'done'}`}
    >
      <h2>
        {firstName}
        {' '}
        {lastName}
      </h2>
      {' '}
      <div className="thumbnail">
        <img
          className="img-fluid"
          src={image}
          alt={email}
          onLoad={picLoad}
        />
        <div className="caption float-right">
          <i>
            email:
            {' '}
            <a href={mailTo}>
              {email}
            </a>
          </i>
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
    email: PropTypes.string.isRequired
  }).isRequired,
  userId: PropTypes.string.isRequired
};

export default UserPicDisplay;
