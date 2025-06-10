'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import Cookies from 'js-cookie';

export default function OAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const newUser = searchParams.get('newUser');

    const uid = searchParams.get('uid');
    const name = searchParams.get('name');
    const email = searchParams.get('email');
    const profileUrl = searchParams.get('profileUrl');

    console.log('[OAuthCallback] 쿼리:', {
      token,
      newUser,
      uid,
      name,
      email,
      profileUrl,
    });

    if (newUser === 'true') {
      router.replace(`/auth/register?email=${searchParams.get('email')}&name=${searchParams.get('name')}&profileUrl=${searchParams.get('profileUrl')}`);
    } else if (token) {
      Cookies.set('accessToken', token);

      // 유저 정보 쿠키에 저장
      if (uid) Cookies.set('uid', uid);
      if (name) Cookies.set('name', name);
      if (email) Cookies.set('email', email);
      if (profileUrl) Cookies.set('profileUrl', profileUrl);

      router.replace('/');
    } else {
      alert('로그인 처리 중 문제가 발생했습니다.');
      router.replace('/auth/login');
    }
  }, [searchParams, router]);

  return <p>로그인 처리 중입니다...</p>;
}
