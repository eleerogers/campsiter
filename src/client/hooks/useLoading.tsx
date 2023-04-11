import { useState, useRef, useEffect } from 'react';

function useLoading(initLoadingState = true) {
  const mountedRef = useRef(true);
  const [loading, setLoading] = useState(initLoadingState);

  useEffect(() => {
    mountedRef.current = true;
    return () => { 
      mountedRef.current = false;
    };
  }, []);

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

  return [loading, setLoadingFalse, setLoadingTrue] as const;
}

export default useLoading;
