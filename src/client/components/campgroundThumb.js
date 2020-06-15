import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Figure, Button } from 'react-bootstrap';
import useLoading from '../hooks/useLoading';


function CampgroundThumb({ campground, className }) {
  const { id, name, image } = campground;
  const [loading, setLoadingFalse] = useLoading();

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

CampgroundThumb.propTypes = {
  campground: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired
  }).isRequired,
  className: PropTypes.string.isRequired
};

export default CampgroundThumb;
