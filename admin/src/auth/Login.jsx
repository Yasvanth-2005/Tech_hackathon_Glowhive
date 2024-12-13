import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate= useNavigate()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({ email, password, role });
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="w-[97%] max-w-md p-8 space-y-6 bg-white rounded-lg border border-black shadow-lg">
        <h2 className="text-center text-3xl font-bold text-purple-600">Login</h2>
        <form onSubmit={handleSubmit} className="mt-8  space-y-4">
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

          {/* Role Selection Field */}
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              onClick={() => navigate("/dashboard")}
              className="w-full py-2 px-4 bg-purple-600 text-white font-semibold rounded-md shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Log In
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
