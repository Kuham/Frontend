// 회원가입 - 요청
export interface RegisterUserPayload {
  name: string;
  email: string;
  studentNum: string;
  grade: string;
  major: string;
  profileUrl: string;
  stacks: string[];
  links: string[];
  charaters: string[];
  introduce: string;
}

// 회원가입 - 응답
export interface RegisterUserResponse {
  uid: string;
  name: string;
  email: string;
  profileUrl: string;
}