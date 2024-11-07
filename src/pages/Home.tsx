import { useEffect, useState } from 'react';
import {
  getAllPostsBySearchQuery,
  getTopPosts
} from '../firebase/firestoreService';
import { useNavigate } from 'react-router-dom';
import { VscHeartFilled } from 'react-icons/vsc';
import { BOARD_CONFIG } from '../constant/boardConfig';

interface SearchResult {
  id: string;
  boardName: string;
  title: string;
  content: string;
  nickname: string;
  createdAt: Date;
}
const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchField, setSearchField] = useState('title');
  const [hasSearched, setHasSearched] = useState(false);

  const [topPosts, setTopPosts] = useState<{ board: string; posts: any[] }[]>(
    []
  );
  const boardNames = Object.keys(BOARD_CONFIG) as Array<
    keyof typeof BOARD_CONFIG
  >;

  const navigate = useNavigate();
  useEffect(() => {
    const fetchTopPosts = async () => {
      const allTopPosts = await Promise.all(
        boardNames.map(async board => {
          const posts = await getTopPosts(board);
          return { board, posts };
        })
      );
      setTopPosts(allTopPosts);
    };

    fetchTopPosts();
  }, []);

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      const results = await getAllPostsBySearchQuery(searchQuery, searchField);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
    setHasSearched(true);
  };

  const handleClickPost = (boardName: string, postId: string) => {
    navigate(`/${boardName}/post/${postId}`);
  };

  return (
    <div className="flex space-x-8 p-16">
      <section className="w-1/2">
        <h2 className="text-xl font-bold mb-4">
          <span className="text-sky-300">HOT</span> 게시물
        </h2>
        {topPosts.length > 0 ? (
          <ul>
            {topPosts.map(boardTopPosts => (
              <div key={boardTopPosts.board} className="mb-6">
                <h3 className="text-lg font-semibold mb-2">
                  {
                    BOARD_CONFIG[
                      boardTopPosts.board as keyof typeof BOARD_CONFIG
                    ]
                  }
                </h3>
                <ul>
                  {boardTopPosts.posts.map(post => (
                    <li
                      key={post.id}
                      onClick={() =>
                        handleClickPost(boardTopPosts.board, post.id)
                      }
                      className="list-none p-4 border rounded-lg shadow cursor-pointer hover:bg-gray-100 flex item-start">
                      <div className="flex-grow">
                        <h4 className="font-semibold">{post.title}</h4>
                        <div className="flex items-center space-x-2 mt-2">
                          <span>{post.nickname}</span>
                          <div className="flex items-center space-x-1">
                            <VscHeartFilled />
                            <span>{post.likeCount}</span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {post.createdAt.toLocaleString('ko-KR', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit'
                            })}
                          </span>
                        </div>
                        {/* {post.imageUrl && (
                          <div className="w-16 h-16 ml-4 overflow-hidden rounded">
                            <img
                              src={post.imageUrl}
                              alt="게시물 이미지"
                              className="object-cover w-full h-full"
                            /> 
                          </div>
                        )} */}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </ul>
        ) : (
          <p>
            지금 바로 게시판에 글을 업로드하여 HOT 게시물의 주인공이 되어보세요!
          </p>
        )}
      </section>
      <section className="w-1/2">
        <div className="mb-4">
          <select
            value={searchField}
            onChange={e => setSearchField(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg mb-2">
            <option value="title">제목</option>
            <option value="content">내용</option>
            <option value="nickname">작성자</option>
          </select>
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg mb-2"
          />
          <button
            onClick={handleSearch}
            className="w-full bg-sky-300 text-white p-2 rounded-lg">
            검색
          </button>
          <div className="mt-4">
            {hasSearched && searchResults.length === 0 ? (
              <p>검색 결과가 없습니다.</p>
            ) : (
              hasSearched &&
              searchResults.length > 0 && (
                <table className="w-full text-center mb-4">
                  <thead>
                    <tr className=" border-b">
                      <th className="py-2">게시판</th>
                      <th className="py-2">제목</th>
                      <th className="py-2">작성자</th>
                      <th className="py-2">작성 시간</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.map(result => (
                      <tr
                        key={result.id}
                        onClick={() =>
                          handleClickPost(result.boardName, result.id)
                        }
                        className="hover:bg-gray-100 cursor-pointer">
                        <td className="p-2 border-x-0">
                          {
                            BOARD_CONFIG[
                              result.boardName as keyof typeof BOARD_CONFIG
                            ]
                          }
                        </td>
                        <td className="p-2 border-x-0">{result.title}</td>
                        <td className="p-2 border-x-0">{result.nickname}</td>
                        <td className="p-2 border-x-0">
                          {result.createdAt.toLocaleString('ko-KR', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour12: true
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
