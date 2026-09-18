import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartApis } from "../api/cart.ts";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { debounce } from "../../helpers/debounce.js";
import { useUser } from "../../services/userService";

const resolveCartImage = (item, backendURL) => {
  const raw =
    item?.product_images && item.product_images.length > 0
      ? item.product_images[0]
      : null;

  if (!raw) return null;

  const url = raw.url || raw.src || raw.path || raw.link || null;
  if (!url) return null;

  if (/^https?:\/\//i.test(url)) return url;
  if (/^\//.test(url) && backendURL) {
    try {
      const base = new URL(backendURL);
      return `${base.origin}${url}`;
    } catch {
      return url;
    }
  }
  return url;
};

const CartTable = ({
  isLoading,
  error,
  cartList,
  currency,
  toggleSelectAll,
  toggleSelectItem,
  selectedItems,
  isSelecting,
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { userId } = useUser();
  const { register, setValue, getValues, handleSubmit, watch } = useForm({
    defaultValues: {},
  });

  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const { mutate: updateCartMutation } = useMutation({
    mutationFn: cartApis.updateCartQuantity,
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({
          queryKey: ["cart-list"],
        });
        toast.success("Added to cart successfully!");
      } else {
        toast.error(response.error || "Failed to Update item");
      }
    },
    onError: () => {
      toast.error("Failed to update item");
    },
  });

  const { mutate: deleteSizeMutation } = useMutation({
    mutationFn: cartApis.deleteSize,
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({
          queryKey: ["cart-list"],
        });
        toast.success("Successfully deleted the size!");
      } else {
        toast.error(response.error || "Failed to delete size!!");
      }
    },
    onError: () => {
      toast.error("Failed to update item");
    },
  });

  const getSubtotal = (key, price, quantity) => {
    const qty = watch(key);
    const q = Number(qty ?? quantity ?? 0);
    const p = Number(price ?? 0);
    if (!Number.isFinite(q) || !Number.isFinite(p)) return 0;
    return Math.max(0, Math.round(q * p));
  };

  const updateCartQuantity = debounce(
    async (cartId, size, newQuantity, colorId, userId) => {
      const payload = {
        userId: userId,
        colorId: colorId,
        sizeId: size,
        quantity: newQuantity,
      };
      await updateCartMutation({ cartId, payload });
    },
    1000
  );

  const increment = (id, color, size, colorId, userId) => {
    const key = `${id}-${color}-${size}`;
    const currentQuantity = parseInt(getValues(key) || 0, 10);
    updateCartQuantity(id, size, currentQuantity + 1, colorId, userId);
  };

  const decrement = (id, color, size, colorId, userId) => {
    const key = `${id}-${color}-${size}`;
    const currentQuantity = parseInt(getValues(key) || 0, 10);
    if (currentQuantity > 1) {
      updateCartQuantity(id, size, currentQuantity - 1, colorId, userId);
    }
  };

  const isSelected = (id) => selectedItems.includes(id);
  const isAllSelected = () => selectedItems?.length === carts?.length;
  const getTotal = () => {
    let total = 0;
    carts?.forEach((cart) => {
      cart?.items?.forEach((item) => {
        item?.colors?.forEach((color) => {
          color?.sizes?.forEach((size) => {
            const key = `${cart._id}-${color.color_name}-${size.size_id}`;
            total += getSubtotal(key, size.price, size.quantity);
          });
        });
      });
    });
    return total;
  };

  const deleteItem = async (cartId, _, colorId, sizeId) => {
    const payload = {
      userId,
      colorId,
      sizeId,
    };
    await deleteSizeMutation({ cartId, payload });
  };

  const populateCartIds = () => {
    const ids = carts?.map((cart) => cart._id) || [];

    return ids;
  };

  const onSubmit = (data) => {
    if (!populateCartIds()?.length) toast.error("Add carts to checkout!!! ");

    const encodedItems = encodeURIComponent(JSON.stringify(populateCartIds()));

    navigate(`/place-order?selectedItems=${encodedItems}`);
    console.log(data);
  };

  useEffect(() => {
    if (carts) {
      carts?.forEach((cart) => {
        cart?.items?.forEach((item) => {
          item?.colors?.forEach((color) => {
            color?.sizes?.forEach((size) => {
              const key = `${cart._id}-${color.color_name}-${size.size_id}`;
              setValue(key, size.quantity); // Set default values dynamically
            });
          });
        });
      });
    }
  }, [cartList, setValue]);

  const carts = Array.isArray(cartList) ? cartList : cartList?.carts;

  console.log("CartTable render cartList", cartList);

  if (!carts?.length) {
    return (
      <div className="p-4 border text-center">
        <p>No carts found. Debug info:</p>
        <pre className="text-left text-xs mt-2">{JSON.stringify(cartList, null, 2)}</pre>
      </div>
    );
  }

  const sampleCart = carts?.[0];
  console.log("CartTable sampleCart", sampleCart);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="table-responsive overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border text-center">
                <input
                  type="checkbox"
                  name="delete_product"
                  id="delete_product"
                  onChange={toggleSelectAll}
                  checked={isAllSelected()}
                  disabled={!isSelecting}
                />
              </th>

              <th className="p-3 border text-center">Item</th>
              <th className="p-3 border text-center">Name</th>
              <th className="p-3 border text-center">Color</th>
              <th className="p-3 border text-center">Size</th>
              <th className="p-3 border text-center">Price</th>
              <th className="p-3 border text-center">Quantity</th>
              <th className="p-3 border text-center">Subtotal</th>
              <th className="p-3 border text-center"></th>
            </tr>
          </thead>
          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error?.message}</p>
          ) : (
            carts?.map((cart, index) => (
              <tbody
                key={cart._id}
                className={index % 2 === 0 ? "bg-gray-50/5" : ""}
              >
                 {cart?.items?.map((item) => {
                   let productRowSpan = 0;
                   item?.colors?.forEach((color) => {
                     productRowSpan += color?.sizes?.length || 0;
                   });

                   console.log("Cart item debug", {
                     productName: item?.product_name,
                     productImages: item?.product_images,
                     firstImageUrl: item?.product_images?.[0]?.url,
                     resolvedImage: resolveCartImage(item, backendURL),
                   });

                   return item?.colors?.map((color, colorIndex) => {
                     const colorRowSpan = color?.sizes?.length || 0;
 
                     return color?.sizes?.map((size, sizeIndex) => {
                      const key = `${size.size_id}-${color.color_name}-${cart._id}`;

                      return (
                        <tr
                          key={key}
                          className="text-center transition-colors duration-300"
                        >
                          {colorIndex === 0 && sizeIndex === 0 && (
                            <>
                              <td
                                rowSpan={productRowSpan}
                                className="p-3 border align-middle w-6"
                              >
                                <input
                                  type="checkbox"
                                  name="delete_product"
                                  id="delete_product"
                                  onChange={() => toggleSelectItem(cart._id)}
                                  checked={isSelected(cart._id)}
                                  disabled={!isSelecting}
                                />
                              </td>

                                <td
                                  rowSpan={productRowSpan}
                                  className="p-3 border align-middle"
                                >
                                  {(() => {
                                    const rawImg = resolveCartImage(item, backendURL);
                                    const imgSrc = rawImg || "/default-image.svg";

                                    return (
                                      <img
                                        src={imgSrc}
                                        alt={item.product_name}
                                        className="w-16 h-16 object-contain rounded-md mx-auto"
                                        onError={(e) => {
                                          e.target.style.display = "none";
                                          e.target.nextElementSibling &&
                                            (e.target.nextElementSibling.style.display = "block");
                                        }}
                                      />
                                    );
                                  })()}
                                  <img
                                    src="/default-image.svg"
                                    alt="No image"
                                    className="w-16 h-16 object-contain rounded-md mx-auto hidden"
                                  />
                                </td>
                              <td
                                rowSpan={productRowSpan}
                                className="p-3 border align-middle"
                              >
                                {item.product_name}
                              </td>
                            </>
                          )}

                          {sizeIndex === 0 && (
                            <td
                              rowSpan={colorRowSpan}
                              className="p-3 border align-middle"
                            >
                              {color.color_name}
                            </td>
                          )}

                          <td className="p-3 border">{size.size_name}</td>
                          <td className="p-3 border">
                            {currency}
                            {size.price}
                          </td>
                          <td className="p-3 border">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                type="button"
                                className="bg-red-500 text-white p-1 rounded"
                                onClick={() =>
                                  decrement(
                                    cart._id,
                                    color.color_name,
                                    size.size_id,
                                    color.color_id,
                                    cart.user
                                  )
                                }
                              >
                                <FaMinus />
                              </button>
                              <input
                                {...register(
                                  `${cart._id}-${color.color_name}-${size.size_id}`
                                )}
                                type="number"
                                min="1"
                                defaultValue={size.quantity || 1}
                                onChange={(e) =>
                                  updateCartQuantity(
                                    cart._id,
                                    size.size_id,
                                    Number(e.target.value),
                                    color.color_id,
                                    cart.user
                                  )
                                }
                                className="w-16 border text-center rounded"
                              />
                              <button
                                type="button"
                                className="bg-red-500 text-white p-1 rounded"
                                onClick={() =>
                                  increment(
                                    cart._id,
                                    color.color_name,
                                    size.size_id,
                                    color.color_id,
                                    cart.user
                                  )
                                }
                              >
                                <FaPlus />
                              </button>
                            </div>
                          </td>
                          <td className="p-3 border min-w-[80px]">
                            {currency}{" "}
                            {getSubtotal(
                              `${cart._id}-${color.color_name}-${size.size_id}`,
                              size.price,
                              size.quantity
                            )}
                          </td>
                          <td className="p-3 border min-w-[20px] h-full mx-auto">
                            <button
                              type="button"
                              onClick={() =>
                                deleteItem(
                                  cart._id,
                                  item.user,
                                  color.color_id,
                                  size.size_id
                                )
                              }
                              className=" flex items-center justify-center w-full"
                            >
                              <FaTrash className="text-red-500 cursor-pointer hover:text-gray-50" />
                            </button>
                          </td>
                        </tr>
                      );
                    });
                  });
                })}
              </tbody>
            ))
          )}
          <tbody className={""}>
            <td className="p-3  min-w-[20px] h-full mx-auto"></td>
            <td className="p-3  min-w-[20px] h-full mx-auto"></td>
            <td className="p-3  min-w-[20px] h-full mx-auto"></td>
            <td className="p-3  min-w-[20px] h-full mx-auto"></td>
            <td className="p-3  min-w-[20px] h-full mx-auto"></td>
            <td className="p-3  min-w-[20px] h-full mx-auto"></td>
            <td className="p-3  min-w-[20px] h-full mx-auto"></td>
            <td className="p-3 border min-w-[20px] h-full mx-auto">
              <p className="flex justify-between items-center">
                <span className="font-medium text-gray-800">Total:</span>{" "}
                <span className="font-bold text-red-500">
                  {currency}
                  {getTotal()}
                </span>
              </p>
            </td>
          </tbody>
        </table>
      </div>
      <div className="flex flex-col sm:flex-row justify-between mt-6 mb-10">
        <button
          className="bg-red-500 text-white py-3 px-6 rounded flex items-center gap-2 mb-4 sm:mb-0"
          onClick={() => navigate("/shop")}
        >
          Continue Shopping
        </button>
        <button
          type="submit"
          className="bg-red-500 text-white py-3 px-6 rounded flex items-center gap-2"
        >
          Proceed to Checkout
        </button>
      </div>
    </form>
  );
};

CartTable.propTypes = {
  cartList: PropTypes.array.isRequired,
  currency: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  error: PropTypes.array,
  toggleSelectAll: PropTypes.func,
  toggleSelectItem: PropTypes.func,
  selectedItems: PropTypes.array,
  isSelecting: PropTypes.bool,
};

export default CartTable;
