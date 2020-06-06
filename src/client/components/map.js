import React, { useContext } from 'react';
import { GoogleMap, LoadScriptNext } from '@react-google-maps/api';
import PropTypes from 'prop-types';
import { MapKeyContext } from './contexts/mapKeyContext';


function MapContainer({ lat, lng }) {
  const { mapKey } = useContext(MapKeyContext);
  const center = { lat, lng };
  const style = {
    width: '100%',
    height: '400px'
  };

  return (
    <LoadScriptNext googleMapsApiKey={mapKey}>
      <GoogleMap
        mapContainerStyle={style}
        zoom={15}
        center={center}
      />
    </LoadScriptNext>
  );
}

MapContainer.propTypes = {
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired
};

export default MapContainer;
