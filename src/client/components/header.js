import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import { Link, useHistory } from 'react-router-dom';
import { useLoggedInAsContext } from './contexts/loggedInAsContext';


function Header() {
  const {
    logoutUser,
    loggedInAs: {
      id,
      username
    }
  } = useLoggedInAsContext();
  const {
    location: {
      pathname
    },
    push
  } = useHistory();

  function logout() {
    logoutUser(pathname, push);
  }

  const showLoginOrLoggedInAs = username.length > 0
    ? (
      <div className="flex">
        <Link
          className="nav-link padding-auto-0 dissapear-small"
          to="/contactAdmin"
        >
          Contact
        </Link>
        <Link to={`/ycusers/${id}`}>
          <div className="nav-link-custom padding-auto-0 min-width-125">
            Logged in as
            {' '}
              <span className="text-primary font-weight-500" 
              >
                {username}
              </span>
          </div>
        </Link>
        <Button
          size="sm"
          className="float-right btn-max-ht btn-square ml-2 shadow-none"
          onClick={() => logout(pathname)}
        >
          Logout
        </Button>
      </div>
    )
    : (
      <div className="flex">
        <Link
          className="nav-link padding-auto-0 dissapear-small"
          to="/contactAdmin"
        >
          Contact
        </Link>
        <Link
          className="nav-link padding-auto-0"
          to="/login"
        >
          Login
        </Link>
        <Link
          className="nav-link padding-auto-0"
          to="/signup"
        >
          Signup
        </Link>
      </div>
    );

  return (
    <Navbar className={`mb-3 navMinHeight background-beige ${pathname === '/campgroundsHome' && 'navbar-styles'}`} bg="light" variant="light">
      <Container className="d-flex justify-content-between">
        <Col className="min-width-col">
          <Link to="/campgroundsHome">
            <img className="limit-pic-size" src="https://res.cloudinary.com/eleerogers/image/upload/v1593126696/noun_camping_location_710490_srkfky.png" />
            <Navbar.Brand className="color-dark-blue">CampSiter</Navbar.Brand>
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
