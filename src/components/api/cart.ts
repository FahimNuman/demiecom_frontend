import AxiosClient from "../../utils/axiosConfig";

const addToCart = async (payload) => {
  console.log("payload", payload);

  try {
    const response = await AxiosClient.post("/api/cart/add", payload);
    return response.data;
  } catch (error) {
    console.error("Error fetching product list:", error);
    throw new Error("Failed to fetch product list");
  }
};

const fetchAllCarts = async (userId) => {
  try {
    const response = await AxiosClient.get(`/api/cart/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product list:", error);
    throw new Error("User Not Registered,Please First Complete your Registration");
  }
};

const updateCartQuantity = async ({ cartId, payload }) => {
  try {
    const response = await AxiosClient.put(`/api/cart/${cartId}`, payload);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error fetching product list:", error);
    // throw new Error("Failed to fetch product list");
    return {
      success: false,
      error: "Failed to update cart quantity",
    };
  }
};

const deleteCarts = async (payload) => {
  try {
    const response = await AxiosClient.put(`/api/cart/item/delete`, payload);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error deleting cart:", error);
    return {
      success: false,
      error: error?.response?.data?.message || "Failed to delete cart!!",
    };
  }
};

const deleteSize = async ({ cartId, payload }) => {
  try {
    const response = await AxiosClient.put(`/api/cart/item/${cartId}`, payload);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error fetching deleting size:", error);
    return {
      success: false,
      error: error?.response?.data?.message || "Failed to delete size",
    };
  }
};

export const cartApis = {
  addToCart,
  fetchAllCarts,
  updateCartQuantity,
  deleteSize,
  deleteCarts,
};
