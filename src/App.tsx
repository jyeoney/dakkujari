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

function App() {
  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-white">
      <Header />
      <main className="flex-grow container mx-auto px-4">
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
        </Routes>
      </main>
    </div>
  );
}

export default App;
