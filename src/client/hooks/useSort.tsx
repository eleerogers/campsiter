import { useState, useEffect } from 'react';
import { ICampground } from '../interfaces';

function useSort(sortStyle: string | null, initArr: ICampground[] = []) {
  const [itemsArr, setItemsArr] = useState<ICampground[]>([]);

  useEffect(() => {
    if (sortStyle === 'Name') {
      const sortedArr = initArr.slice().sort((a, b) => {
        const textA = a.name.toUpperCase();
        const textB = b.name.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      setItemsArr([...sortedArr]);
    }
    if (sortStyle === 'Rating') {
      const sortedArr = initArr.slice().sort((a, b) => {
        const ratingA = Number(a.rating);
        const ratingB = Number(b.rating);
        return (ratingA > ratingB) ? -1 : (ratingA < ratingB) ? 1 : 0;
      });
      setItemsArr([...sortedArr]);
    }
    if (sortStyle === 'Recent') {
      setItemsArr([...initArr]);
    }
  }, [sortStyle, initArr]);

  return itemsArr;
}

export default useSort;
