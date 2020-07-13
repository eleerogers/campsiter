import { useState, useEffect } from 'react';
import axios from 'axios';
 
const useDataApi = (initialUrl, initialData) => {
  const [data, setData] = useState(initialData);
  const [url, setUrl] = useState(initialUrl);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
 
  useEffect(() => {
    // if (!alreadyHaveData) {
      let mounted = true;
      const fetchData = async () => {
          setIsError(false);
          setIsLoading(true);
   
        try {
          if (mounted) {
            const result = await axios(url);
            setData(result.data);
          }
        } catch (err) {
          const { response: { status, data: message } } = err;
          if (mounted) {
            setIsError(`${message} (${status})`);
          }
        }
        
        if (mounted) {
          setIsLoading(false);
        }
      };
   
      fetchData();
      return () => { mounted = false }
    // }
  }, [url]);
 
  return [{ data, isLoading, isError }, setUrl];
};

export default useDataApi;
