import React from 'react';
import { Navbar, Container } from 'react-bootstrap';
// import PropTypes from 'prop-types';


function Footer() {
  return (
  <Navbar className="mt-5" bg="dark" variant="light" sticky="bottom">
    <Container className="footer-copyright text-center pb-1 pt-1 footer">
      <div className="grey-text ml-auto">
        © {new Date().getFullYear()} CampSiter
      </div>
    </Container>
  </Navbar>
  );
}

// Campground.propTypes = {
//   campground: PropTypes.shape({
//     id: PropTypes.number.isRequired,
//     name: PropTypes.string.isRequired,
//     image: PropTypes.string.isRequired
//   }).isRequired
// };

export default Footer;
