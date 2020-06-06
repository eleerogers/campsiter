import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

const MapKeyContext = React.createContext();

function MapKeyContextProvider({ children }) {
  const [mapKey, setMapKey] = useState('');

  useEffect(() => {
    axios.get('/api/campgrounds/mapkey')
      .then(({ data: mKey }) => setMapKey(mKey))
      .catch((err) => {
        const { response: { status, data: message } } = err;
        toast.error(`${message} (${status})`);
      });
  }, []);

  return (
    <MapKeyContext.Provider
      value={{ mapKey }}
    >
      {children}
    </MapKeyContext.Provider>
  );
}

MapKeyContextProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export { MapKeyContextProvider, MapKeyContext };
