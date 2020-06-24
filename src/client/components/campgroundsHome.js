import React, {
  useState, useContext, useEffect
} from 'react';
import {
  Button, Jumbotron, Container, Row, Col, Spinner, Pagination
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LoggedInAsContext } from './contexts/loggedInAsContext';
import usePagination from '../hooks/usePagination';
import Campgrounds from './campgrounds';
import useSearchFilter from '../hooks/useSearchFilter';
import useGetCGs from '../hooks/useGetCGs';


function CampgroundsHome() {
  const [search, setSearch] = useState('');
  const { data: { campgrounds }, errMsg, isLoading } = useGetCGs();
  const filteredCGs = useSearchFilter(search, campgrounds);
  const CAMPGROUNDS_PER_PAGE = 12;
  const {
    jump, currentData, currentPage, maxPage
  } = usePagination(filteredCGs, CAMPGROUNDS_PER_PAGE);
  const thisPageCGs = currentData();

  const pages = [];
  for (let number = 1; number <= maxPage; number += 1) {
    pages.push(
      <Pagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => jump(number)}
      >
        {number}
      </Pagination.Item>,
    );
  }
  const paginationDisplay = pages.length > 1
    && (
      <div>
        <Pagination className="center-div">
          {pages}
        </Pagination>
      </div>
    );

  function handleSearchChange(e) {
    e.preventDefault();
    setSearch(e.target.value);
    if (pages.length) {
      jump(1);
    }
  }

  const {
    loggedInAs: {
      email: loggedInAsEmail
    }
  } = useContext(LoggedInAsContext);

  useEffect(() => {
    if (errMsg) {
      toast.error(errMsg);
    }
  }, [errMsg]);

  const campgroundsDisplayConfig = {
    sm: 6,
    md: 4,
    lg: 3,
    colClass: 'mb-4',
    campClass: 'campgroundThumb'
  };

  const spinnerStyle = isLoading ? { left: '50%' } : { display: 'none' };

  return (
    <div>
      <Container>
        <Container>
          <Jumbotron>
            <h1>Welcome to CampSiter!</h1>
            <p>Post and review campsites from around the globe</p>
            <Link to="/newCampground">
              <Button
                variant="primary"
                size="lg"
              >
                Add New Campground
              </Button>
            </Link>
            <br />
            <br />
            <form
              className="form-inline"
              onSubmit={(e) => { e.preventDefault(); }}
            >
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
        <Container className="text-align-center">
          <Row
            style={spinnerStyle}
            key={1}
          >
            <Col
              style={{
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
          <Row
            key={2}
            style={{
              'minWidth': '296px'
            }}
          >
            <Campgrounds
              campgrounds={thisPageCGs}
              configObj={campgroundsDisplayConfig}
            />
          </Row>
        </Container>
        {paginationDisplay}
      </Container>
    </div>
  );
}

export default CampgroundsHome;
