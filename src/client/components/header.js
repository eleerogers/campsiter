import React, { useState, useEffect, useContext } from 'react';
import {
  Nav, Navbar, Container, Button, Col
} from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { LoggedInAsContext } from './loggedInAsContext';


function Header({ loginFormReset }) {
  const {
    logoutUser,
    loggedInAs: {
      id,
      username,
      firstName,
      lastName,
      email,
      image,
      imageId,
      admin,
      message
    }
  } = useContext(LoggedInAsContext);
  const {
    location: {
      pathname
    },
    push,
    listen
  } = useHistory();
  const [currPath, setCurrPath] = useState();

  useEffect(() => {
    setCurrPath(pathname);
  }, [pathname]);

  listen((location) => {
    loginFormReset();
    setCurrPath(location.pathname);
  });

  function logout() {
    logoutUser(pathname, loginFormReset, push);
  }

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

  if (currPath === '/') {
    return null;
  }

  const showLoginOrLoggedInAs = email.length > 0
    ? (
      <div>
        Logged in as
        {' '}
        <Link to={{
          pathname: `/ycusers/${id}`,
          state: {
            author
          }
        }}
        >
          {email}
        </Link>
        {' '}
        {admin && '(admin)'}
        <Button size="sm" className="float-right ml-3" onClick={() => logout(currPath)}>Logout</Button>
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
    );

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
              {showLoginOrLoggedInAs}
            </Nav>
          </Navbar.Collapse>
        </Col>
      </Container>
    </Navbar>
  );
}

Header.propTypes = {
  loginFormReset: PropTypes.func.isRequired
};

export default Header;
