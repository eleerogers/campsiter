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
import useSearchFilter from '../hooks/useSearchFilter';


function CampgroundsHome() {
  const [search, setSearch] = useState('');
  const { data: { campgrounds }, error, isPending } = useCampgrounds();
  const filteredCGs = useSearchFilter(search, campgrounds);

  function handleSearchChange(e) {
    e.preventDefault();
    setSearch(e.target.value);
  }

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
    className: 'mb-4',
    isLazy: true
  };

  const spinnerStyle = isPending ? { left: '50%' } : { display: 'none' };

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
                onChange={handleSearchChange}
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
            key={2}
          >
            <Campgrounds
              campgrounds={filteredCGs}
              configObj={campgroundsDisplayConfig}
            />
          </Row>
        </Container>
      </Container>
    </div>
  );
}

export default CampgroundsHome;
