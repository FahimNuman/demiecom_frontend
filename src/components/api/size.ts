import AxiosClient from "../../utils/axiosConfig";

export const fetchSizeList = async () => {
  try {
    const response = await AxiosClient.get("/api/size/list");
    return response.data;
  } catch (error) {
    console.error("Error fetching size list:", error);
    throw new Error("Failed to fetch size list");
  }
};
