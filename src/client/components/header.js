import React, { useState } from 'react';
import {
  Nav, Navbar, Container, Button, Col
} from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';


function Header({ loggedInAs, logout }) {
  const {
    location: {
      pathname
    },
    push,
    listen
  } = useHistory();
  const [currPath, setCurrPath] = useState(pathname === '/');

  listen((location) => {
    setCurrPath(location.pathname);
  });
  // function handlePathChange() {
  //   console.log('handlePathChang')
  //   setIsHome(pathname === '/');
  // }

  // useEffect(() => {
  //   console.log('useEffect');
  //   window.addEventListener('popstate', handlePathChange);
  //   return () => window.removeEventListener('popstate', handlePathChange);
  // });

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

  if (currPath === '/') {
    return null;
  }

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
                    <Button size="sm" className="float-right ml-3" onClick={() => logout(currPath, push)}>Logout</Button>
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
}


Header.propTypes = {
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
