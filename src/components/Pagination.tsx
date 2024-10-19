import React, { useState } from 'react';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange,
}) => {
  const [page, setPage] = useState(currentPage);

  const handlePrev = () => {
    if (page > 1) {
      const newPage = page - 1;
      setPage(newPage);
      onPageChange(newPage);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      const newPage = page + 1;
      setPage(newPage);
      onPageChange(newPage);
    }
  };

  const handlePageClick = (pageNum: number) => {
    setPage(pageNum);
    onPageChange(pageNum);
  };

  return (
    <div className={'flex justify-center absolute bottom-10 w-full'}>
      <button onClick={handlePrev} disabled={page === 1}>
        Prev
      </button>

      <div className={'flex gap-2 px-3'}>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (pageNum) => (
            <button
              key={pageNum}
              onClick={() => handlePageClick(pageNum)}
              disabled={page === pageNum}
            >
              {pageNum}
            </button>
          )
        )}
      </div>

      <button onClick={handleNext} disabled={page === totalPages}>
        Next
      </button>
    </div>
  );
};

export default Pagination;
