import { useState } from 'react';
import { auth, db } from '../firebase/firebaseConfig';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { FcGoogle } from 'react-icons/fc';
import { RiKakaoTalkFill } from 'react-icons/ri';

const SignIn = () => {
  const { setUser, setNickname } = useAuth();
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
      const user = result.user;
      console.log(user);

      const userDoc = await getDoc(doc(db, 'users', user.uid));

      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          nickname: user.displayName || '사용자'
        });
      }
      setUser(user);
      setNickname(user.displayName || '사용자');

      navigate('/');
    } catch (error) {
      if (error instanceof Error) {
        console.log('Error signing in with Google:', error.message);
        setError('구글 로그인에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  const signInWithKakao = () => {
    const kakaoLoginUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${import.meta.env.VITE_REST_API_KEY}&redirect_uri=${import.meta.env.VITE_REDIRECT_URI}&response_type=code`;
    window.location.href = kakaoLoginUrl;
  };

  return (
    <div className="flex justify-center h-screen">
      <div className="w-full p-8">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block">
              이메일
            </label>
            <input
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
            <label htmlFor="password" className="block">
              비밀번호
            </label>
            <input
              name="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              required
              value={password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full px-3 py-2 text-white bg-sky-300 rounded-md hover:bg-sky-600">
            로그인
          </button>
        </form>
        {error && <p className="tex-red-500">{error}</p>}
        <div className="mt-4">
          <button
            name="Google"
            className="flex items-center justify-center w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
            onClick={signInWithGoogle}>
            <FcGoogle className="mr-2" size={24} />
            Google 로그인
          </button>
          <button
            name="Kakao"
            className="mt-4 flex items-center justify-center w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
            onClick={signInWithKakao}>
            <RiKakaoTalkFill className="mr-2" size={24} />
            Kakao 로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
