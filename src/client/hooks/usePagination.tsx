import { useState } from 'react';
import { ICampground } from '../interfaces';

function usePagination(data: ICampground[], itemsPerPage: number, jumbotronHeight: number) {
  const [currentPage, setCurrentPage] = useState(1);
  const maxPage = Math.ceil(data.length / itemsPerPage);

  function currentData() {
    const begin = (currentPage - 1) * itemsPerPage;
    const end = begin + itemsPerPage;
    return data.slice(begin, end);
  }

  function next() {
    setCurrentPage((currPage) => Math.min(currPage + 1, maxPage));
    window.scrollTo(0, 100);
  }

  function prev() {
    setCurrentPage((currPage) => Math.max(currPage - 1, 1));
    window.scrollTo(0, 100);
  }

  function jump(page: number) {
    const pageNumber = Math.max(1, page);
    setCurrentPage(Math.min(pageNumber, maxPage));

    const jumboHtMinusNavHt = jumbotronHeight - 84;
    const jumboHtPlusNav = jumbotronHeight + 140;

    if (window.innerWidth < 576 
      && window.pageYOffset > jumboHtMinusNavHt) {
      window.scrollTo(0, jumboHtMinusNavHt);
    } else if (window.pageYOffset > jumboHtPlusNav) {
      window.scrollTo(0, jumboHtPlusNav);
    }
  }

  return {
    next, prev, jump, currentData, currentPage, maxPage
  };
}

export default usePagination;
