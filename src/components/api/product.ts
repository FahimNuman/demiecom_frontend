import AxiosClient from "../../utils/axiosConfig";

export const fetchProductList = async () => {
  try {
    const response = await AxiosClient.get("/api/product/list");
    return response.data;
  } catch (error) {
    console.error("Error fetching product list:", error);
    throw new Error("Failed to fetch product list");
  }
};

export const fetchAProduct = async (id: string) => {
  try {
    const response = await AxiosClient.get(`api/product/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product list:", error);
    throw new Error("Failed to fetch product list");
  }
};
