import { useState, useCallback } from 'react';

const useForm = (initialFormStateObj) => {
  const [values, setValues] = useState(initialFormStateObj || {});

  const handleChange = (event) => {
    event.persist();
    setValues((vals) => ({
      ...vals,
      [event.target.name]: event.target.value,
    }));
  };

  const reset = () => {
    setValues(initialFormStateObj || {});
  };

  const set = useCallback((newInit) => {
    setValues(newInit);
  }, []);

  return {
    handleChange,
    values,
    reset,
    set
  };
};

export default useForm;
