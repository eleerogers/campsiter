import React from 'react';
import Col from 'react-bootstrap/Col';
import { lazy, LazyBoundary } from 'react-imported-component';
const CampgroundThumb = lazy(() => import('./campgroundThumb'));


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
        <LazyBoundary fallback={<div />}>
          <CampgroundThumb
            campground={campground}
            className={campClass}
          />
        </LazyBoundary>
      </Col>
    ))
  );
}

export default Campgrounds;
