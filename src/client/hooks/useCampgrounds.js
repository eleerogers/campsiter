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
  console.log({userId});
  const [data, error, isPending] = useAsyncFunction(getCampgrounds, emptyCGObj, userId);
  return { data, error, isPending };

  // const [campgrounds, setCampgrounds] = useState([]);

  // useEffect(() => {
  //   let mounted = true;
  //   async function fetchData() {
  //     try {
  //       const { data: { campgrounds: updatedCampgrounds } } = await axios.get('/api/campgrounds');
  //       if (mounted) {
  //         setCampgrounds(updatedCampgrounds);
  //       }
  //     } catch (err) {
  //       console.error(err);
  //       const { response: { status, data } } = err;
  //       toast.error(`${data} (${status})`);
  //     }
  //   }
  //   if (campgrounds.length === 0) {
  //     fetchData();
  //   }
  //   return (() => { mounted = false; });
  // }, [campgrounds.length]);

  // return campgrounds;
}

export default useCampgrounds;
