import { useState, useEffect } from 'react';
import { ICampground } from '../interfaces';

function useSearchFilter(search: string, initArr: ICampground[] = []) {
  const [itemsArr, setItemsArr] = useState<ICampground[]>([]);

  useEffect(() => {
    const searchLC = search.toLowerCase();
    const filteredItems = initArr.filter((item) => {
      const itemNamePropertyLC = item.name.toLowerCase();
      const itemDescriptionLC = item.description.toLowerCase();
      return (search === ''
      || itemNamePropertyLC.indexOf(searchLC) !== -1
      || itemDescriptionLC.indexOf(searchLC)) !== -1;
    });
    setItemsArr([]);
    setItemsArr(filteredItems);
  }, [search, initArr]);

  return itemsArr;
}

export default useSearchFilter;
