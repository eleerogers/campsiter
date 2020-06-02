// import { useState, useEffect } from 'react';
// import { toast } from 'react-toastify';
import axios from 'axios';
import useAsyncFunction from './useAsyncFunction';

const emptyCGObj = {
  campgrounds: [],
  user: {
    first_name: '',
    last_name: '',
    image: '',
    email: ''
  }
};

function getCampgrounds(userId) {
  const urlStr = userId ? `/api/campgrounds/user/${userId}` : '/api/campgrounds';
  return axios.get(urlStr)
    .then(({ status, statusText, data }) => {
      if (status !== 200) {
        const error = new Error();
        error.response = {
          status,
          data: statusText
        };
        throw error;
      }
      return data;
    });
}

function useCampgrounds(userId) {
  const [data, error, isPending] = useAsyncFunction(getCampgrounds, emptyCGObj, userId);
  return { data, error, isPending };
}

export default useCampgrounds;
