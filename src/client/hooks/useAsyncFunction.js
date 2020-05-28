import { useState, useEffect } from 'react';

function useAsyncFunction(asyncFunction, defaultValue) {
  const [state, setState] = useState({
    value: defaultValue,
    error: null,
    isPending: true
  });

  useEffect(() => {
    asyncFunction()
      .then(
        (value) => setState({ value, error: null, isPending: false })
      )
      .catch(
        (error) => setState({ ...state, error: error.toString(), isPending: false })
      );
  }, [asyncFunction, state]);

  const { value, error, isPending } = state;
  return [value, error, isPending];
}

export default useAsyncFunction;
