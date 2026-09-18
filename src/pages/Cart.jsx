import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import ConfirmModal from "../components/cart/ConfirmModal";
import CartActions from "../components/cart/CartActions";
import CartTable from "../components/cart/CartTable";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useGetCarts } from "../service/cart";
import { toast } from "react-toastify";
import { cartApis } from "../components/api/cart.ts";
import { useUser } from "../services/userService";

const Cart = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();
  const { userId, isLoading: isUserLoading } = useUser();
  const navigate = useNavigate();

  const { data: cartList, isLoading, error } = useGetCarts(userId);

  if (isUserLoading) {
    return (
      <section className="flex flex-col items-center justify-center py-10">
        <div className="max-padd-container w-full px-4">
          <p>Loading cart...</p>
        </div>
        <Footer />
      </section>
    );
  }

  if (!userId) {
    return (
      <section className="flex flex-col items-center justify-center py-10">
        <div className="max-padd-container w-full px-4">
          <p>Please login to view your cart.</p>
        </div>
        <Footer />
      </section>
    );
  }

  console.log("cartList", cartList);

  const { mutate: deleteCartMutation } = useMutation({
    mutationFn: cartApis.deleteCarts,
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({
          queryKey: ["cart-list"],
        });
        toast.success("Successfully deleted the cart(s)!!");
      } else {
        toast.error(response.error || "Failed to delete cart(s)!!");
      }
    },
    onError: () => {
      toast.error("Failed to update item");
    },
  });

  const toggleSelectAll = () => {
    const cartIds = cartList?.carts?.map((cart) => cart._id) || [];
    setSelectedItems((prev) => {
      if (prev.length === cartIds.length) {
        return [];
      } else {
        return [...cartIds];
      }
    });
  };

  const toggleSelectItem = (id) => {
    setSelectedItems((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const removeAllSelectedItems = () => {
    setShowModal(true);
  };

  const confirmRemoveSelectedItems = async () => {
    const payload = {
      userId,
      cartIds: selectedItems,
    };

    await deleteCartMutation(payload);
    setSelectedItems([]);
    setShowModal(false);
  };

  const getCartCount = () => {
    return cartList?.carts?.length || 0;
  };

  const handleCheckout = () => {
    navigate("/place-order");
  };

  // Render loading state
  if (isLoading) {
    return (
      <section className="flex flex-col items-center justify-center py-10">
        <div className="max-padd-container w-full px-4">
          <p>Loading cart...</p>
        </div>
        <Footer />
      </section>
    );
  }

  // Render error state
  if (error) {
    return (
      <section className="flex flex-col items-center justify-center py-10">
        <div className="max-padd-container w-full px-4">
          <p>Error loading cart: {error.message}</p>
        </div>
        <Footer />
      </section>
    );
  }

  // Render main content when data is available
  return (
    <>
      <section className="flex flex-col items-center justify-center py-10">
        <div className="max-padd-container w-full px-4">
          <CartActions
            getCartCount={getCartCount}
            isSelecting={isSelecting}
            setIsSelecting={setIsSelecting}
            removeAllSelectedItems={removeAllSelectedItems}
            loading={isLoading}
          />

          <CartTable
            isLoading={isLoading}
            error={error}
            cartList={cartList || { carts: [] }} // Provide fallback to avoid undefined
            currency={"$"}
            toggleSelectAll={toggleSelectAll}
            toggleSelectItem={toggleSelectItem}
            selectedItems={selectedItems}
            isSelecting={isSelecting}
          />

          {/* Proceed to Checkout Button */}
          {/* <div className="flex justify-end mt-6">
            <button
              onClick={handleCheckout}
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Proceed to Checkout
            </button>
          </div> */}
        </div>
      </section>
      {showModal && (
        <ConfirmModal
          cancelAction={() => setShowModal(false)}
          confirmAction={confirmRemoveSelectedItems}
        />
      )}
      <Footer />
    </>
  );
};

export default Cart;