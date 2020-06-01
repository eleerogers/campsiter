import { useState } from 'react';

function useImagesLoading(numImages) {
  const [loading, setLoading] = useState(true);
  let counter = 0;

  function imageLoaded() {
    counter += 1;
    console.log(counter);
    if (counter >= numImages) {
      setLoading(false);
    }
  }

  function reset() {
    counter = 0;
    setLoading(true);
  }
  console.log({numImages});
  console.log({loading});
  return { loading, imageLoaded, reset };
}

export default useImagesLoading;
