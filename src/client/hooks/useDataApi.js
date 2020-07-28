import { useState, useEffect } from 'react';
import axios from 'axios';
 
const useDataApi = (initialUrl, initialData) => {
  const [data, setData] = useState(initialData);
  const [url, setUrl] = useState(initialUrl);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
 
  useEffect(() => {
    let source = axios.CancelToken.source();
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);
  
      try {
        const result = await axios(url, { cancelToken: source.token });
        setData(result.data);
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log(`axios call was cancelled`);
        } else {
          const { response: { data: message } } = err;
          setIsError(`${message}`);
        }
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
    return () => { source.cancel(); }
  }, [url]);
 
  return [
    { data, isLoading, isError },
    setUrl
  ];
};

export default useDataApi;
