import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

const CreateNickname = () => {
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleNicknameSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, 'users', user.uid), {
          nickname,
          email: user.email
        });
        navigate('/');
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };

  return (
    <div>
      <h2>닉네임 설정</h2>
      <form onSubmit={handleNicknameSubmit}>
        <label>
          닉네임:
          <input
            type="text"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            placeholder="닉네임을 입력하세요"
            required
          />
        </label>

        <button type="submit">닉네임 설정</button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default CreateNickname;
