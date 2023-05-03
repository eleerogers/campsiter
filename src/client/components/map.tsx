import React from 'react';
import { GoogleMap } from '@react-google-maps/api';


const containerStyle = {
  width: '100%',
  height: '400px'
};

interface Props {
  lat: number;
  lng: number;
}

function MapContainer({ lat, lng }: Props) {
  const center = { lat, lng };

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={15}
    />
  );
}

export default React.memo(MapContainer);
