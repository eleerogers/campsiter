import React from 'react';
import { Navbar, Container } from 'react-bootstrap';


function Footer() {
  return (
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
