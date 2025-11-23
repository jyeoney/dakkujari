import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { fetchKakaoAccessToken, fetchKakaoUser } from '../api/authApi';

const OAuthCallback = () => {
  const { setUser, setNickname } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authorizationCode = urlParams.get('code');

    if (authorizationCode) {
      const handleOAuth = async () => {
        try {
          const accessToken = await fetchKakaoAccessToken(authorizationCode);
          const data = await fetchKakaoUser(accessToken);

          console.log('Kakao User Data:', data);

          const nickname =
            data.kakao_account?.profile?.profile_nickname || '사용자';
          setUser(data);
          setNickname(nickname);
          navigate('/');
        } catch (error) {
          console.error('카카오 로그인 에러:', error);
          navigate('/sign-in');
        }
      };
      handleOAuth();
    }
  }, [navigate, setUser, setNickname]);

  return <div>로그인 중...</div>;
};

export default OAuthCallback;
