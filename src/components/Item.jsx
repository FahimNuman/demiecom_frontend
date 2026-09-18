import { Link } from "react-router-dom";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchSizeList } from "./api/size";
import { cartApis } from "./api/cart"; // Fixed: No .ts extension
import { toast } from "react-toastify";
import { useUser } from "../services/userService"; // Fixed: Correct path

const SizeSelector = ({ isOpen, onClose, sizesByColor, onAddToCart, productId, userId }) => {
  const [selectedColor, setSelectedColor] = useState(null);
  const [sizeQuantities, setSizeQuantities] = useState({}); // Store quantities for each size

  if (!isOpen) return null;

  const handleQuantityChange = (sizeId, value) => {
    setSizeQuantities((prev) => ({
      ...prev,
      [sizeId]: value,
    }));
  };

  const handleAddToCart = () => {
    const token = localStorage.getItem("token");
    console.log("SizeSelector - User ID:", userId); // Debugging
    console.log("SizeSelector - Token:", token); // Debugging
    console.log("SizeSelector - Selected Color:", selectedColor); // Debugging
    console.log("SizeSelector - Size Quantities:", sizeQuantities); // Debugging

    if (!userId || !token) {
      toast.error("Please login to add to cart");
      return;
    }
    if (!selectedColor) {
      toast.error("Please select a color");
      return;
    }

    const selectedSizes = Object.entries(sizeQuantities)
      .filter(([_, quantity]) => quantity && parseInt(quantity) > 0)
      .map(([sizeId, quantity]) => {
        const size = selectedColor.sizes.find((s) => s._id === sizeId);
        return {
          _id: size._id,
          name: size.name,
          price: size.price,
          orderQuantity: parseInt(quantity),
        };
      });

    if (selectedSizes.length === 0) {
      toast.error("Please enter a valid quantity for at least one size");
      return;
    }

    const cartPayload = {
      userId,
      productId,
      selectedColors: [
        {
          _id: selectedColor._id,
          name: selectedColor.colorName,
          sizes: selectedSizes,
        },
      ],
    };

    console.log("SizeSelector - Cart Payload:", cartPayload); // Debugging
    onAddToCart(cartPayload);
    setSelectedColor(null);
    setSizeQuantities({});
    onClose();
  };

  return (
    <div className="absolute left-0 right-0 bottom-14 mx-auto bg-white p-4 rounded-lg shadow-lg z-50 w-[350px]">
      <button
        className="absolute top-2 right-2 text-gray-600 hover:text-red-600"
        onClick={onClose}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {!selectedColor ? (
        <div>
          <h4 className="font-bold mb-2">Select Color</h4>
          <select
            className="w-full px-2 py-1 border rounded text-sm"
            onChange={(e) => {
              const colorId = e.target.value;
              setSelectedColor(sizesByColor[colorId]);
            }}
            defaultValue=""
          >
            <option value="" disabled>
              Choose a color
            </option>
            {Object.keys(sizesByColor).map((colorId) => (
              <option key={colorId} value={colorId}>
                {sizesByColor[colorId].colorName}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div>
          <h4 className="font-bold mb-2">Select Sizes for {selectedColor.colorName}</h4>
          <div className="grid gap-2">
            {selectedColor.sizes.map((size) => (
              <div key={size._id} className="flex items-center justify-between">
                <span className="text-sm">{size.name}</span>
                <input
                  type="number"
                  min="0"
                  value={sizeQuantities[size._id] || ""}
                  onChange={(e) => handleQuantityChange(size._id, e.target.value)}
                  className="w-20 px-2 py-1 border rounded text-sm"
                  placeholder="Qty"
                />
              </div>
            ))}
          </div>
          <button
            className="mt-2 w-full bg-green-500 text-white py-2 rounded hover:bg-green-700 text-sm"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
          <button
            className="mt-2 text-sm text-gray-600"
            onClick={() => setSelectedColor(null)}
          >
            Back to Colors
          </button>
        </div>
      )}
    </div>
  );
};

const Item = ({ product }) => {
  const [isSizeOpen, setIsSizeOpen] = useState(false);
  const { userId } = useUser() || { userId: localStorage.getItem("userId") || null }; // Fallback to localStorage

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
    onError: (error) => {
      console.error("Add to Cart Error:", error); // Debugging
      toast.error("Failed to add to cart");
    },
  });

  const handleSizeClick = () => {
    const token = localStorage.getItem("token");
    console.log("Item - Token:", token); // Debugging
    console.log("Item - User ID:", userId); // Debugging
    if (!token || !userId) {
      toast.error("Please login to add to cart");
      return;
    }
    setIsSizeOpen((prev) => !prev);
  };

  const handleCloseSize = () => {
    setIsSizeOpen(false);
  };

  const handleAddToCart = (cartPayload) => {
    console.log("Item - Sending Cart Payload:", cartPayload); // Debugging
    addToCartMutation(cartPayload);
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading sizes!</p>;

  const sizesByColor = product.colors.reduce((acc, color) => {
    const availableSizes =
      sizeList?.sizes.filter((size) =>
        color.sizes.some((s) => s._id === size._id)
      ) || [];
    acc[color._id] = {
      colorName: color.name,
      sizes: availableSizes.map((size) => ({
        ...size,
        price: color.sizes.find((s) => s._id === size._id)?.price || product.price,
      })),
      _id: color._id,
    };
    return acc;
  }, {});

  return (
    <div className="w-[376px] mx-auto relative">
      {/* Image Card */}
      <div className="group relative overflow-hidden border bg-zinc-100 h-[580px]">
        <Link to={`/product/${product._id}`}>
          <img
            src={
              product.colors?.[0]?.images?.[0]?.image ||
              product.images?.[0]?.url ||
              "/default-image.jpg"
            }
            alt={product.name}
            className="w-full h-[520px] object-cover" // Fixed: classpName to className
          />
        </Link>

        {product.new && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-[11px] font-bold px-3 py-1 rounded-full z-10 shadow">
            NEW!
          </span>
        )}

        <button
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black text-white w-[350px] h-[50px] py-2  text-center transition-all duration-300 z-20 text-xs"
          onClick={handleSizeClick}
        >
          Quick Select
        </button>

        {/* Inline Size Selector */}
        {isSizeOpen && (
          <div className="absolute bottom-[-50px] left-[3.3%] transform -translate-x-[50%] z-30">
            <SizeSelector
              isOpen={isSizeOpen}
              onClose={handleCloseSize}
              sizesByColor={sizesByColor}
              onAddToCart={handleAddToCart}
              productId={product._id}
              userId={userId}
            />
          </div>
        )}
      </div>

      {/* Bottom Info Section */}
      <div className="mt-3 relative">
        <div className="flex justify-between items-start">
          <h4 className="text-sm font-medium text-gray-900">{product.name}</h4>

          <button className="text-black hover:text-red-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>

        <div className="flex gap-2 mt-1 text-sm">
          <span className="text-gray-400 line-through">
            ${product.originalPrice || product.price}
          </span>
          <span className="text-red-600 font-bold">
            ${product.discountPrice || product.price}
          </span>
        </div>

        <p className="text-xs font-bold text-red-500 mt-1">
          Up to 80% Off Sitewide! Prices as Marked
        </p>

        {product.colors && product.colors.length > 1 && (
          <div className="flex gap-1 mt-2">
            {product.colors.slice(0, 4).map((color, idx) => (
              <span
                key={idx}
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{
                  backgroundColor: color.code || color.hex || "black",
                }}
              ></span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Item;









// src/components/Item.jsx
// import { Link } from "react-router-dom";

// const Item = ({ product }) => {
//   const {
//     _id,
//     name,
//     price,
//     originalPrice,
//     colors = [],          // ← এটাই মেইন সোর্স
//   } = product || {};

//   // Product page-এর মতো: প্রথম কালারের প্রথম ইমেজ নাও
//   const mainImage =
//     colors?.[0]?.images?.[0]?.image ||                  // colors[0].images[0].image
//     colors?.[0]?.images?.[0] ||                         // যদি images সরাসরি string array হয়
//     (Array.isArray(product?.images) && product.images[0]) ||
//     product?.image ||
//     "https://via.placeholder.com/400x500?text=No+Image";

//   const discount = originalPrice && price < originalPrice
//     ? Math.round(((originalPrice - price) / originalPrice) * 100)
//     : 0;

//   return (
//     <Link
//       to={`/product/${_id}`}
//       className="group block border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all bg-white"
//     >
//       <div className="relative overflow-hidden">
//         <img
//           src={mainImage}
//           alt={name || "Product"}
//           className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
//           onError={(e) => {
//             e.target.src = "https://via.placeholder.com/400x500?text=Load+Failed";
//             console.log("Failed image URL:", mainImage);
//           }}
//         />
//         {discount > 0 && (
//           <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
//             -{discount}%
//           </span>
//         )}
//       </div>

//       <div className="p-4">
//         <h3 className="font-medium text-gray-800 mb-1 truncate">{name}</h3>

//         <div className="flex items-center gap-3 mb-2">
//           <span className="text-lg font-bold">৳{price}</span>
//           {originalPrice && (
//             <span className="text-sm text-gray-500 line-through">৳{originalPrice}</span>
//           )}
//         </div>

//         {colors.length > 0 && (
//           <div className="flex gap-1.5 flex-wrap">
//             {colors.slice(0, 6).map((color, i) => (
//               <div
//                 key={i}
//                 className="w-5 h-5 rounded-full border border-gray-300"
//                 style={{ backgroundColor: color.hex || color.name || "#000" }}
//                 title={color.name}
//               />
//             ))}
//             {colors.length > 6 && <span className="text-xs text-gray-500">+{colors.length - 6}</span>}
//           </div>
//         )}
//       </div>
//     </Link>
//   );
// };

// export default Item;

