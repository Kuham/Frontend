import axiosInstance from "@/apis/custom-axios";
import {Project} from "@/types/user";

// 프로젝트 생성
export async function addProjectAPI(formData: FormData): Promise<void> {
  await axiosInstance.post("/portfolio/project/add", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

// 프로젝트 수정
export async function updateProjectAPI(projectId: number, formData: FormData): Promise<void> {
  await axiosInstance.put(`/portfolio/project/${projectId}/edit`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

// 프로젝트 삭제
export async function deleteProjectAPI(projectId: number): Promise<void> {
  await axiosInstance.delete(`/portfolio/project/${projectId}/delete`);
}

