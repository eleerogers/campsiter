import React from 'react';
import { Col } from 'react-bootstrap';
import Campground from './campground';

function Campgrounds({ campgrounds, configObj, imageLoaded }) {
  const {
    sm, md, lg, className
  } = configObj;
  return (
    campgrounds.map((campground) => (
      <Col
        key={campground.id}
        sm={sm}
        md={md}
        lg={lg}
        className={className}
      >
        <Campground
          campground={campground}
          imageLoaded={imageLoaded}
        />
      </Col>
    ))
  );
}

export default Campgrounds;
