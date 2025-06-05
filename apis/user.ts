import axiosInstance from "@/apis/custom-axios";

export async function deleteUser() {
  const res = await axiosInstance.delete('/auth/withdraw');
  return res.data;
}