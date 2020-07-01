import React from 'react';
import { GoogleMap } from '@react-google-maps/api';
import PropTypes from 'prop-types';


const containerStyle = {
  width: '100%',
  height: '400px'
};

function MapContainer({ lat, lng }) {
  const center = { lat, lng };
  // const [map, setMap] = React.useState(null);

  // const onUnmount = React.useCallback((map) => {
  //   setMap(null);
  // }, []);

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={15}
      // onUnmount={onUnmount}
    />
  );
}

MapContainer.propTypes = {
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired
};

export default React.memo(MapContainer);
