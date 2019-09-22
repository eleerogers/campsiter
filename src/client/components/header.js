import React from 'react';
import {
  Nav, Navbar, Container, Button, Col
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';


const Header = ({ loggedInAs, logout, history }) => {
  const {
    id,
    username,
    firstName,
    lastName,
    email,
    image,
    imageId,
    admin,
    message
  } = loggedInAs;
  const author = {
    id,
    username,
    first_name: firstName,
    last_name: lastName,
    email,
    image,
    image_id: imageId,
    admin,
    message
  };
  return (
    <Navbar className="mb-3" bg="light" variant="light">
      <Container className="d-flex justify-content-between">
        <Col>
          <Link to="/campgrounds">
            <Navbar.Brand>CampSiter</Navbar.Brand>
          </Link>
        </Col>

        <Col>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              {loggedInAs.email.length > 0
                ? (
                  <div>
                    Logged in as
                    {' '}
                    <Link to={{
                      pathname: `/ycusers/${loggedInAs.id}`,
                      state: {
                        author
                      }
                    }}
                    >
                      {loggedInAs.email}
                    </Link>
                    {' '}
                    {loggedInAs.admin && '(admin)'}
                    <Button size="sm" className="float-right ml-3" onClick={() => logout(history)}>Logout</Button>
                  </div>
                )
                : (
                  <>
                    <Link
                      className="nav-link"
                      to={{ pathname: '/login' }}
                    >
                      Login
                    </Link>
                    <Link
                      className="nav-link"
                      to={{ pathname: '/signup' }}
                    >
                      Signup
                    </Link>
                  </>
                )}
            </Nav>
          </Navbar.Collapse>
        </Col>
      </Container>
    </Navbar>
  );
};


Header.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  loggedInAs: PropTypes.shape({
    id: PropTypes.string,
    password: PropTypes.string,
    email: PropTypes.string,
    created_at: PropTypes.string,
    username: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    image: PropTypes.string,
    imageId: PropTypes.string,
    message: PropTypes.string,
    admin: PropTypes.bool,
  }).isRequired,
  logout: PropTypes.func.isRequired,
};

export default Header;
