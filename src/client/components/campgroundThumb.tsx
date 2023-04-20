import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Figure from 'react-bootstrap/Figure';
import Button from 'react-bootstrap/Button';
import useLoading from '../hooks/useLoading';
import StarRating from './starRating';
import { ICampground } from '../interfaces';


interface Props {
  campground: ICampground;
  className: string;
}

function CampgroundThumb({ campground, className }: Props) {
  const { id, name, image, rating } = campground;
  const [loading, setLoadingFalse] = useLoading();

  return (
    <div>
      <Figure
        className={`img-fluid w-100 centered campground transition ${loading ? 'loading' : 'done'}`}
      >
        <Link to={`/campgrounds/${id}`}>
          <Figure.Image
            alt={name}
            src={image}
            onLoad={setLoadingFalse}
            className={className}
            thumbnail
          />
        </Link>
        <Figure.Caption className="text-center">
          <Link className="color-grey" to={`/campgrounds/${id}`}>
            {name}
          </Link>
          <div className="centered thumb-rating">
          {
            (rating && +rating > 0) ?
            <StarRating
              currRating={+rating}
              readonly={true}
              className="star-sm"
              divClassName="justify-centered mb-1"
            />
            : <p className="mb-1"><i>No reviews yet</i></p>
          }
          </div>
        </Figure.Caption>
        <Link to={`/campgrounds/${id}`}>
          <Button
            size="sm"
            variant="outline-primary"
            className="mt-1"
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
    image: PropTypes.string.isRequired,
    rating: PropTypes.string
  }).isRequired,
  className: PropTypes.string.isRequired
};

export default CampgroundThumb;
