import React from 'react';
import Col from 'react-bootstrap/Col';
import CampgroundThumb from './campgroundThumb';

interface Props {
  campgrounds: {
    created_at: string;
    id: number;
    image: string;
    image_id: string;
    lat: number;
    lng: number;
    location: string;
    name: string;
    price: string;
    rating?: string;
    user_id: number;
    username: string;
  }[];
  configObj: {
    sm: number,
    md: number,
    lg: number,
    colClass: string,
    campClass: string
  }
}

function Campgrounds({ campgrounds, configObj }: Props) {
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
