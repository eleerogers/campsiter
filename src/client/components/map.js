import React, { Suspense } from 'react';
import lazy from 'react-lazy-named';
const GoogleMap = lazy(() => import ('@react-google-maps/api'), 'GoogleMap');
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
    <Suspense fallback={<div />}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
        // onUnmount={onUnmount}
      />
    </Suspense>

  );
}

MapContainer.propTypes = {
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired
};

export default React.memo(MapContainer);
