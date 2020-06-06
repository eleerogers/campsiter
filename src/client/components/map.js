// import React, { useContext } from 'react';
// import { GoogleMap, LoadScriptNext } from '@react-google-maps/api';
// import PropTypes from 'prop-types';
// import { MapKeyContext } from './contexts/mapKeyContext';


// function MapContainer({ lat, lng }) {
//   const { mapKey } = useContext(MapKeyContext);
//   const center = { lat, lng };
//   const style = {
//     width: '100%',
//     height: '400px'
//   };

//   return (
//     <LoadScriptNext googleMapsApiKey={mapKey}>
//       <GoogleMap
//         mapContainerStyle={style}
//         zoom={15}
//         center={center}
//       />
//     </LoadScriptNext>
//   );
// }

// MapContainer.propTypes = {
//   lat: PropTypes.number.isRequired,
//   lng: PropTypes.number.isRequired
// };

// export default MapContainer;


import React, { useContext } from 'react';
import { GoogleMap, LoadScriptNext } from '@react-google-maps/api';
import PropTypes from 'prop-types';
// import { MapKeyContext } from './contexts/mapKeyContext';

const containerStyle = {
  width: '100%',
  height: '400px'
};


function MapContainer({ lat, lng }) {
  const center = { lat, lng };
  // const { mapKey } = useContext(MapKeyContext);
  const [map, setMap] = React.useState(null);

  const onLoad = React.useCallback((m) => {
    console.log('map onload m', m);
    console.log('map onload map', map);
    // const bounds = new window.google.maps.LatLngBounds();
    // map.fitBounds(bounds);
    // setMap(map);
  }, []);

  const onUnmount = React.useCallback((map) => {
    setMap(null);
  }, []);

  return (
    // <LoadScriptNext
    //   googleMapsApiKey={mapKey}
    // >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        { /* Child components, such as markers, info windows, etc. */ }
        <></>
      </GoogleMap>
    // </LoadScriptNext>
  );
}

MapContainer.propTypes = {
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired
};

export default React.memo(MapContainer);
