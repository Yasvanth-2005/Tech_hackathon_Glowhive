import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { signInStart, signInSuccess } from "../store/authSlice";
import { useDispatch } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  // Toggle Password Visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Handling form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      email,
      password,
    };
    dispatch(signInStart());

    setLoading(true);
    setError("");

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
      const errorMessage =
        err.response?.data?.message || "Invalid credentials!";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="w-[93%] max-w-md p-8 space-y-6 bg-white rounded-lg border border-black shadow-lg">
        <h2 className="text-center text-3xl font-bold text-blue-600">
          Login
        </h2>
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
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-9 text-gray-500 focus:outline-none"
            >
              {showPassword ? (
                <AiFillEyeInvisible size={20} />
              ) : (
                <AiFillEye size={20} />
              )}
            </button>
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
              className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
