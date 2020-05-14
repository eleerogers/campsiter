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

  return {
    handleChange,
    values,
  };
};

export default useForm;
