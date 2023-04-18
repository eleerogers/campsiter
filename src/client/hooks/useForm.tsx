import { useState, useCallback } from 'react';


interface IInitialFormStateObj {
  email?: string;
  comment?: string;
}

const useForm = (initialFormStateObj: IInitialFormStateObj) => {
  const [values, setValues] = useState(initialFormStateObj);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    event.persist();
    setValues((vals) => ({
      ...vals,
      [event.target.name]: event.target.value,
    }));
  };

  const changeRating = (rating: number) => {
    setValues((vals) => ({
      ...vals,
      rating
    }));
  }

  const changeAvgRating = (avgRating: number) => {
    setValues((vals) => ({
      ...vals,
      avgRating
    }))
  }

  const reset = () => {
    setValues(initialFormStateObj || {});
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
