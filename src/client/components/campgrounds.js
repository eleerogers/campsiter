import React, { useState, useEffect, useContext } from 'react';
import {
  Button, Jumbotron, Container, Row, Col
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { LoggedInAsContext } from './loggedInAsContext';
import Campground from './campground';


function Campgrounds() {
  const [campgrnds, setCampgrnds] = useState([]);
  const [search, setSearch] = useState('');
  const {
    loggedInAs: {
      email: loggedInAsEmail
    }
  } = useContext(LoggedInAsContext);

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
        toast.error(`${data} (${status})`);
      }
    }
    if (campgrnds.length === 0) {
      fetchData();
    }
    return (() => { mounted = false; });
  }, [campgrnds.length]);

  const searchLC = search.toLowerCase();
  const campgroundComponents = campgrnds.map((campground) => {
    const campgroundName = campground.name.toLowerCase();
    if (search === '' || campgroundName.indexOf(searchLC) !== -1) {
      return (
        <Col
          key={campground.id}
          lg={3}
          md={4}
          sm={6}
          className="mb-4"
        >
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
          <Jumbotron>
            <h1>Welcome to CampSiter!</h1>
            <p>Post and review campsites from around the globe</p>
            {loggedInAsEmail.length > 0
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
                className="form-control col-md-5"
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

export default Campgrounds;
