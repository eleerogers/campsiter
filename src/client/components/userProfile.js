import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Col, Container, Row, Button, Spinner
} from 'react-bootstrap';
import axios from 'axios';
import { LoggedInAsContext } from './loggedInAsContext';
import '../app.css';
import useImagesLoaded from '../hooks/useImagesLoading';
import useCampgrounds from '../hooks/useCampgrounds';
import Campgrounds from './campgrounds';

function UserProfile() {
  // const [author, setAuthor] = useState({});
  const { id: userId } = useParams();
  const { data: { campgrounds, user: author }, error, isPending } = useCampgrounds(userId);
  // const [campgrounds, setCampgrounds] = useState([]);
  // const { loading, imageLoaded } = useImagesLoaded(campgrounds.length + 1);

  useEffect(() => {
    console.log('UserProfile campgrounds: ', campgrounds);
    console.log('UserProfile author: ', author);
  }, [campgrounds, author]);

  const {
    loggedInAs: {
      id: loggedInAsId,
      admin: loggedInAsAdmin
    }
  } = useContext(LoggedInAsContext);


  // useEffect(() => {
  //   let mounted = true;
  //   axios.get(`/api/campgrounds/user/${userId}`)
  //     .then(
  //       ({
  //         data: {
  //           campgrounds: userCampgrounds,
  //           user
  //         }
  //       }) => {
  //         if (mounted) {
  //           setCampgrounds(userCampgrounds);
  //           setAuthor(user);
  //         }
  //       }
  //     );
  //   return (() => { mounted = false; });
  // }, [userId]);

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

  const campgroundsDisplayConfig = {
    md: 3,
    sm: 6
  };

  const spinnerStyle = isPending ? { left: '50%' } : { display: 'none' };
  const loadedDisplay = isPending ? { display: 'none' } : {};
  return (
    <div className="row">
      <Container>
        <Row
          style={spinnerStyle}
          key={1}
        >
          <Col
            style={{
              textAlign: 'center',
              top: '5em'
            }}
          >
            <Spinner
              animation="border"
              variant="primary"
              size="xl"
            />
          </Col>
        </Row>
      </Container>
      <div
        className="col-md-4"
        style={loadedDisplay}
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
            // onLoad={imageLoaded}
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
      <div className="col-md-8">
        <Container>
          <Row key={2} style={loadedDisplay}>
            <Campgrounds
              campgrounds={campgrounds}
              configObj={campgroundsDisplayConfig}
              // imageLoaded={imageLoaded}
            />
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default UserProfile;
