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

// 포트폴리오 불러오기
export interface GetPortfolioResponse {
  name: string,
  email: string,
  studentNumber: string,
  major: string,
  grade: string,
  profileUrl: string,
  introduce: string,
  links: string[],
  stacks: string[],
  characters: string[]
}

// 프로젝트
export interface Project {
  id: number;
  title: string;
  oneLineDescription: string;
  stacks: string[];
  description: string;
  startDate: string;
  endDate: string;
  inProgress: boolean;
  images: string[];
  roles: string[];
  expanded?: boolean;
}

// 활동
export interface Activity {
  id: number;
  name: string;
  oneLineDescription: string;
  startDate: string;
  endDate: string;
  description: string;
  images: string[];
  roles: string[];
  inProgress: boolean;
  expanded?: boolean;
}

// 자격증
export interface License {
  id: number;
  licenseName: string;
  licenseOrganization: string;
  licenseDate: string;
}
