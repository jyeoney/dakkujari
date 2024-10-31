import React from 'react';
import styles from './Pagination.module.css';
import cx from 'clsx';

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
      className={cx(styles.pageButton, { [styles.active]: isActive })}>
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
    <div className={styles.paginationContainer}>
      <button
        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}>
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
        onClick={() => setCurrentPage(Math.max(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}>
        {' Next >'}
      </button>
    </div>
  );
};

export default Pagination;
