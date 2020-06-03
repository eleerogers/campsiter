import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Figure, Button } from 'react-bootstrap';
import useLoading from '../hooks/useLoading';
import '../app.css';


function Campground({ campground, className, mapKey }) {
  const { id, name, image } = campground;
  const [loading, setLoadingFalse] = useLoading();
  console.log('camground key: ', mapKey);
  console.log('campground campground: ', campground);

  return (
    <div>
      <Figure
        className={`centered campground transition ${loading ? 'loading' : 'done'}`}
      >
        <Link to={{
          pathname: `/campgrounds/${id}`,
          state: {
            campground,
            mapKey
          }
        }}
        >
          <Figure.Image
            alt={name}
            src={image}
            onLoad={setLoadingFalse}
            className={className}
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
