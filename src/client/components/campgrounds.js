import React from 'react';
import Col from 'react-bootstrap/Col';
import CampgroundThumb from './campgroundThumb';


function Campgrounds({ campgrounds, configObj }) {
  const {
    sm, md, lg, colClass, campClass
  } = configObj;

  return (
    campgrounds.map((campground) => (
      <Col
        key={campground.id}
        sm={sm}
        md={md}
        lg={lg}
        className={colClass}
      >
        <CampgroundThumb
          campground={campground}
          className={campClass}
        />
      </Col>
    ))
  );
}

export default Campgrounds;
