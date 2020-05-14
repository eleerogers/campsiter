import { useState } from 'react';

const useForm = (callback, initialFormStateObj) => {
  const [values, setValues] = useState(initialFormStateObj || {});

  const handleChange = (event) => {
    event.persist();
    setValues((vals) => ({
      ...vals,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = (event) => {
    if (event) event.preventDefault();
    callback();
    setValues({});
  };

  return {
    handleChange,
    handleSubmit,
    values,
  };
};

export default useForm;
