import React, { useState, useEffect } from 'react';
import {
  Map, GoogleApiWrapper
} from 'google-maps-react';
import PropTypes from 'prop-types';


function MapContainer({ google, lat, lng }) {
  const [currLat, setCurrLat] = useState(lat);
  const [currLng, setCurrLng] = useState(lng);
  useEffect(() => {
    setCurrLat(lat);
  }, [lat]);
  useEffect(() => {
    setCurrLng(lng);
  }, [lng]);
  const center = { lat: currLat, lng: currLng };
  const style = {
    width: '100%',
    height: '400px'
  };
  return (
    <Map
      google={google}
      style={style}
      center={center}
      zoom={15}
      scrollwheel={false}
    />
  );
}

MapContainer.propTypes = {
  campground: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired
  }).isRequired,
  google: PropTypes.shape({
    maps: PropTypes.shape({
      Map: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
};

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_API_KEY
})(MapContainer);
