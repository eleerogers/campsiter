import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Figure, Button } from 'react-bootstrap';
import '../app.css';


function Campground({ campground }) {
  const { id, name, image } = campground;
  const [loading, setLoading] = useState(true);

  function cGLoad() {
    setLoading(false);
  }

  return (
    <div>
      <Figure
        className={`centered campground transition ${loading ? 'loading' : 'done'}`}
      >
        <Link to={{
          pathname: `/campgrounds/${id}`,
          state: {
            campground
          }
        }}
        >
          <Figure.Image
            alt={name}
            src={image}
            onLoad={cGLoad}
            className="campgroundThumb"
            thumbnail
          />
          <Figure.Caption className="text-center">
            {name}
          </Figure.Caption>
          <Button
            size="sm"
            variant="outline-primary"
            className="campgroundBtn"
          >
            More Info
          </Button>
        </Link>
      </Figure>
    </div>
  );
}

Campground.propTypes = {
  campground: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired
  }).isRequired,
};

export default Campground;
