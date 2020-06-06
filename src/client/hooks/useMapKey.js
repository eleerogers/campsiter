import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function useMapKey() {
  const [mapKey, setMapKey] = useState('');

  useEffect(() => {
    axios.get('/api/campgrounds/mapkey')
      .then(({ data: mKey }) => setMapKey(mKey))
      .catch((err) => {
        const { response: { status, data: message } } = err;
        toast.error(`${message} (${status})`);
      });
  }, []);

  return mapKey;
}

export default useMapKey;
