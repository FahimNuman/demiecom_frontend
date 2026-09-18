import AxiosClient from "../../utils/axiosConfig";

export const authApis = {
  register: async (data: any) => {
    try {
      const response = await AxiosClient.post("/api/user/registration", data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  getUserProfile: async () => {
    try {
      const response = await AxiosClient.get("/api/users/me");
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
};
