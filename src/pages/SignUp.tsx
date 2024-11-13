import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase/firebaseConfig';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where
} from 'firebase/firestore';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isNicknameTaken, setIsNicknameTaken] = useState(false);
  const navigate = useNavigate();

  const checkDuplicateNickname = async (nickname: string) => {
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection, where('nickname', '==', nickname));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  };

  useEffect(() => {
    const checkNickname = async () => {
      if (nickname) {
        const isTaken = await checkDuplicateNickname(nickname);
        setIsNicknameTaken(isTaken);
        setError(
          isTaken
            ? '이미 사용중인 닉네임입니다. 다른 닉네임을 선택해주세요.'
            : null
        );
      } else {
        setIsNicknameTaken(false);
        setError(null);
      }
    };

    checkNickname();
  }, [nickname]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isNicknameTaken) {
      return;
    }

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
        email,
        nickname
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
    <div className="flex justify-center h-screen">
      <form onSubmit={handleSubmit} className="w-full p-8">
        <div className="mb-4">
          <label htmlFor="email">이메일</label>
          <input
            id="email"
            name="email"
            type="text"
            placeholder="이메일을 입력하세요"
            required
            value={email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="nickname">닉네임</label>
          <input
            id="nickname"
            name="nickname"
            type="text"
            placeholder="닉네임을 입력하세요"
            required
            value={nickname}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        {isNicknameTaken && <p className="text-red-500">{error}</p>}
        <div className="mb-4">
          <label htmlFor="password"> 비밀번호</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="비밀번호를 입력하세요"
            required
            value={password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword"> 비밀번호 확인</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="비밀번호를 다시 입력하세요"
            required
            value={confirmPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        {error && !isNicknameTaken && (
          <p className="text-red-500 mb-4">{error}</p>
        )}
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full px-3 py-2 bg-gray-200 rounded-md hover:bg-gray-200">
            취소
          </button>
          <button
            type="submit"
            className="w-full px-3 py-2 text-white bg-sky-300 rounded-md hover:bg-sky-400">
            회원가입
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
