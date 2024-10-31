import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase/firebaseConfig';
import { useState } from 'react';
import styles from './SignUp.module.css';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        email: email,
        nickname: nickname
      });
      alert('회원가입이 성공적으로 완료되었습니다!');
      navigate('/');
    } catch (error) {
      if (error instanceof Error) {
        console.log('Error signing up:', error);
        setError(error.message);
      } else {
        console.log('Unknown error:', error);
        setError('Unknown error');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    else if (name === 'nickname') setNickname(value);
    else if (name === 'password') setPassword(value);
    else if (name === 'confirmPassword') setConfirmPassword(value);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className={styles.signUpForm}>
        <label htmlFor="email">이메일 : </label>
        <input
          id="email"
          name="email"
          type="text"
          placeholder="이메일을 입력하세요"
          required
          value={email}
          onChange={handleChange}
        />
        <label htmlFor="email">닉네임 : </label>
        <input
          id="nickname"
          name="nickname"
          type="text"
          placeholder="닉네임을 입력하세요"
          required
          value={nickname}
          onChange={handleChange}
        />
        <label htmlFor="password"> 비밀번호 : </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="비밀번호를 입력하세요"
          required
          value={password}
          onChange={handleChange}
        />
        <label htmlFor="confirmPassword"> 비밀번호 확인 : </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="비밀번호를 다시 입력하세요"
          required
          value={confirmPassword}
          onChange={handleChange}
        />
        {error && <p className={styles.errorMessage}>{error}</p>}
        <button>회원가입</button>
      </form>
    </div>
  );
};

export default SignUp;
