import { useState } from 'react';

function useLoading() {
  const [loading, setLoading] = useState(true);

  function setLoadingFalse() {
    setLoading(false);
  }

  return [loading, setLoadingFalse];
}

export default useLoading;
