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

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/:boardName" element={<ReviewAndTips />} />
        <Route path="/:boardName" element={<DakkuGallery />} />
        <Route path="/:boardName" element={<DakkuQnA />} />
        <Route path=":boardName/newPost" element={<PostForm />} />
        <Route path=":boardName/post/:postId" element={<PostDetail />} />
        <Route path=":boardName/editPost/:postId" element={<PostForm />} />
      </Routes>
    </>
  );
}

export default App;
