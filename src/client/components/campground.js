import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Figure, Button } from 'react-bootstrap';
import '../app.css';
import useForm from '../hooks/useForm';


function Campground({ campground }) {
  const { id, name, image } = campground;
  const [loading, setLoading] = useState(true);
  // const campgroundStyle = isLazy ? { display: 'none' } : {};

  useEffect(() => {
    console.log('useEffect: ', loading);
  }, [loading]);

  function cGLoad() {
    console.log('before: ', loading);
    setLoading(false);
  }

  return (
    <div>
      <Figure
        className={`centered campground ${loading ? 'loading' : 'done'}`}
        // style={campgroundStyle}
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
  // imageLoaded: PropTypes.func.isRequired,
  // isLazy: PropTypes.bool.isRequired
};

export default Campground;
