// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../hooks/useAuth';
// import {
//   User,
//   createUserWithEmailAndPassword,
//   updateProfile
// } from 'firebase/auth';
// import { auth, db } from '../firebase/firebaseConfig';
// import { doc, setDoc } from 'firebase/firestore';

// interface UserInfo {
//   id: number;
//   nickname: string;
//   email: string;
// }

// const OAuthCallback = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const code = params.get('code');

//     const getAccessToken = async () => {
//       const response = await fetch('https://kauth.kakao.com/oauth/token', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded'
//         },
//         body: new URLSearchParams({
//           grant_type: 'authorization_code',
//           client_id: import.meta.env.VITE_REST_API_KEY,
//           redirect_uri: import.meta.env.VITE_REDIRECT_URI,
//           code: code || ''
//         })
//       });
//       if (!response.ok) {
//         throw new Error('Failed to fetch access token');
//       }

//       const data = await response.json();
//       const accessToken = data.access_token;

//       await getUserInfo(accessToken);
//       navigate('/');
//     };

//     const getUserInfo = async (accessToken: string) => {
//       const response = await fetch('https://kapi.kakao.com/v2/user/me', {
//         method: 'GET',
//         headers: {
//           Authorization: `Bearer ${accessToken}`
//         }
//       });
//       if (!response.ok) {
//         throw new Error('Failed to fetch user info');
//       }

//       const data = await response.json();
//       const userInfo = {
//         id: data.id,
//         nickname: data.kakao_account.nickname,
//         email: data.kakao_account.email
//       };

//       console.log('User Info: ', userInfo);
//       await handleFirebaseUser(userInfo);
//     };

//     const handleFirebaseUser = async (userInfo: UserInfo) => {
//       const userDocRef = doc(db, 'users', userInfo.id.toString());
//       await setDoc(userDocRef, {
//         email: userInfo.email,
//         nickname: userInfo.nickname
//       });

//       if (code) {
//         getAccessToken();
//       }
//     };
//   }, [navigate]);

//   // const getUserInfo = async (accessToken: string) => {
//   //   const response = await fetch('https://kapi.kakao.com/v2/user/me', {
//   //     method: 'GET',
//   //     headers: {
//   //       Authorization: `Bearer ${accessToken}`
//   //     }
//   //   });
//   //   if (!response.ok) {
//   //     throw new Error('Failed to fetch user info');
//   //   }

//   //   const data = await response.json();
//   //   console.log('User Info: ', data);

//   //   return {
//   //     id: data.id,
//   //     nickname: data.kakao_account.nickname,
//   //     email: data.kakao_account.email
//   //   };
//   // };

//   // const handleFirebaseUser = async (userInfo: UserInfo) => {
//   //   try {
//   //     const userCredential = await createUserWithEmailAndPassword(
//   //       auth,
//   //       userInfo.email,
//   //       'someRandomPassword'
//   //     );
//   //     const user = userCredential.user;

//   //     await updateProfile(user, {
//   //       displayName: userInfo.nickname
//   //     });
//   //     return user;
//   //   } catch (error) {
//   //     console.log('Error creating/updating Firebase user:', error);
//   //     return null;
//   //   }
//   // };

//   // const saveUserToFirestore = async (userInfo: UserInfo) => {
//   //   // UserInfo 타입 지정
//   //   // Firestore에 사용자 문서 추가
//   //   const userDocRef = doc(db, 'users', userInfo.id.toString()); // userInfo.id를 uid로 사용
//   //   await setDoc(userDocRef, {
//   //     email: userInfo.email,
//   //     nickname: userInfo.nickname
//   //   });
//   // };

//   return (
//     <div>
//       <p>로그인 중입니다...</p>
//     </div>
//   );
// };

// export default OAuthCallback;

// import { useEffect } from 'react';
// import { useAuth } from '../hooks/useAuth'; // 사용자 정보를 설정하는 훅
// import { auth } from '../firebase/firebaseConfig'; // Firebase auth 설정
// import { doc, setDoc } from 'firebase/firestore'; // Firestore에 사용자 정보 저장

// const OAuthCallback = () => {
//   const { setUser } = useAuth(); // 사용자 정보를 설정하는 함수
//   const code = new URL(window.location.href).searchParams.get('code'); // URL에서 code 가져오기

