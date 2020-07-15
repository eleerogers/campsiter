import React from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';


function Landing() {
  return (
    <div className="landing-outer">
      <div className="landing-header">
        <h1>Welcome to CampSiter!</h1>
        <br />
        <br />
        <br />
        <ul>
          <Link to="/campgroundsHome">
            <Button
              className="box-shadow"
              variant="info"
            >
              Get Started
            </Button>
          </Link>
        </ul>
      </div>
      <ul className="slideshow">
        <li />
        <li />
        <li />
        <li />
        <li />
      </ul>
    </div>
  );
}

export default Landing;
