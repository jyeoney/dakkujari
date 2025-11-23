import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAllPostsBySearchQuery } from '../api/postApi';

interface SearchResult {
  id: string;
  boardName: string;
  title: string;
  content: string;
  nickname: string;
  createdAt: Date;
}
const useSearch = () => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const navigate = useNavigate();
  const location = useLocation();

  const initialQuery = new URLSearchParams(location.search).get('query') || '';
  const initialField =
    new URLSearchParams(location.search).get('field') || 'title';
  const initialStartDate =
    new URLSearchParams(location.search).get('startDate') || '';
  const initialEndDate =
    new URLSearchParams(location.search).get('endDate') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchField, setSearchField] = useState(initialField);
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);

  useEffect(() => {
    setSearchQuery(initialQuery);
    setSearchField(initialField);
    setStartDate(initialStartDate);
    setEndDate(initialEndDate);
  }, [initialQuery, initialField, initialStartDate, initialEndDate]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery) {
        let results = await getAllPostsBySearchQuery(searchQuery, searchField);

        if (startDate && endDate) {
          const start = new Date(startDate);
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);

          results = results.filter(post => {
            const postDate = new Date(post.createdAt);
            return postDate >= start && postDate <= end;
          });
        }
        setSearchResults(results);
      }
    };
    fetchSearchResults();
  }, [searchQuery, searchField, startDate, endDate]);

  const handleSearch = async () => {
    const queryParams = new URLSearchParams();
    if (searchQuery.trim()) {
      queryParams.append('query', searchQuery);
    }
    if (searchField !== 'title') {
      queryParams.append('field', searchField);
    }
    if (startDate) {
      queryParams.append('startDate', startDate);
    }
    if (endDate) {
      queryParams.append('endDate', endDate);
    }
    navigate(`/search?${queryParams.toString()}`);
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = searchResults.slice(indexOfFirstPost, indexOfLastPost);

  return {
    searchQuery,
    setSearchQuery,
    searchField,
    setSearchField,
    searchResults,
    currentPosts,
    handleSearch,
    currentPage,
    setCurrentPage,
    startDate,
    setStartDate,
    endDate,
    setEndDate
  };
};

export default useSearch;
