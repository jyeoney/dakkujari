/** 카카오 액세스 토큰 요청 */
export const fetchKakaoAccessToken = async (authorizationCode: string) => {
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
  return tokenData.access_token;
};

/** 카카오 사용자 정보 조회 */
export const fetchKakaoUser = async (accessToken: string) => {
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
  return data;
};
