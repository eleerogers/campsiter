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
            <Navbar.Brand>YelpCamp2</Navbar.Brand>
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
                  <React.Fragment>
                    <Link to={{
                      pathname: '/login',
                    }}
                    >
                      Login
                    </Link>
                    {/* <Nav.Link href="/login">Login</Nav.Link> */}
                    {/* <Nav.Link href="/signup">Signup</Nav.Link> */}
                    <Link to={{
                      pathname: '/signup',
                    }}
                    >
                      Signup
                    </Link>
                  </React.Fragment>
                )
              }
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
  }).isRequired,
  logout: PropTypes.func.isRequired,
};

export default Header;
