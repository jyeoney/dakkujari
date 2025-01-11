import { useEffect, useState } from 'react';
import { getTopPosts } from '../firebase/firestoreService';
import { useNavigate } from 'react-router-dom';
import { VscHeartFilled } from 'react-icons/vsc';
import { BOARD_CONFIG } from '../constant/boardConfig';
import useSearch from '../hooks/useSearch';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const {
    searchQuery,
    setSearchQuery,
    searchField,
    setSearchField,
    handleSearch,
    startDate,
    setStartDate,
    endDate,
    setEndDate
  } = useSearch();

  const [topPosts, setTopPosts] = useState<{ board: string; posts: any[] }[]>(
    []
  );
  const boardNames = Object.keys(BOARD_CONFIG) as Array<
    keyof typeof BOARD_CONFIG
  >;
  const navigate = useNavigate();
  const { isSignIn } = useAuth();

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

  const handleClickPost = (boardName: string, postId: string) => {
    navigate(`/${boardName}/post/${postId}`);
  };

  const handleNewPostClick = (boardName: string) => {
    if (isSignIn) {
      navigate(`/${boardName}/newPost`);
    } else {
      alert('글쓰기는 로그인 후 이용 가능합니다.');
    }
  };

  return (
    <div className="flex flex-col space-y-8 lg:space-y-0 p-16 xl:px-28">
      <section className="w-full">
        <div className="flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0">
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg"
          />
          <span className="text-center md:text-left">-</span>
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="mt-4">
          <div className="flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0">
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
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              className="w-full md:flex-1 p-2 border border-gray-300 rounded-lg mb-2 md:mb-0"
            />

            <button
              onClick={handleSearch}
              className="w-full md:w-auto bg-sky-300 text-white p-2 rounded-lg">
              검색
            </button>
          </div>
        </div>
      </section>

      <section className="w-full">
        <h2 className="text-xl font-bold my-4">
          <span className="text-sky-300">HOT</span> 게시물
        </h2>
        {topPosts.map(boardTopPosts => (
          <div key={boardTopPosts.board} className="mb-6 ml-4">
            <h3 className="text-lg font-semibold mb-2">
              {BOARD_CONFIG[boardTopPosts.board as keyof typeof BOARD_CONFIG]}
            </h3>
            {boardTopPosts.posts.length > 0 ? (
              <div className="overflow-x-auto">
                <ul className="flex gap-4 p-2 list-none justify-start xl:mx-28">
                  {boardTopPosts.posts.slice(0, 3).map(post => (
                    <li
                      key={post.id}
                      onClick={() =>
                        handleClickPost(boardTopPosts.board, post.id)
                      }
                      className="w-32 h-32 sm:w-36 md:w-48 md:h-32 lg:w-60 flex-shrink-0 p-4 border rounded-lg shadow cursor-pointer hover:bg-gray-100 flex flex-col justify-between">
                      <h4 className="font-semibold mb-2 line-clamp-2">
                        {post.title}
                      </h4>
                      <div className="flex flex-col items-start space-y-1 text-sm text-gray-500 mt-auto">
                        <span>{post.nickname}</span>
                        <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <VscHeartFilled />
                            <span>{post.likeCount}</span>
                          </div>
                          <span className="ml-2">
                            {post.createdAt.toLocaleString('ko-KR', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div>
                <p>
                  게시판에 글을 업로드하여 HOT 게시물의 주인공이 되어보세요!
                </p>
                <button
                  onClick={() => handleNewPostClick(boardTopPosts.board)}
                  className="mt-2 px-4 py-2 bg-sky-300 text-white rounded-lg">
                  글쓰기
                </button>
              </div>
            )}
          </div>
        ))}
      </section>
    </div>
  );
};

export default Home;
