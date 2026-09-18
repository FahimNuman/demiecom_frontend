import { useContext, useEffect, useState } from "react";
import loginImg from "../assets/Login.png";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";
// import { useNavigate } from "react-router-dom";

const Login = () => {
  const [currState, setCurrState] = useState("Login");
  const { token, setToken, backendURL, navigate } = useContext(ShopContext);
  // const navigate = useNavigate();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    console.log("Data being sent:", { name, email, password });

    try {
      if (currState === "Sign Up") {
        const response = await axios.post(`${backendURL}/api/user/register`, {
          name,
          email,
          password,
        });

        console.log("Register Response:", response.data);

        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          toast.success("Registration successful!");
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(`${backendURL}/api/user/login`, {
          email,
          password,
        });

        console.log("Login Response:", response.data);

        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          toast.success("Login successful!");
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.error("Server Error:", error.response?.data || error.message);
      toast.error(
        error.response?.data?.message || "Something went wrong. Try again."
      );
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <section className="absolute top-0 left-0 h-full w-full z-50 bg-gradient-to-r from-blue-50 to-blue-100">
      {/* <Registration /> */}
      <div className="flex h-full w-full">
        {/* Form Section */}
        <div className="flex w-full sm:w-1/2 items-center justify-center">
          <form
            onSubmit={onSubmitHandler}
            className="flex flex-col items-center w-[90%] sm:max-w-md m-auto gap-y-6 text-gray-800 bg-white p-8 rounded-lg shadow-lg"
          >
            <div className="w-full mb-4">
              <h3 className="text-3xl font-bold text-center text-rose-600">
                {currState}
              </h3>
            </div>

            {currState === "Sign Up" && (
              <div className="w-full">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  placeholder="Name"
                  required
                  className="w-full px-4 py-2 ring-1 ring-gray-300 focus:ring-2 focus:ring-blue-500 rounded bg-white mt-1 shadow-sm"
                />
              </div>
            )}

            <div className="w-full">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="Email"
                required
                className="w-full px-4 py-2 ring-1 ring-gray-300 focus:ring-2 focus:ring-blue-500 rounded bg-white mt-1 shadow-sm"
              />
            </div>

            <div className="w-full">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder="Password"
                required
                className="w-full px-4 py-2 ring-1 ring-gray-300 focus:ring-2 focus:ring-blue-500 rounded bg-white mt-1 shadow-sm"
              />
            </div>

            <button className="w-full py-2 text-white bg-rose-500 hover:bg-rose-700 rounded transition-all duration-300 shadow">
              {currState === "Sign Up" ? "Sign Up" : "Login"}
            </button>

            <div className="w-full flex flex-col items-center gap-y-3 mt-4">
              <div className="text-sm text-blue-500 underline cursor-pointer">
                Forgot your password?
              </div>
              {currState === "Login" ? (
                <div className="text-sm text-gray-600">
                  Don’t have an account?{" "}
                  <span
                    onClick={() => navigate("/register")}
                    className="text-blue-600 cursor-pointer underline"
                  >
                    Create account
                  </span>
                </div>
              ) : (
                <div className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <span
                    onClick={() => setCurrState("Login")}
                    className="text-rose-600 cursor-pointer underline"
                  >
                    Login
                  </span>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Image Section */}
        <div className="w-1/2 hidden sm:block">
          <img
            src={loginImg}
            alt="Login Illustration"
            className="object-cover h-full w-full rounded-l-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default Login;
