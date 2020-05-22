import { useState } from 'react';

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

  return {
    handleChange,
    values,
    reset
  };
};

export default useForm;
