import axios from 'axios';
import { RegisterUserPayload, RegisterUserResponse } from '@/types/user';

// 회원가입에는 토큰이 필요없기 때문에 custom-axios를 사용하지 않았습니다.
export async function registerUser(
  payload: RegisterUserPayload
): Promise<RegisterUserResponse> {
  try {
    const response = await axios.post<RegisterUserResponse>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('회원가입 성공:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('회원가입 실패:', error.response?.data || error.message);
    throw error;
  }
}