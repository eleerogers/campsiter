import React from 'react';
import Rating from 'react-rating';
import StarEmpty from 'react-bootstrap-icons/dist/icons/star';
import StarFill from 'react-bootstrap-icons/dist/icons/star-fill';
import PropTypes from 'prop-types';

function StarRating({
    currRating,
    handleChange,
    readonly,
    className,
    numRatings,
    centered
  }) {
  return (
    <div className={`flex flex-wrap align-end ${centered ? 'justify-centered mb-3' : 'mb-2'}`}>
      <Rating
        fractions={1}
        name="rating"
        initialRating={currRating}
        onChange={handleChange}
        emptySymbol={<StarEmpty className={className} />}
        fullSymbol={<StarFill className={className} />}
        readonly={readonly}
      />
      { numRatings && <div className="ml-1"><i> (total reviews: {numRatings})</i></div> }
    </div>
  )
}

StarRating.propTypes = {
  currRating: PropTypes.string,
  handleChange: PropTypes.func,
  readonly: PropTypes.bool,
  className: PropTypes.string,
  numRatings: PropTypes.number,
  centered: PropTypes.bool
}

export default StarRating;
