import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { useEffect } from 'react';

const Header = () => {
  const { user, nickname } = useAuth();
  const location = useLocation();

  const handleSignOut = () => {
    signOut(auth);
  };

  const isCurrentPage = (boardPath: string) =>
    location.pathname.includes(boardPath);

  return (
    <header className="w-full bg-sky-100 shadow">
      <div className="container mx-auto flex items-center justify-between px-16 py-4">
        <Link to="/" className="text-xl font-bold">
          {'다꾸자리'}
        </Link>
        <div className="flex space-x-4">
          {user ? (
            <div className="flex flex-col items-end text-sm space-y-1">
              <p>
                <span className="font-semibold text-sky-300">{nickname}</span>
                님, 반갑습니다!
              </p>

              <button
                onClick={handleSignOut}
                className="px-3 py-1 bg-gray-200 rounded-md hover:bg-sky-300 hover:text-white transition">
                로그아웃
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-end space-y-1">
              <Link to="/sign-up">
                <button className="px-3 py-1 text-sm bg-gray-200 rounded-md hover:bg-sky-300 hover:text-white transition">
                  회원가입
                </button>
              </Link>
              <Link to="/sign-in">
                <button className="px-3 py-1 text-sm bg-gray-200 rounded-md hover:bg-sky-300 hover:text-white transition">
                  로그인
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
      <nav className="container mx-auto flex justify-center space-x-4 py-2">
        <Link
          className={`px-4 py-2 rounded-lg hover:bg-sky-300 hover:text-white transition ${
            isCurrentPage('/reviewAndTips') && 'bg-sky-300 text-white'
          }`}
          to="/reviewAndTips">
          리뷰/팁 게시판
        </Link>
        <Link
          className={`px-4 py-2 rounded-lg  hover:bg-sky-300 hover:text-white transition ${
            isCurrentPage('/dakkuGallery') && 'bg-sky-300 text-white'
          }`}
          to="/dakkuGallery">
          다꾸자랑 게시판
        </Link>
        <Link
          className={`px-4 py-2 rounded-lg hover:bg-sky-300 hover:text-white transition ${
            isCurrentPage('/dakkuQnA') && 'bg-sky-300 text-white'
          }`}
          to="/dakkuQnA">
          다꾸 Q&A 게시판
        </Link>
      </nav>
    </header>
  );
};

export default Header;
