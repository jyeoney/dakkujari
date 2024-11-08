import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const OAuthCallback = () => {
  const { setUser, setNickname } = useAuth();
  const navigate = useNavigate();

  const fetchKakaoUser = async (accessToken: string) => {
    try {
      const response = await fetch('https://kapi.kakao.com/v2/user/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('카카오 API 요청 실패');
      }

      const data = await response.json();
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

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authorizationCode = urlParams.get('code');

    if (authorizationCode) {
      const fetchAccessToken = async () => {
        try {
          const response = await fetch(`https://kauth.kakao.com/oauth/token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
              grant_type: 'authorization_code',
              client_id: import.meta.env.VITE_REST_API_KEY,
              redirect_uri: import.meta.env.VITE_REDIRECT_URI,
              code: authorizationCode
            })
          });

          if (!response.ok) {
            throw new Error('카카오 토큰 요청 실패');
          }

          const tokenData = await response.json();
          const accessToken = tokenData.access_token;
          fetchKakaoUser(accessToken);
        } catch (error) {
          console.error('카카오 토큰 요청 에러:', error);
          navigate('/sign-in');
        }
      };
      fetchAccessToken();
    }
  }, [navigate]);

  return <div>로그인 중...</div>;
};

export default OAuthCallback;
