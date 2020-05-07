import React, { useState, useEffect } from 'react';
import {
  Button, Jumbotron, Container, Row, Col, Alert
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import Campground from './campground';


export default function Campgrounds({ location, history, loggedInAs }) {
  const [campgrnds, setCampgrnds] = useState([]);
  const [alertMsg, setAlertMsg] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: { campgrounds } } = await axios.get('/api/campgrounds');
        setCampgrnds(campgrounds);
      } catch (e) {
        console.error(e);
      }
    }
    const { state } = location;
    if (state) {
      const { alertMessage } = state;
      setAlertMsg(alertMessage);
    }
    fetchData();
  }, []);

  const renderAlert = () => {
    const space = '    ';

    if (alertMsg) {
      const { text, variant } = alertMsg;
      return (
        <Alert variant={variant}>
          <Alert>
            {text}
            {space}
            <Button
              onClick={() => {
                history.replace('/campgrounds', null);
                setAlertMsg(null);
              }}
              variant="outline-success"
              size="sm"
            >
              X
            </Button>
          </Alert>
        </Alert>
      );
    }
    return null;
  };

  const searchLC = search.toLowerCase();
  const campgroundComponents = campgrnds.map((campground) => {
    const campgroundName = campground.name.toLowerCase();
    if (search === '' || campgroundName.indexOf(searchLC) !== -1) {
      return (
        <Col key={campground.id} lg={3} md={4} sm={6} className="mb-4">
          <Campground campground={campground} />
        </Col>
      );
    }
    return null;
  });

  return (
    <div>
      <Container>
        <Container>
          {renderAlert()}
          <Jumbotron>
            <h1>Welcome to CampSiter!</h1>
            <p>Post and review campsites from around the globe</p>
            {loggedInAs.email.length > 0
              ? (
                <Link to="/newCampground">
                  <Button variant="primary" size="lg">Add New Campground</Button>
                </Link>
              )
              : (
                <Link to="/login">
                  <Button variant="primary" size="lg">Login to Add New Campground</Button>
                </Link>
              )}
            <br />
            <br />
            <form className="form-inline">
              <input
                className="form-control col-md-3"
                type="text"
                name="search"
                placeholder="Search campgrounds..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoComplete="off"
              />
            </form>
          </Jumbotron>
        </Container>
        <Container>
          <Row key={1}>
            {campgroundComponents}
          </Row>
        </Container>
      </Container>
    </div>
  );
}

Campgrounds.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired
  }).isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      alertMessage: PropTypes.shape({
        text: PropTypes.string,
        variant: PropTypes.string
      }),
    })
  }).isRequired,
  loggedInAs: PropTypes.shape({
    id: PropTypes.string,
    password: PropTypes.string,
    email: PropTypes.string,
    created_at: PropTypes.string,
    admin: PropTypes.bool,
  }).isRequired,
};
