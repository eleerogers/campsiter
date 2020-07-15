import { useState, useEffect } from 'react';

function useSort(sortStyle, initArr = []) {
  const [itemsArr, setItemsArr] = useState([]);

  useEffect(() => {
    console.log('useSort useEffect')
    if (sortStyle === 'alpha') {
      const sortedArr = initArr.slice().sort((a, b) => {
        const textA = a.name.toUpperCase();
        const textB = b.name.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      setItemsArr([...sortedArr]);
    }
    if (sortStyle === 'rating') {
      console.log('inside rating block');
      const sortedArr = initArr.slice().sort((a, b) => {
        const ratingA = Number(a.rating);
        const ratingB = Number(b.rating);
        return (ratingA > ratingB) ? -1 : (ratingA < ratingB) ? 1 : 0;
      });
      console.log(sortedArr);
      setItemsArr([...sortedArr]);
    }
    if (sortStyle === 'recent') {
      setItemsArr([...initArr]);
    }
  }, [sortStyle, initArr]);

  return itemsArr;
}

export default useSort;
