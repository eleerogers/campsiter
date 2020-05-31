import { useState, useCallback } from 'react';

function useSearchFilter(initArr = []) {
  const [itemsArr, setItemsArr] = useState(initArr);

  const filterArr = useCallback((search) => {
    const searchLC = search.toLowerCase();
    setItemsArr((itemsAr) => itemsAr.filter((item) => {
      const itemNamePropertyLC = item.name.toLowerCase();
      return (search === ''
      || itemNamePropertyLC.indexOf(searchLC) !== -1);
    }));
  }, []);

  return [itemsArr, setItemsArr, filterArr];
}

export default useSearchFilter;
