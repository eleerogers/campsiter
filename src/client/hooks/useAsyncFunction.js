import { useState, useEffect } from 'react';

function useAsyncFunction(asyncFunction, defaultValue, optionalParam) {
  const [state, setState] = useState({
    value: defaultValue,
    error: null,
    isPending: true
  });

  useEffect(() => {
    console.log('useAsync state', state);
  }, [state]);

  useEffect(() => {
    let mounted = true;
    asyncFunction(optionalParam)
      .then(
        (value) => {
          console.log({value});
          console.log({optionalParam});
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
  }, [asyncFunction, defaultValue, optionalParam]);

  const { value, error, isPending } = state;
  return [value, error, isPending];
}

export default useAsyncFunction;
