// import { useState, useEffect, useCallback } from 'react';
// // import { toast } from 'react-toastify';
// import axios from 'axios';
// import useAsyncFunction from './useAsyncFunction';

// const emptyCGObj = {
//   campgrounds: [],
//   user: {
//     first_name: '',
//     last_name: '',
//     image: '',
//     email: ''
//   }
// };

// // retrieves all campground info plus google maps api key
// function getCampgrounds(urlStr) {
//   console.log('getCGs')
//   return axios.get(urlStr)
//     .then(({ status, statusText, data }) => {
//       if (status !== 200) {
//         const error = new Error();
//         error.response = {
//           status,
//           data: statusText
//         };
//         throw error;
//       }
//       return data;
//     });
// }


// function useCampgrounds(userId) {
//   const [url, setUrl] = useState('/api/campgrounds');

//   useEffect(() => {
//     console.log('useCG useEffect')
//     const urlStr = userId ? `/api/campgrounds/user/${userId}` : '/api/campgrounds';
//     setUrl(urlStr);
//   }, [userId]);

//   const memoizedGetCG = useCallback(async () => {
//     await getCampgrounds(url);
//   }, [url]);

//   const [data, error, isPending] = useAsyncFunction(memoizedGetCG, emptyCGObj, url);

//   return { data, error, isPending };
// }

// export default useCampgrounds;
