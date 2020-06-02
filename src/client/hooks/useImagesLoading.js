import { useState } from 'react';

function useImagesLoading(numImages) {
  const [loading, setLoading] = useState(true);
  let counter = 0;

  function imageLoaded() {
    counter += 1;
    if (counter >= numImages) {
      setLoading(false);
    }
  }

  function reset() {
    counter = 0;
    setLoading(true);
  }

  return { loading, imageLoaded, reset };
}

export default useImagesLoading;
