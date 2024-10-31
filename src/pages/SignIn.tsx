import { useState } from 'react';
import styles from './SignIn.module.css';
import { auth } from '../firebase/firebaseConfig';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const { setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log('User signed in:', userCredential);
      setUser(userCredential.user);
      navigate('/');
    } catch (error) {
      if (error instanceof Error) {
        console.log('Error signing up:', error.message);
        setError(
          '이메일 혹은 비밀번호가 일치하지 않습니다. 입력한 내용을 다시 확인해주세요.'
        );
      }
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    else if (name === 'password') setPassword(value);
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log(result.user);
      setUser(result.user);
      navigate('/');
    } catch (error) {
      if (error instanceof Error) {
        console.log('Error signing in with Google:', error.message);
        setError('구글 로그인에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          type="text"
          placeholder="이메일을 입력하세요"
          required
          value={email}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="비밀번호를 입력하세요"
          required
          value={password}
          onChange={handleChange}
        />
        <button type="submit">로그인</button>
      </form>
      {error && <p className={styles.errorMessage}>{error}</p>}
      <div>
        <button name="Google" onClick={signInWithGoogle}>
          Google 로그인
        </button>
        <button name="Google">Kakao 로그인</button>
      </div>
    </div>
  );
};

export default SignIn;
