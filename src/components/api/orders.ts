import AxiosClient from "../../utils/axiosConfig";

export const orderApis = {
  getUserOrders: async (userId: string) => {
    try {
      const response = await AxiosClient.get(`/api/orders/user/${userId}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
};
