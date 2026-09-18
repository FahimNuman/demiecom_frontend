import { useForm } from "react-hook-form";
import { useState } from "react";
import { fetchSizeList } from "../api/size";
import { useQuery, useMutation } from "@tanstack/react-query";
import ActionButtons from "./ActionButtons.jsx";
import { toast } from "react-toastify";
import { cartApis } from "../api/cart.ts";
import { useUser } from "../../services/userService";
import PropTypes from "prop-types";

const ProductSizeTable = ({
  product,
  setSelectedColors,
  selectedColors,
  setImage,
}) => {
  const { colors } = product;
  const { handleSubmit } = useForm();
  // const [selectedColors, setSelectedColors] = useState([]);
  const [colorSelections, setColorSelections] = useState([]);
  const { userId } = useUser();



  const {
    data: sizeList,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["size-list"],
    queryFn: () => fetchSizeList(),
  });

  const { mutate: addToCartMutation } = useMutation({
    mutationFn: cartApis.addToCart,
    onSuccess: () => {
      toast.success("Added to cart successfully!");
    },
    onError: () => {
      toast.error("Failed to add to cart");
    },
  });

  if (isLoading || !sizeList?.sizes) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Error loading product!</p>
      </div>
    );
  }

  const handleColorChange = (color) => {
    setImage("");
    setSelectedColors((prevColors) =>
      prevColors.includes(color)
        ? prevColors.filter((c) => c !== color)
        : [...prevColors, color]
    );
  };



  const handleFieldChange = (colorId, sizeId, field, value, price) => {

    // const foundItem = selectedColors.find(color => color._id === targetId);

    const colorIndex = selectedColors.findIndex((color) => color._id === colorId);

    if (colorIndex !== -1) {
      const sizeIndex = selectedColors[colorIndex].sizes.findIndex(
        (size) => size._id === sizeId
      );

      if (sizeIndex !== -1) {
        // Deep clone to avoid direct mutation
        const updatedColors = [...selectedColors];
        updatedColors[colorIndex] = { ...updatedColors[colorIndex] };
        updatedColors[colorIndex].sizes = [...updatedColors[colorIndex].sizes];
        updatedColors[colorIndex].sizes[sizeIndex] = {
          ...updatedColors[colorIndex].sizes[sizeIndex],
          orderQuantity: value,
        };

        setSelectedColors(updatedColors);
      }
    }

  }

  console.log("selectedColors", selectedColors);

  const onSubmit = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      if (selectedColors.length > 0) {
        const cartPayload = {
          userId,
          productId: product._id,
          selectedColors,
        };

        await addToCartMutation(cartPayload);
        setSelectedColors([]);
      } else {
        toast.error("Please select at least one color and size");
      }
    } else {
      toast.error("Please login to add to cart");
    }
  };

  const handleFieldChangeOld = (colorId, sizeId, field, value, price) => {
    setColorSelections((prevSelections) => {
      const updatedSelections = [...prevSelections];
      const colorIndex = updatedSelections.findIndex(
        (selection) => selection.colorId === colorId
      );

      if (colorIndex === -1) {
        if (value !== "") {
          updatedSelections.push({
            colorId,
            sizes: [{ size: sizeId, [field]: value, price }],
          });
        }
      } else {
        const sizeIndex = updatedSelections[colorIndex].sizes.findIndex(
          (size) => size.size === sizeId
        );

        if (sizeIndex === -1) {
          if (value !== "") {
            updatedSelections[colorIndex].sizes.push({
              size: sizeId,
              [field]: value,
              price,
            });
          }
        } else {
          if (value !== "") {
            updatedSelections[colorIndex].sizes[sizeIndex][field] = value;
          } else {
            delete updatedSelections[colorIndex].sizes[sizeIndex][field];

            if (
              Object.keys(updatedSelections[colorIndex].sizes[sizeIndex])
                .length === 1
            ) {
              updatedSelections[colorIndex].sizes.splice(sizeIndex, 1);
            }

            if (updatedSelections[colorIndex].sizes.length === 0) {
              updatedSelections.splice(colorIndex, 1);
            }
          }
        }
      }

      return updatedSelections;
    });
  };

  // const onSubmit = async () => {

  //   console.log("colorSelections", colorSelections);

  //   const token = localStorage.getItem("token");

  //   if(token){
  //     if (selectedColors.length > 0) {
  //       const cartPayload = {
  //         userId,
  //         productId: product._id,
  //         colorSelections,
  //       };

  //       await addToCartMutation(cartPayload);
  //       setSelectedColors([]);
  //     } else {
  //       toast.error("Please select at least one color and size");
  //     }
  //   }else{
  //     toast.error("Please login to add to cart");
  //   }
  // };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="overflow-auto">
      <div className="mb-5">
        <p className="mb-2">
          Select Colors:{" "}
          {selectedColors.length > 0 ? (
            <span className="font-bold text-green-500">
              {selectedColors.map((color) => color.name).join(", ")}
            </span>
          ) : (
            <span className="text-gray-500">No Selected Color</span>
          )}
        </p>

        <div className="grid grid-cols-8">
          {colors.map((color) => (
            <button
              key={color._id}
              onClick={() => handleColorChange(color)}
              className={`h-10 w-15 flex items-center justify-center border-2 relative ${selectedColors.includes(color)
                ? "border-green-400"
                : "border-zinc-50"
                }`}
              style={{
                backgroundImage: color.images?.[0]?.url
                  ? `url(${color.images[0].url})`
                  : "none", // Fallback if no image is available
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              type="button"
            >
              {selectedColors.includes(color) && (
                <span
                  className="absolute top-1 left-1 bg-green-500 rounded-full p-0.5"
                  title="Selected"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-2 w-2 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
              )}
              <span className="text-xs font-bold text-neutral-500">
                {color.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {selectedColors.length > 0 &&
        selectedColors.map((color) => (
          <div className="border rounded-lg mt-2" key={color._id}>
            <table className="min-w-full text-center">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 ">Color</th>
                  <th></th>
                  {color.sizes.map((size) => (
                    <th key={size._id} className="px-4 py-2 ">
                      {size.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* {selectedColors.map((color) => ( */}
                <tr key={color._id}>
                  <td className="px-4 py-2 border-r">
                    <p>{color.name}</p>
                  </td>
                  <td className="px-4 py-2 border-x">
                    <p>Price:</p>
                    <p>Quantity:</p>
                  </td>
                  {color.sizes.map((size) => (
                    <td
                      key={`${color._id}-${size._id}`}
                      className="px-4 py-2 border-x"
                    >
                      <div>
                        <p className="text-lg font-medium text-secondary tracking-tight">
                          ${size.price}
                        </p>
                        <input
                          type="number"
                          min="0"
                          className="w-16 text-center border rounded"
                          placeholder="Qty"
                          onChange={(e) =>
                            handleFieldChange(
                              color._id,
                              size._id,
                              "quantity",
                              e.target.value,
                              size.price
                            )
                          }
                        />
                      </div>
                    </td>
                  ))}
                </tr>
                {/* ))} */}
              </tbody>
            </table>
          </div>
        ))}

      <ActionButtons />
    </form>
  );
};

ProductSizeTable.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    colors: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        sizes: PropTypes.arrayOf(
          PropTypes.shape({
            _id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            price: PropTypes.number.isRequired,
            orderQuantity: PropTypes.number.isRequired,
          })
        ).isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default ProductSizeTable;
