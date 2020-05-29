import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Col, Container, Row, Button, Spinner
} from 'react-bootstrap';
import axios from 'axios';
import { LoggedInAsContext } from './loggedInAsContext';
import Campground from './campground';
import '../app.css';
import useImagesLoaded from '../hooks/useImagesLoading';

function UserProfile() {
  const [author, setAuthor] = useState({});
  const [campgrounds, setCampgrounds] = useState([]);
  const { loading, imageLoaded } = useImagesLoaded(campgrounds.length + 1);

  const {
    loggedInAs: {
      id: loggedInAsId,
      admin: loggedInAsAdmin
    }
  } = useContext(LoggedInAsContext);

  const { id: userId } = useParams();

  useEffect(() => {
    let mounted = true;
    axios.get(`/api/campgrounds/user/${userId}`)
      .then(
        ({
          data: {
            campgrounds: userCampgrounds,
            user
          }
        }) => {
          if (mounted) {
            setCampgrounds(userCampgrounds);
            setAuthor(user);
          }
        }
      );
    return (() => { mounted = false; });
  }, [userId]);

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

  const campgroundComponents = campgrounds.map((campground) => {
    const campgroundPlusAuthorEmail = {
      ...campground, email: author.email
    };
    return (
      <Col key={campground.id} md={3} sm={6}>
        <Campground
          campground={campgroundPlusAuthorEmail}
          imageLoaded={imageLoaded}
        />
      </Col>
    );
  });

  const spinnerStyle = loading ? { left: '50%' } : { display: 'none' };
  const loadedDisplay = loading ? { display: 'none' } : {};
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
            onLoad={imageLoaded}
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
            {campgroundComponents}
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default UserProfile;
