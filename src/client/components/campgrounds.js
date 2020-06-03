import React from 'react';
import { Col } from 'react-bootstrap';
import Campground from './campground';

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
        <Campground
          campground={campground}
          className={campClass}
        />
      </Col>
    ))
  );
}

export default Campgrounds;
