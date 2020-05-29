import { useState, useRef } from 'react';

function useImagesLoading(numImages) {
  const [loading, setLoading] = useState(true);
  const counter = useRef(0);

  function imageLoaded() {
    counter.current += 1;
    if (counter.current >= numImages) {
      setLoading(false);
    }
  }

  return { loading, imageLoaded };
}

export default useImagesLoading;
