import React from 'react';
import { useHistory } from 'react-router-dom';
import { Navbar, Container } from 'react-bootstrap';


function Footer() {
  const {
    location: {
      pathname
    }
  } = useHistory();

  return pathname === '/' ? null : (
  <Navbar bg="dark" variant="light" sticky="bottom">
    <Container className="footer-copyright text-center pb-1 pt-1 footer">
      <div className="text-muted font-size-14 ml-auto">
        © {new Date().getFullYear()} CampSiter
      </div>
    </Container>
  </Navbar>
  );
}

export default Footer;
