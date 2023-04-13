import { useState, useEffect } from 'react';
import { CampgroundInterface } from '../interfaces';

function useSort(sortStyle: string, initArr: CampgroundInterface[] = []) {
  const [itemsArr, setItemsArr] = useState<CampgroundInterface[]>([]);

  useEffect(() => {
    if (sortStyle === 'alpha') {
      const sortedArr = initArr.slice().sort((a, b) => {
        const textA = a.name.toUpperCase();
        const textB = b.name.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      setItemsArr([...sortedArr]);
    }
    if (sortStyle === 'rating') {
      const sortedArr = initArr.slice().sort((a, b) => {
        const ratingA = Number(a.rating);
        const ratingB = Number(b.rating);
        return (ratingA > ratingB) ? -1 : (ratingA < ratingB) ? 1 : 0;
      });
      setItemsArr([...sortedArr]);
    }
    if (sortStyle === 'recent') {
      setItemsArr([...initArr]);
    }
  }, [sortStyle, initArr]);

  return itemsArr;
}

export default useSort;
