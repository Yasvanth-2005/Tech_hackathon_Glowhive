import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { signInStart, signInSuccess, signInFailure } from "../store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";

const Login = () => {
  const user = useSelector((state) => state.auth.user?.admin);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // To handle any error during login
  const [loading, setLoading] = useState(false); // To show loading state during API call

  const apiUrl = import.meta.env.VITE_API_URL; // Ensure this is set in your .env file

  // Handling form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      email,
      password,
    };
    dispatch(signInStart());

    setLoading(true);
    setError(""); // Reset error on new login attempt

    try {
      const response = await axios.post(`${apiUrl}/admin/login`, payload);

      if (response.status === 200) {
        toast.success("Login successful!");
        console.log("Login successful", response.data);
        dispatch(signInSuccess(response.data));
        navigate("/dashboard");
      } else {
        const message = response.data?.message || "Login failed.";
        setError(message);
        toast.error(message);
      }
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage = err.response?.data?.message || "Invalid credentials!";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="w-[97%] max-w-md p-8 space-y-6 bg-white rounded-lg border border-black shadow-lg">
        <h2 className="text-center text-3xl font-bold text-purple-600">Login</h2>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-500 text-sm text-center mt-2">{error}</div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading} // Disable the button while loading
              className="w-full py-2 px-4 bg-purple-600 text-white font-semibold rounded-md shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </div>
        </form>

        {/* Footer Link */}
        <div className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <a
            href="#"
            className="text-purple-600 hover:text-purple-500 font-semibold"
          >
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
