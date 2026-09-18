// import { cartApis } from "../components/api/cart";
import { cartApis } from "../components/api/cart";
import { useQuery } from "@tanstack/react-query";



// Fetch cart items for a specific user
export const useGetCarts = (userId: string) =>
  useQuery({
    queryKey: ["cart-list", userId],
    queryFn: () => cartApis.fetchAllCarts(userId),
    enabled: !!userId, // Prevent fetching if userId is not provided
  });

// Create a payment intent using Stripe API
export const createPaymentIntent = async (data: { amount: number }) => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/stripe/create-payment-intent`, {
    // const response = await fetch(`http://localhost:4000/api/stripe/create-payment-intent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create payment intent");
  }

  return response.json();
};