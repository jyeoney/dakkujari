import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useContext, useEffect, useState } from 'react';
import { Post, getPost } from '../firebase/firestoreService';
import Pagination from './Pagination';

const Board = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const [posts, setPosts] = useState<Post[]>([]);
  const { boardName } = useParams<{ boardName: string }>();

  const [currentPage, setCurrentPage] = useState(1);
  const postPerPage = 5;

  if (!authContext) {
    return null;
  }

  const { isSignIn } = authContext;

  useEffect(() => {
    const fetchPosts = async () => {
      if (boardName) {
        const fetchedPost = (await getPost(boardName)) as Post[];

        // const testPosts = Array.from({ length: 50 }, (_, i) => ({
        //   id: `test-${i + 1}`,
        //   title: `테스트 제목${i + 1}`,
        //   content: `테스트 내용${i + 1}`,
        //   nickname: `작성자 ${i + 1}`,
        //   category: '카테고리',
        //   purpose: '목적',
        //   createdAt: new Date()
        // }));
        setPosts(fetchedPost);
        // setPosts([...fetchedPost, ...testPosts]);
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
    navigate(`/${boardName}/post/${postId}`);
  };

  return (
    <div>
      {!location.pathname.includes('newPost') && (
        <button onClick={handleNewPostClick}>글 쓰기</button>
      )}
      {currentPosts.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>제목</th>
              <th>작성자</th>
              <th>작성 시간</th>
            </tr>
          </thead>
          <tbody>
            {currentPosts.map(post => (
              <tr key={post.id} onClick={() => handlePostClick(post.id)}>
                <td>{post.title}</td>
                <td>{post.nickname}</td>
                <td>{post.createdAt.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>게시물이 없습니다.</p>
      )}
      <Outlet />
      <Pagination
        totalPosts={posts.length}
        postPerPage={postPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default Board;
