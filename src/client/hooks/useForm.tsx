import { useState, useCallback } from 'react';


const useForm = <T,>(initialFormStateObj: T) => {
  const [values, setValues] = useState(initialFormStateObj);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    event.persist();
    setValues((vals) => ({
      ...vals,
      [event.target.name]: event.target.value,
    }));
  };

  const changeRating = (rating: string) => {
    setValues((vals) => ({
      ...vals,
      rating
    }));
  }

  const changeAvgRating = (avgRating: string) => {
    setValues((vals) => ({
      ...vals,
      avgRating
    }))
  }

  const reset = () => {
    setValues(initialFormStateObj);
  };

  const set = useCallback((newInit) => {
    setValues((vals) => {
      return ({
        ...vals,
        ...newInit
      })
    });
  }, []);

  return {
    handleChange,
    changeRating,
    changeAvgRating,
    values,
    reset,
    set
  };
};

export default useForm;
