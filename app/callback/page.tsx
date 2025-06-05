'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function OAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const newUser = searchParams.get('newUser');

    if (newUser === 'true') {
      router.replace(`/auth/register?email=${searchParams.get('email')}&name=${searchParams.get('name')}&profileUrl=${searchParams.get('profileUrl')}`);
    } else if (token) {
      localStorage.setItem('accessToken', token);
      router.replace('/');
    } else {
      alert('로그인 처리 중 문제가 발생했습니다.');
      router.replace('/auth/login');
    }
  }, [searchParams, router]);

  return <p>로그인 처리 중입니다...</p>;
}
