import axiosInstance from "@/apis/custom-axios";
import {Project} from "@/types/user";

export async function addProject(formData: FormData): Promise<void> {
  await axiosInstance.post("/portfolio/project/add", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}