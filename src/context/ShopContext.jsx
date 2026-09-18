import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Create context
export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const currency = "S";
  const delivery_charges = 10;
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showLeftColumn, setShowLeftColumn] = useState(true);

  const addTocart = async (itemId, color) => {
    if (!color) {
      toast.error("Please select a color before adding to cart");
      return;
    }
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId][color] = (cartData[itemId][color] || 0) + 1;
    } else {
      cartData[itemId] = { [color]: 1 };
    }
    setCartItems(cartData);
    toast.success("Item added to cart!");
  };

  const getCartCount = () => {
    return Object.values(cartItems).reduce(
      (count, colors) =>
        count +
        Object.values(colors).reduce((subCount, qty) => subCount + qty, 0),
      0
    );
  };

  const updateQuantity = (itemId, color, quantity) => {
    const cartData = structuredClone(cartItems);
    if (cartData[itemId] && cartData[itemId][color] !== undefined) {
      cartData[itemId][color] = quantity;
      setCartItems(cartData);
    }
  };

  const getCartAmount = () => {
    return Object.entries(cartItems).reduce((total, [itemId, colors]) => {
      const item = products.find((product) => product._id === itemId);
      if (item) {
        total += Object.entries(colors).reduce(
          (subTotal, [color, qty]) => subTotal + qty * item.price,
          0
        );
      }
      return total;
    }, 0);
  };

  const getProductsData = async () => {
    try {
      const response = await axios.get(`${backendURL}/api/product/list`);
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error(error.message || "Failed to fetch products");
    }
  };

  const getCategories = async () => {
    try {
      setIsLoadingCategories(true);
      const response = await axios.get(`${backendURL}/api/product-features/index`);
      console.log("Categories API Response:", response.data);
      if (response.data.status === "success") {
        setCategories(response.data.data);
        // Set first category item as default selectedProduct with all images and video
        if (response.data.data.length > 0) {
          const firstCategory = response.data.data[0];
          setSelectedProduct({
            id: firstCategory._id,
            name: firstCategory.name || "Unnamed Category",
            images: firstCategory.images || [], // Full images array
            video: firstCategory.videos?.[0]?.url || null, // First video if available
          });
        }
      } else {
        toast.error(response.data.message || "Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error(error.message || "An error occurred while fetching categories");
    } finally {
      setIsLoadingCategories(false);
    }
  };

  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
    }
    getProductsData();
    getCategories();
  }, []);

  const contextValue = {
    products,
    currency,
    delivery_charges,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    addTocart,
    getCartCount,
    cartItems,
    updateQuantity,
    getCartAmount,
    categories,
    navigate,
    backendURL,
    token,
    setToken,
    isLoadingCategories,
    selectedProduct,
    setSelectedProduct,
    showLeftColumn,
    setShowLeftColumn,
  };

  return <ShopContext.Provider value={contextValue}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;