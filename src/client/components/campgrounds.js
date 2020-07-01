import React, { Suspense } from 'react';
import Col from 'react-bootstrap/lib/Col';
const CampgroundThumb = React.lazy(() => import('./campgroundThumb'))
// import CampgroundThumb from './campgroundThumb';

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
