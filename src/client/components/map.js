import React from 'react';
import {
  Map, GoogleApiWrapper
} from 'google-maps-react';
import PropTypes from 'prop-types';


function MapContainer({ google, campground: { lat, lng } }) {
  const center = { lat, lng };
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
