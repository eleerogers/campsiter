import React from 'react';
import { Col } from 'react-bootstrap';
import Campground from './campground';

function Campgrounds({ campgrounds, configObj }) {
  const {
    sm, md, lg, colClass, campClass, mapKey
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
          mapKey={mapKey}
        />
      </Col>
    ))
  );
}

export default Campgrounds;
