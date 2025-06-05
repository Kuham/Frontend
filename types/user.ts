// 회원가입
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

export interface RegisterUserResponse {
  uid: string;
  name: string;
  email: string;
  profileUrl: string;
}