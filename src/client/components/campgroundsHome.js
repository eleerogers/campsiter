import React, {
  useState, useContext, useEffect
} from 'react';
import {
  Button, Jumbotron, Container, Row, Col, Spinner
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LoggedInAsContext } from './loggedInAsContext';
import useCampgrounds from '../hooks/useCampgrounds';
import Campgrounds from './campgrounds';
import useImagesLoaded from '../hooks/useImagesLoading';


function CampgroundsHome() {
  const [search, setSearch] = useState('');

  const { campgrounds, error } = useCampgrounds();
  const [filteredCGs, setFilteredCGs] = useState(campgrounds || []);

  const { loading, imageLoaded } = useImagesLoaded(filteredCGs.length);

  useEffect(() => {
    const searchLC = search.toLowerCase();
    const campgroundsFilteredBySearch = campgrounds.filter((campground) => {
      const campgroundName = campground.name.toLowerCase();
      return (search === ''
      || campgroundName.indexOf(searchLC) !== -1);
    });
    setFilteredCGs(campgroundsFilteredBySearch);
  }, [campgrounds, search]);

  const {
    loggedInAs: {
      email: loggedInAsEmail
    }
  } = useContext(LoggedInAsContext);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const campgroundsDisplayConfig = {
    sm: 6,
    md: 4,
    lg: 3,
    className: 'mb-4'
  };
  // const campgroundComponents = campgrounds.map((campground) => {
  //   const campgroundName = campground.name.toLowerCase();
  //   if (search === '' || campgroundName.indexOf(searchLC) !== -1) {
  //     return (
  //       <Col
  //         key={campground.id}
  //         lg={3}
  //         md={4}
  //         sm={6}
  //         className="mb-4"
  //       >
  //         <Campground
  //           campground={campground}
  //           imageLoaded={imageLoaded}
  //         />
  //       </Col>
  //     );
  //   }
  //   return null;
  // });

  const spinnerStyle = loading ? { left: '50%' } : { display: 'none' };
  const campgroundsStyle = loading ? { display: 'none' } : {};

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
                  <Button
                    variant="primary"
                    size="lg"
                  >
                    Add New Campground
                  </Button>
                </Link>
              )
              : (
                <Link to="/login">
                  <Button
                    variant="primary"
                    size="lg"
                  >
                    Login to Add New Campground
                  </Button>
                </Link>
              )}
            <br />
            <br />
            <form className="form-inline">
              <input
                className="form-control search-form"
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
          <Row
            style={spinnerStyle}
            key={1}
          >
            <Col style={{ textAlign: 'center' }}>
              <Spinner
                animation="border"
                variant="primary"
                size="xl"
              />
            </Col>
          </Row>
          <Row
            style={campgroundsStyle}
            key={2}
          >
            <Campgrounds
              campgrounds={filteredCGs}
              configObj={campgroundsDisplayConfig}
              imageLoaded={imageLoaded}
            />
          </Row>
        </Container>
      </Container>
    </div>
  );
}

export default CampgroundsHome;
