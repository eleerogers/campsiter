import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
// import useAsyncFunction from './useAsyncFunction';

// const emptyList = [];

// function getCampgrounds() {
//   return axios.get('/api/campgrounds')
//     .then(({ status, statusText, data: { campgrounds } }) => {
//       if (status !== 200) {
//         const error = new Error();
//         error.response = {
//           status,
//           data: statusText
//         };
//         throw error;
//       }
//       return campgrounds;
//     });
// }

function useCampgrounds() {
  // const [campgrounds, error, isPending] = useAsyncFunction(getCampgrounds, emptyList);

  // return { campgrounds, error, isPending };

  const [campgrounds, setCampgrounds] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      try {
        const { data: { campgrounds: updatedCampgrounds } } = await axios.get('/api/campgrounds');
        if (mounted) {
          setCampgrounds(updatedCampgrounds);
        }
      } catch (err) {
        console.error(err);
        const { response: { status, data } } = err;
        toast.error(`${data} (${status})`);
      }
    }
    if (campgrounds.length === 0) {
      fetchData();
    }
    return (() => { mounted = false; });
  }, [campgrounds.length]);

  return campgrounds;
}

export default useCampgrounds;
