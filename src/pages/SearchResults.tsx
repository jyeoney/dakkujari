import { useLocation, useNavigate } from 'react-router-dom';
import Pagination from '../components/Pagination';
import { BOARD_CONFIG } from '../constant/boardConfig';
import useSearch from '../hooks/useSearch';
import { useEffect, useRef } from 'react';

const SearchResults = () => {
  const {
    searchQuery,
    setSearchQuery,
    searchField,
    setSearchField,
    searchResults,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    currentPosts,
    currentPage,
    setCurrentPage
  } = useSearch();

  const navigate = useNavigate();
  const location = useLocation();

  const prevStateDate = useRef(startDate);
  const prevEndDate = useRef(endDate);
  const prevSearchQuery = useRef(searchQuery);
  const prevSearchField = useRef(searchField);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const start = queryParams.get('startDate');
    const end = queryParams.get('endDate');
    const query = queryParams.get('query');
    const field = queryParams.get('field');

    if (start) setStartDate(start);
    if (end) setEndDate(end);
    if (query) setSearchQuery(query);
    if (field) setSearchField(field);
  }, [
    location.search,
    setStartDate,
    setEndDate,
    setSearchQuery,
    setSearchField
  ]);

  useEffect(() => {
    if (
      prevStateDate.current !== startDate ||
      prevEndDate.current !== endDate ||
      prevSearchQuery.current !== searchQuery ||
      prevSearchField.current !== searchField
    ) {
      const queryParams = new URLSearchParams(location.search);

      if (startDate) queryParams.set('startDate', startDate);
      else queryParams.delete('startDate');

      if (endDate) queryParams.set('endDate', endDate);
      else queryParams.delete('endDate');

      if (searchQuery) queryParams.set('query', searchQuery);
      else queryParams.delete('query');

      if (searchField) queryParams.set('field', searchField);
      else queryParams.delete('field');

      navigate(`?${queryParams.toString()}`, { replace: true });

      prevStateDate.current = startDate;
      prevEndDate.current = endDate;
      prevSearchQuery.current = searchQuery;
      prevSearchField.current = searchField;
    }
  }),
    [startDate, endDate, searchQuery, searchField, navigate, location.search];

  const handlePostClick = (boardName: string, postId: string) => {
    navigate(`/${boardName}/post/${postId}`);
  };

  return (
    <div className="container mx-auto p-10">
      <div className="flex space-x-2">
        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg"
        />
        <span>-</span>
        <input
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg"
        />
      </div>
      <div className="mt-4">
        <div className="flex flex-col md:flex-row md:space-x-2">
          <select
            value={searchField}
            onChange={e => setSearchField(e.target.value)}
            className="w-full md:w-1/4 p-2 border border-gray-300 rounded-lg mb-2 md:mb-0">
            <option value="title">제목</option>
            <option value="content">내용</option>
            <option value="nickname">작성자</option>
          </select>
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full md:flex-1 p-2 border border-gray-300 rounded-lg mb-2 md:mb-0"
          />
        </div>
      </div>

      {searchResults.length > 0 ? (
        <table className="w-full text-center mb-4">
          <thead className="border-b">
            <tr>
              <th className="py-2">게시판</th>
              <th className="py-2">제목</th>
              <th className="py-2">작성자</th>
              <th className="py-2">작성 시간</th>
            </tr>
          </thead>
          <tbody>
            {currentPosts.map(result => (
              <tr
                key={result.id}
                onClick={() => handlePostClick(result.boardName, result.id)}
                className="cursor-pointer hover:bg-gray-100">
                <td className="py-2">
                  {BOARD_CONFIG[result.boardName as keyof typeof BOARD_CONFIG]}
                </td>
                <td className="py-2 text-left pl-4">{result.title}</td>
                <td className="py-2">{result.nickname}</td>
                <td className="py-2">
                  {result.createdAt.toLocaleString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center mb-4">검색 결과가 없습니다.</p>
      )}

      <div className="flex justify-center mt-4">
        <Pagination
          totalPosts={searchResults.length}
          postPerPage={10}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default SearchResults;
