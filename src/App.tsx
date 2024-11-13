import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import PostForm from './pages/PostForm';
import ReviewAndTips from './pages/ReviewAndTips';
import DakkuGallery from './pages/DakkuGallery';
import DakkuQnA from './pages/DakkuQnA';
import PostDetail from './pages/PostDetail';
import CreateNickname from './pages/CreateNickname';
import OAuthCallback from './pages/OAuthCallback';

import './css/tailwind.css';
import './css/custom.css';
import SearchResults from './pages/SearchResults';
import Board from './components/Board';
// import { updateAllPostsFormat } from './firebase/firestoreService';

function App() {
  // const location = useLocation();

  // useEffect(() => {
  //   const boardName = location.pathname.split('/')[1];

  //   if (boardName) {
  //     const updatePosts = async () => {
  //       try {
  //         await updateAllPostsFormat(boardName);
  //         console.log(
  //           `${boardName} 게시판의 모든 게시글 형식이 업데이트되었습니다.`
  //         );
  //       } catch (error) {
  //         console.error('게시글 형식 업데이트 중 오류 발생:', error);
  //       }
  //     };

  //     updatePosts();
  //   }
  // }, [location]);

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 lg:px-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/create-nickname" element={<CreateNickname />} />
          <Route path="/auth/kakao/callback" element={<OAuthCallback />} />
          <Route path="/:boardName" element={<ReviewAndTips />} />
          <Route path="/:boardName" element={<DakkuGallery />} />
          <Route path="/:boardName" element={<DakkuQnA />} />
          <Route path=":boardName/newPost" element={<PostForm />} />
          <Route path=":boardName/post/:postId" element={<PostDetail />} />
          <Route path=":boardName/editPost/:postId" element={<PostForm />} />
          <Route path="/search" element={<SearchResults />} />

          {/* <Route path="/:boardName" element={<Board />}>
            <Route index element={<ReviewAndTips />} />
            <Route path="dakkuGallery" element={<DakkuGallery />} />
            <Route path="dakkuQnA" element={<DakkuQnA />} />
          </Route>
          <Route path="/:boardName/newPost" element={<PostForm />} />
          <Route path="/:boardName/editPost/:postId" element={<PostForm />} />
          <Route path="/:boardName/post/:postId" element={<PostDetail />} />
          <Route path="/search" element={<SearchResults />} /> */}
        </Routes>
      </main>
    </div>
  );
}

export default App;
