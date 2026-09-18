import { useQuery } from "@tanstack/react-query";
import { orderApis } from "../components/api/orders";
import { format } from "date-fns";
import { useUser } from "../services/userService";
import PropTypes from "prop-types";

const OrderSkeleton = () => (
  <div className="animate-pulse bg-white rounded-lg shadow-md p-6 border border-gray-200">
    <div className="flex justify-between items-start mb-4">
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
        <div className="h-4 bg-gray-200 rounded w-40"></div>
      </div>
      <div className="text-right space-y-2">
        <div className="h-6 bg-gray-200 rounded w-24 ml-auto"></div>
        <div className="h-6 bg-gray-200 rounded w-20 ml-auto"></div>
      </div>
    </div>
    <div className="space-y-4">
      <div className="h-24 bg-gray-200 rounded"></div>
      <div className="h-20 bg-gray-200 rounded"></div>
    </div>
  </div>
);

const EmptyOrders = () => (
  <div className="text-center py-12">
    <div className="text-5xl mb-4">📦</div>
    <h3 className="text-xl font-semibold mb-2">No Orders Yet</h3>
    <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
    <a
      href="/collections"
      className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
    >
      Start Shopping
    </a>
  </div>
);

const ErrorState = ({ error, onRetry }) => (
  <div className="text-center py-12">
    <div className="text-5xl mb-4">⚠️</div>
    <h3 className="text-xl font-semibold mb-2">Oops! Something went wrong</h3>
    <p className="text-gray-600 mb-6">{error.message || "Failed to load orders"}</p>
    <button
      onClick={onRetry}
      className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
    >
      Try Again
    </button>
  </div>
);

ErrorState.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string,
  }).isRequired,
  onRetry: PropTypes.func.isRequired,
};

const Orders = () => {
  const { userId, isLoading: isUserLoading, error: userError } = useUser();

  // console.log("userId:", userId, "isUserLoading:", isUserLoading, "userError:", userError);

  const {
    data: ordersData,
    isLoading: isOrdersLoading,
    error: ordersError,
    refetch: refetchOrders,
    isError: isOrdersError,
  } = useQuery({
    queryKey: ["user-orders", userId],
    // queryFn: () => orderApis.getUserOrders(userId),
    queryFn: async () => {
      const res = await orderApis.getUserOrders(userId);
      if (res.success) {
        return res.orders;
      } else {
        throw new Error("Failed to fetch orders");
      }
    },

    enabled: !!userId,
    onError: (err) => console.error("Error fetching orders:", err),
  });

  // console.log("ordersData:", ordersData, "isOrdersLoading:", isOrdersLoading, "ordersError:", ordersError);

  //  ordersData = [];

  // console.log("ordersData after modification:", ordersData);

  // Handle unauthenticated user
  if (!userId && !isUserLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>
        <p className="text-center text-gray-600">Please log in to view your orders.</p>
        <a
          href="/login"
          className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg mt-4"
        >
          Log In
        </a>
      </div>
    );
  }

  // Handle loading state
  if (isUserLoading || isOrdersLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <OrderSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Handle error states
  if (userError || isOrdersError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>
        <ErrorState
          error={userError || ordersError || { message: "Failed to load orders" }}
          onRetry={() => refetchOrders()}
        />
      </div>
    );
  }

  // Handle empty state
  if (!ordersData || !ordersData?.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>
        <EmptyOrders />
      </div>
    );
  }

  // Format date function
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }
      return format(date, "PPP");
    } catch (error) {
      console.error("Invalid date format:", dateString, error);
      return "Invalid Date";
    }
  };

  // console.log("ordersData:", ordersData);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      <div className="space-y-6">
        {ordersData.map((order) => (

          <div
            key={order._id}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-600">
                  Order ID: <span className="font-medium">{order._id}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Date: <span className="font-medium">{formatDate(order.createdAt)}</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">Total: ${order.totalAmount}</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm ${order.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : order.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                    }`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-medium mb-2">Items</h3>
              {order?.orderProducts.map((item, index) => (
                <div key={index} className="mb-4 p-4 bg-blue-50 rounded-lg">        
                  <div className="flex justify-between mb-2">
                    <h4 className="font-medium">{item?.productId?.name}</h4>
                    <p className="text-gray-600">SKU: {item?.productId?.sku}</p>
                  </div>
                  <div className="ml-4 mt-2">
                    <div
                      className="flex justify-between text-sm text-gray-600"
                    >
                      <p>Quantity: {item?.quantity} × ${item?.price}</p>
                      <p>Subtotal: ${item?.quantity * item?.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 mt-4">
              <h3 className="font-medium mb-2">Shipping Address</h3>
              <p className="text-sm text-gray-600">
                {order.address && order.address.street ? order.address.street : "Not provided"},
                {order.address && order.address.city ? ` ${order.address.city}` : ""}
                <br />
                {order.address && order.address.state ? `${order.address.state}, ` : ""}
                {order.address && order.address.zip ? order.address.zip : ""}
                <br />
                {order.address && order.address.country ? order.address.country : "Not provided"}
              </p>
            </div>

            <div className="border-t border-gray-200 pt-4 mt-4">
              <h3 className="font-medium mb-2">Payment Details</h3>
              <p className="text-sm text-gray-600">
                Method: {order.paymentDetails.method}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;