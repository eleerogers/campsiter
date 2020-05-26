import React, { useState, useEffect } from 'react';
import {
  Link,
  useParams
} from 'react-router-dom';
import {
  Col, Container, Row, Button
} from 'react-bootstrap';
import axios from 'axios';
import PropTypes from 'prop-types';
import Campground from './campground';
import '../app.css';

function UserProfile({ loggedInAs }) {
  const [author, setAuthor] = useState({});
  const [campgrounds, setCampgrounds] = useState([]);

  const { id: userId } = useParams();

  useEffect(() => {
    axios.get(`/api/campgrounds/user/${userId}`)
      .then(
        ({
          data: {
            campgrounds: userCampgrounds,
            user
          }
        }) => {
          setCampgrounds(userCampgrounds);
          setAuthor(user);
        }
      );
  }, [userId]);

  function renderEditButton() {
    if (
      (loggedInAs
      && loggedInAs.id === userId)
      || loggedInAs.admin
    ) {
      return (
        <>
          <Link to={{
            pathname: '/editUser',
            state: { author }
          }}
          >
            <Button size="sm" variant="warning" className="mr-2">Edit User</Button>
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
        <Campground campground={campgroundPlusAuthorEmail} />
      </Col>
    );
  });

  return (
    <div className="row">
      <div className="col-md-4">
        <h2>
          {firstName}
          {' '}
          {lastName}
        </h2>
        {' '}
        <div className="thumbnail">
          <img className="img-fluid" src={image} alt={email} />
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
          <Row key={1}>
            {campgroundComponents}
          </Row>
        </Container>
      </div>
    </div>
  );
}

UserProfile.propTypes = {
  loggedInAs: PropTypes.shape({
    id: PropTypes.string,
    password: PropTypes.string,
    email: PropTypes.string,
    created_at: PropTypes.string,
    admin: PropTypes.bool,
  }).isRequired,
};

export default UserProfile;
