import React from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import PropTypes from 'prop-types';


function MapContainer({ lat, lng, mapKey }) {
  const center = { lat, lng };
  const style = {
    width: '100%',
    height: '400px'
  };

  return (
    <LoadScript googleMapsApiKey={mapKey}>
      <GoogleMap
        mapContainerStyle={style}
        zoom={15}
        center={center}
      />
    </LoadScript>
  );
}

MapContainer.propTypes = {
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
  mapKey: PropTypes.string.isRequired,
};

export default MapContainer;
