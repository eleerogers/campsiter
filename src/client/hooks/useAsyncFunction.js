import { useState, useEffect } from 'react';

function useAsyncFunction(asyncFunction, defaultValue = null, ...optionalParams) {
  const [state, setState] = useState({
    value: defaultValue,
    error: null,
    isPending: true
  });

  useEffect(() => {
    let mounted = true;
    asyncFunction(...optionalParams)
      .then(
        (value) => {
          if (mounted) {
            setState({
              value,
              error: null,
              isPending: false
            });
          }
        }
      )
      .catch(
        (err) => {
          const { response: { status, data: message } } = err;
          if (mounted) {
            setState({
              value: defaultValue,
              error: `${message} (${status})`,
              isPending: false
            });
          }
        }
      );
    return (() => {
      mounted = false;
    });
  }, []);

  const { value, error, isPending } = state;
  return [value, error, isPending];
}

export default useAsyncFunction;
