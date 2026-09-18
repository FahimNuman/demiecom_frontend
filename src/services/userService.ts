import { useQuery } from "@tanstack/react-query";
import { authApis } from "../components/api/auth";

export const useUser = () => {
  const {
    data: userData,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["user-profile"],
    queryFn: authApis.getUserProfile,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  console.log("userData", userData?.user._id);

  return {
    user: userData?.user,
    userId: userData?.user?._id,
    isLoading,
    error,
    isError,
  };
};
