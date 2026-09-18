import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axios from "axios"; // Import axios
import Header from "./components/Header";
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import PlaceOrder from "./pages/PlaceOrder";
import Orders from "./pages/Orders";
import Verify from "./pages/Verify";
import Product from "./pages/Product";
import Registration from "./pages/Registration";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Privacy from "./pages/Privacy";
import ShippingReturnPolicy from "./pages/ShippingReturnPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";

export default function App() {
  const [stripePromise, setStripePromise] = useState(null);

  useEffect(() => {
    const fetchStripeKey = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/api/stripe/keys");
        if (data && data.publicKey) {
          setStripePromise(loadStripe(data.publicKey));
        }
      } catch (error) {
        console.error("Error fetching Stripe key:", error);
      }
    };

    fetchStripeKey();
  }, []);

  return (
    <>
  <ToastContainer />
  <Header />
  <main className="overflow-hidden text-[#404040]">
    {stripePromise ? (
      <Elements stripe={stripePromise}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/place-order" element={<PlaceOrder />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/shippingReturnPolicy" element={<ShippingReturnPolicy />} />
          <Route path="/termsAndConditions" element={<TermsAndConditions />} />
        </Routes>
      </Elements>
    ) : (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/shippingReturnPolicy" element={<ShippingReturnPolicy />} />
        <Route path="/termsAndConditions" element={<TermsAndConditions />} />
      </Routes>
    )}
  </main>
</>
  );
}