//   useEffect(() => {
//     const fetchAccessToken = async () => {
//       try {
//         // 카카오 액세스 토큰 요청
//         const tokenResponse = await fetch(`https://kauth.kakao.com/oauth/token`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//           },
//           body: new URLSearchParams({
//             grant_type: 'authorization_code',
//             client_id: import.meta.env.VITE_REST_API_KEY, // 카카오 REST API 키
//             redirect_uri: import.meta.env.VITE_REDIRECT_URI, // 리다이렉트 URI
//             code: code || '',
//           }),
//         });

//         if (!tokenResponse.ok) {
//           throw new Error('Failed to fetch access token');
//         }

//         const tokenData = await tokenResponse.json();
//         const { access_token } = tokenData;

//         // 카카오 사용자 정보 요청
//         const userResponse = await fetch('https://kapi.kakao.com/v2/user/me', {
//           headers: {
//             Authorization: `Bearer ${access_token}`,
//           },
//         });

//         const userData = await userResponse.json();

//         // 사용자 정보를 Firebase에 저장할 형식으로 변환
//         const userCredential = {
//           uid: userData.id.toString(), // Firebase에 사용할 uid
//           email: userData.kakao_account.email, // 카카오 계정 이메일
//           displayName: userData.kakao_account.profile.nickname, // 사용자 이름
//         };

//         // Firebase에 사용자 정보 저장
//         const firebaseUser = await createOrUpdateUser(userCredential);
//         setUser(firebaseUser); // 사용자 정보 업데이트

//       } catch (error) {
//         console.error('Error during authentication:', error);
//       }
//     };

//     if (code) {
//       fetchAccessToken(); // 코드가 존재하면 액세스 토큰 요청
//     }
//   }, [code, setUser]);

//   // 사용자 생성 또는 업데이트 함수
//   const createOrUpdateUser = async (userCredential) => {
//     try {
//       // Firebase 사용자 생성
//       const userExists = await auth.fetchSignInMethodsForEmail(userCredential.email);

//       if (userExists.length === 0) {
//         // 사용자가 존재하지 않으면 이메일과 비밀번호로 사용자 생성
//         const userRecord = await auth.createUserWithEmailAndPassword(userCredential.email, 'someRandomPassword');
//         // Firestore에 사용자 정보 저장
//         await setDoc(doc(db, 'users', userCredential.uid), {
//           email: userCredential.email,
//           displayName: userCredential.displayName,
//         });
//         return userRecord.user;
//       } else {
//         // 사용자가 존재하면 로그인
//         const userRecord = await auth.signInWithEmailAndPassword(userCredential.email, 'someRandomPassword');
//         return userRecord.user;
//       }
//     } catch (error) {
//       console.error('Error creating or updating user:', error);
//       throw error; // 에러를 상위 함수로 전달
//     }
//   };

//   return <div>로그인 중...</div>;
// };

// export default OAuthCallback;

// const OAuthCallback = () => {
//   const code = new URL(window.location.href).searchParams.get('code');
//   console.log(code);

//   const headers = {
//     "Content-Type": 'application/x-www-form-urlencoded',
//   }

//   useEffect(() => [
//     fetch(`백엔드 요청 주소?.code=${code}`, {
//       method: 'POST',
//       headers: headers,
//     })
//     .then((response) => response.json())
//     .then(data => {
//       console.log(data);
//       console.log(data.result.user_id)
//     })
//   ], [])
// }

// src/pages/OAuthCallback.js

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const OAuthCallback = () => {
  const { setUser, setNickname } = useAuth();
  const navigate = useNavigate();

  // 사용자 정보 불러오기 함수
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

      // profile_nickname 경로를 통해 닉네임 가져오기
      const nickname =
        data.kakao_account?.profile?.profile_nickname || '사용자';
      setUser(data); // 예: user 객체 업데이트
      setNickname(nickname); // 닉네임 설정
      navigate('/');
    } catch (error) {
      console.error('카카오 로그인 에러:', error);
      navigate('/sign-in'); // 오류 시 로그인 페이지로 이동
    }
  };

  // URL에서 인가 코드 추출 및 액세스 토큰 요청
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
          fetchKakaoUser(accessToken); // 사용자 정보 불러오기
        } catch (error) {
          console.error('카카오 토큰 요청 에러:', error);
          navigate('/sign-in'); // 오류 시 로그인 페이지로 이동
        }
      };
      fetchAccessToken();
    }
  }, [navigate]);

  return <div>로그인 중...</div>;
};

export default OAuthCallback;
