import React, { useContext } from 'react';
import {
  Nav, Navbar, Container, Button, Col
} from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { LoggedInAsContext } from './loggedInAsContext';


function Header() {
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
    push
  } = useHistory();

  function logout() {
    logoutUser(pathname, push);
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
        <Button
          size="sm"
          className="float-right ml-3"
          onClick={() => logout(pathname)}
        >
          Logout
        </Button>
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

export default Header;
