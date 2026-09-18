import AxiosClient from "../../utils/axiosConfig";

const getOrderDetails = async (payload) => {
  try {
    const response = await AxiosClient.post(`/api/orders/details`, payload);
    return response.data;
  } catch (error) {
    console.error("Error fetching Order details:", error);
    return {
      success: false,
      error: "Failed to update cart quantity",
    };
  }
};

const placeOrder = async (payload) => {
  try {
    const response = await AxiosClient.post(`/api/orders/create`, payload);
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    return {
      success: false,
      error: "Failed to create order",
    };
  }
};

export const orderApis = {
  getOrderDetails,
  placeOrder,
};
