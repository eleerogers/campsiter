import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';


function Landing() {
  return (
    <div className="landing-outer">
      <div className="landing-header">
        <h1>Welcome to YelpCamp2!</h1>
        <ul>
          <Link to="/campgrounds">
            <Button variant="primary">Get Started</Button>
          </Link>
        </ul>
      </div>
      <ul className="slideshow">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </div>
  );
}

export default Landing;
