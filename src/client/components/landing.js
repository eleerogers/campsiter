import React from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';


function Landing() {

  return (
    <div className="landing-outer">
      <div className="landing-header">
        <h1 className="hhh">Welcome to CampSiter!</h1>
        <br />
        <br />
        <ul>
          <Link to="/campgroundsHome">
            <Button
              className="box-shadow enter-app-button"
              variant="info"
              id="enter-app-button"
            >
              Get Started
            </Button>
          </Link>
        </ul>
      </div>
      <button id="clicker" onClick={() => console.log("clicked!")}>click me</button>
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
