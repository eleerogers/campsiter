import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Figure, Button } from 'react-bootstrap';
import '../app.css';


function Campground({ campground, imageLoaded }) {
  const { id, name, image } = campground;
  return (
    <div>
      <Figure className="centered">
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
            onLoad={imageLoaded}
            thumbnail
          />
          <Figure.Caption className="text-center">
            {name}
          </Figure.Caption>
          <Button
            size="sm"
            variant="outline-primary"
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
  imageLoaded: PropTypes.func.isRequired
};

export default Campground;
