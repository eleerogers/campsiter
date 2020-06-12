import { useState, useRef, useEffect } from 'react';

function useLoading(initLoadingState = true) {
  const mountedRef = useRef(true);
  const [loading, setLoading] = useState(initLoadingState);

  useEffect(() => {
    mountedRef.current = true;
    // console.log('useLoading mountedRef: ', mountedRef.current);
    return () => { 
      mountedRef.current = false;
      // console.log('useLoading mountedRef: ', mountedRef.current);
    }
  }, [])

  function setLoadingFalse() {
    if (mountedRef.current) {
      setLoading(false);
    }
  }

  function setLoadingTrue() {
    if (mountedRef.current) {
      setLoading(true);
    }
  }

  return [loading, setLoadingFalse, setLoadingTrue];
}

export default useLoading;
