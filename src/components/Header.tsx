import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

const Header = () => {
  const { user, nickname } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut(auth);
  };

  const handleDeleteAccount = async () => {
    const isConfirmed = window.confirm('정말 탈퇴하시겠습니까?');
    if (isConfirmed) {
      try {
        await user?.delete();
        alert('회원 탈퇴가 완료되었습니다.');
        navigate('/');
      } catch (error) {
        alert('회원 탈퇴에 실패했습니다. 다시 시도해주세요');
      }
    }
  };

  const isCurrentPage = (boardPath: string) =>
    location.pathname.includes(boardPath);

  return (
    <header className="w-full bg-sky-100 shadow">
      <div className="container mx-auto flex items-center justify-between px-16 lg:px-32 py-4">
        <Link to="/" className="text-xl font-bold">
          {'다꾸자리'}
          <p className="text-sm font-normal">
            <span className="text-blue-400 font-bold">다</span>이어리를{' '}
            <span className="text-blue-400 font-bold">꾸</span>미고{' '}
            <span className="text-blue-400 font-bold">자</span>랑하고{' '}
            <span className="text-blue-400 font-bold">리</span>뷰하고!
          </p>
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
              <button
                className="px-3 py-1 bg-gray-200 rounded-md hover:bg-sky-300 hover:text-white transition"
                onClick={handleDeleteAccount}>
                회원 탈퇴
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-end space-y-1">
              <Link to="/sign-in">
                <button className="px-3 py-1 text-sm bg-gray-200 rounded-md hover:bg-sky-300 hover:text-white transition">
                  로그인
                </button>
              </Link>
              <Link to="/sign-up">
                <button className="px-3 py-1 text-sm bg-gray-200 rounded-md hover:bg-sky-300 hover:text-white transition">
                  회원가입
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
