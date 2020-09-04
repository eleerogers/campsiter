import React, { lazy, Suspense } from 'react';
import Col from 'react-bootstrap/Col';
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
        <Suspense fallback={<div />}>
          <CampgroundThumb
            campground={campground}
            className={campClass}
          />
        </Suspense>
      </Col>
    ))
  );
}

export default Campgrounds;
