import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Post, getPost } from '../firebase/firestoreService';
import Pagination from './Pagination';
import { useAuth } from '../hooks/useAuth';

const Board = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const { boardName } = useParams<{ boardName: string }>();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const initialPage = queryParams.get('page')
    ? Number(queryParams.get('page')!)
    : 1;
  const [currentPage, setCurrentPage] = useState(initialPage);
  const postPerPage = 10;

  const { isSignIn } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      if (boardName) {
        const fetchedPost = (await getPost(boardName)) as Post[];
        fetchedPost.sort((a, b) => {
          return b.createdAt.getTime() - a.createdAt.getTime();
        });

        setPosts(fetchedPost);
      }
    };
    fetchPosts();
  }, [boardName]);

  const indexOfLastPost = currentPage * postPerPage;
  const indexOfFirstPost = indexOfLastPost - postPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const handleNewPostClick = () => {
    if (isSignIn) {
      navigate(`/${boardName}/newPost`);
    } else {
      alert('글쓰기는 로그인 후 이용 가능합니다.');
    }
  };

  const handlePostClick = (postId: string) => {
    navigate(`/${boardName}/post/${postId}?page=${currentPage}`);
  };

  const updatePage = (page: number) => {
    setCurrentPage(page);
    navigate(`/${boardName}?page=${page}`);
  };

  return (
    <div className="container mx-auto p-10">
      {!location.pathname.includes('newPost') && (
        <div className="flex justify-end mb-4">
          <button
            onClick={handleNewPostClick}
            className="px-4 py-2 bg-sky-300 text-white rounded-lg">
            글쓰기
          </button>
        </div>
      )}
      {currentPosts.length > 0 ? (
        <table className="w-full text-center mb-4">
          <thead className="border-b">
            <tr>
              <th className="py-2">제목</th>
              <th className="py-2">작성자</th>
              <th className="py-2">카테고리</th>
              {currentPosts.some(post => post.purpose) && (
                <th className="py-2">목적</th>
              )}
              <th className="py-2">작성 시간</th>
            </tr>
          </thead>
          <tbody>
            {currentPosts.map(post => (
              <tr
                key={post.id}
                onClick={() => handlePostClick(post.id)}
                className="cursor-pointer hover:bg-gray-100">
                <td className="py-2 text-left pl-4">{post.title}</td>
                <td className="py-2">{post.nickname}</td>
                <td className="py-2">{post.category}</td>
                {post.purpose && <td className="py-2">{post.purpose}</td>}
                <td className="py-2">
                  {post.createdAt.toLocaleString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center mb-4">게시물이 없습니다.</p>
      )}
      <div className="flex justify-center mt-4">
        <Pagination
          totalPosts={posts.length}
          postPerPage={postPerPage}
          currentPage={currentPage}
          setCurrentPage={updatePage}
        />
      </div>

      <Outlet />
    </div>
  );
};

export default Board;
