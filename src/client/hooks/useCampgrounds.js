import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function useCampgrounds() {
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
