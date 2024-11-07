import React from 'react';

interface PaginationProps {
  totalPosts: number;
  postPerPage: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

interface PageButtonProps {
  number: number;
  onClick: (page: number) => void;
  isActive: boolean;
}

const PageButton: React.FC<PageButtonProps> = ({
  number,
  onClick,
  isActive
}) => {
  return (
    <button
      onClick={() => onClick(number)}
      className={`m-0 mx-1.5 px-2.5 py-1 border-none cursor-pointer ${
        isActive ? 'bg-sky-300 text-white' : 'hover:bg-gray-200'
      }`}>
      {number}
    </button>
  );
};

const Pagination: React.FC<PaginationProps> = ({
  totalPosts,
  postPerPage,
  currentPage,
  setCurrentPage
}) => {
  const totalPages = Math.ceil(totalPosts / postPerPage);

  return (
    <div>
      {totalPosts > 0 && (
        <>
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded-lg cursor-pointer
            disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed">
            {'< Previous'}
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <PageButton
              key={i + 1}
              number={i + 1}
              onClick={setCurrentPage}
              isActive={currentPage === i + 1}
            />
          ))}
          <button
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={totalPosts === 0 || currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded-lg cursor-pointer
            disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed">
            {' Next >'}
          </button>
        </>
      )}
    </div>
  );
};

export default Pagination;
