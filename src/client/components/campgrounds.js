import React, { useState, useEffect } from 'react';
import {
  Button, Jumbotron, Container, Row, Col, Alert
} from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import Campground from './campground';


function Campgrounds({ loggedInAs }) {
  const [campgrnds, setCampgrnds] = useState([]);
  const [alertMsg, setAlertMsg] = useState(null);
  const [search, setSearch] = useState('');
  const {
    location: {
      state
    },
    replace
  } = useHistory();

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      try {
        const { data: { campgrounds } } = await axios.get('/api/campgrounds');
        if (mounted) {
          setCampgrnds(campgrounds);
        }
      } catch (err) {
        console.error(err);
        const { response: { status, data } } = err;
        setAlertMsg({ text: `${data} (${status})`, variant: 'danger' });
      }
    }
    fetchData();
    return (() => { mounted = false; });
  }, []);

  useEffect(() => {
    if (state) {
      const { alertMessage } = state;
      setAlertMsg(alertMessage);
    }
  }, [state]);

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
                replace('/campgrounds', null);
                setAlertMsg(null);
              }}
              variant={`outline-${variant}`}
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
  loggedInAs: PropTypes.shape({
    id: PropTypes.string,
    password: PropTypes.string,
    email: PropTypes.string,
    created_at: PropTypes.string,
    admin: PropTypes.bool,
  }).isRequired,
};

export default Campgrounds;
