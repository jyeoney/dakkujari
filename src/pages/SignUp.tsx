import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where
} from 'firebase/firestore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z
  .object({
    email: z
      .email('이메일 형식이 올바르지 않습니다.')
      .min(1, '이메일을 입력해주세요.'),
    nickname: z.string().min(1, '닉네임을 입력해주세요.'),
    password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다.'),
    confirmPassword: z.string().min(1, '비밀번호 확인을 입력해주세요.')
  })
  .refine(data => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword']
  });

const SignUp = () => {
  const navigate = useNavigate();

  /** 닉네임 중복 체크 */
  const checkDuplicateNickname = async (nickname: string) => {
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection, where('nickname', '==', nickname));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  };

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors }
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: 'onBlur'
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const { user } = userCredential;

      await setDoc(doc(db, 'users', user.uid), {
        email: data.email,
        nickname: data.nickname
      });
      alert('회원가입이 성공적으로 완료되었습니다!');
      navigate('/');
    } catch (error) {
      if (error instanceof Error) {
        setError('root', {
          message: error.message,
          type: 'manual'
        });
      } else {
        setError('root', {
          message: '알 수 없는 오류가 발생했습니다.',
          type: 'manual'
        });
      }
    }
  };

  return (
    <div className="flex flex-col md:space-y-8 md:p-16 justify-center">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full p-8">
        <div className="mb-4">
          <label htmlFor="email">이메일</label>
          <input
            id="email"
            {...register('email')}
            type="text"
            placeholder="이메일을 입력하세요"
            className="w-full px-3 py-2 border rounded"
          />
          {errors.email && (
            <p className="text-red-500">{errors.email?.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="nickname">닉네임</label>
          <input
            id="nickname"
            {...register('nickname', {
              validate: async value => {
                if (!value) return true;
                const isTaken = await checkDuplicateNickname(value);
                return (
                  !isTaken ||
                  '이미 사용중인 닉네임입니다. 다른 닉네임을 선택해주세요.'
                );
              }
            })}
            type="text"
            placeholder="닉네임을 입력하세요"
            className="w-full px-3 py-2 border rounded"
          />
          {errors.nickname && (
            <p className="text-red-500">{errors.nickname?.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="password"> 비밀번호</label>
          <input
            id="password"
            {...register('password')}
            type="password"
            placeholder="비밀번호를 입력하세요"
            className="w-full px-3 py-2 border rounded"
          />
          {errors.password && (
            <p className="text-red-500">{errors.password?.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword"> 비밀번호 확인</label>
          <input
            id="confirmPassword"
            {...register('confirmPassword')}
            type="password"
            placeholder="비밀번호를 다시 입력하세요"
            className="w-full px-3 py-2 border rounded"
          />
          {errors.confirmPassword && (
            <p className="text-red-500">{errors.confirmPassword?.message}</p>
          )}
        </div>
        {errors.root && <p className="text-red-500">{errors.root.message}</p>}
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
