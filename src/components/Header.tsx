import { Link } from 'react-router-dom';
import styles from './Header.module.css';
import { useAuth } from '../hooks/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

const Header = () => {
  const { user, nickname } = useAuth();

  const handleSignOut = () => {
    signOut(auth);
  };

  return (
    <div className={styles.header}>
      <div>
        <Link to="/">
          <div>{'다꾸자리'}</div>
        </Link>
      </div>
      <div>
        {user ? (
          <>
            <p>{nickname}님, 반갑습니다!</p>
            <button onClick={handleSignOut}>로그아웃</button>
          </>
        ) : (
          <>
            <Link to="/sign-up">
              <button>회원가입</button>
            </Link>
            <Link to="/sign-in">
              <button>로그인</button>
            </Link>
          </>
        )}
      </div>
      <div>
        <Link to="/reviewAndTips">리뷰 & 팁 게시판</Link>
        <Link to="/dakkuGallery">다꾸자랑 게시판</Link>
        <Link to="/dakkuQnA">Q & A 게시판</Link>
      </div>
    </div>
  );
};

export default Header;
