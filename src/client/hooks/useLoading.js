import { useState, useRef, useEffect } from 'react';

function useLoading() {
  const mountedRef = useRef(true);
  const [loading, setLoading] = useState(true);

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

  return [loading, setLoadingFalse];
}

export default useLoading;
