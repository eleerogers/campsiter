import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { LoggedInAsContext } from './contexts/loggedInAsContext';
import Envelope from 'react-bootstrap-icons/dist/icons/envelope-fill';
import { IUser, ILoggedInAsContext } from '../interfaces';


interface Props {
  author: IUser;
  userId: string;
  userPicLoading: boolean;
  setUserPicLoadingFalse: () => void;
}

function UserPicDisplay({ author, userId, userPicLoading, setUserPicLoadingFalse }: Props) {
  const {
    loggedInAs: {
      id: loggedInAsId,
      admin: loggedInAsAdmin
    }
  } = useContext(LoggedInAsContext) as ILoggedInAsContext;

  function renderContactButton() {
    return loggedInAsId !== userId && (
      <Link 
        to={{
          pathname: '/contact',
          state: { author }
        }}
      >
        {
          loggedInAsId &&
          <Button
            size="sm"
            variant="outline-info"
            className="ml-2 float-right flex align-items-center"
          >
            <Envelope className="mr-1" />
            {'  '}
            Contact
          </Button>
        }
      </Link>
    )
  }

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
              className="btn-square float-right flex align-items-center"
            >
              Edit
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
          <p className="card-text mr-1 display-inline-block">
            {firstName}
            &nbsp;
            {lNameOrInitial}
          </p>
          <div className="float-right flex align-items-center">
            {renderEditButton()}
            {renderContactButton()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserPicDisplay;
