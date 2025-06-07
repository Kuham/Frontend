import axiosInstance from "@/apis/custom-axios";
import {GetPortfolioResponse, Project, Activity, License} from "@/types/user";

// 회원 탈퇴
export async function deleteUser() {
  const res = await axiosInstance.delete('/auth/withdraw');
  return res.data;
}

// 포트폴리오 불러오기 (유저 정보)
export async function getPortfolio(): Promise<GetPortfolioResponse> {
  const res = await axiosInstance.get<GetPortfolioResponse>('/portfolio/load');
  return res.data;
}

// 프로젝트 불러오기
export async function getProject(): Promise<Project[]> {
  const res = await axiosInstance.get<{ projects: Project[] }>('/portfolio/myProjects');
  return res.data.projects;
}

// 활동 불러오기
export async function getActivity(): Promise<Activity[]> {
  const res = await axiosInstance.get<{ activities: Activity[] }>('/portfolio/myActivities');
  return res.data.activities;
}

// 자격증 불러오기
export async function getLicense(): Promise<License[]> {
  const res = await axiosInstance.get<{ licenses: License[] }>('/portfolio/myLicenses');
  return res.data.licenses;
}