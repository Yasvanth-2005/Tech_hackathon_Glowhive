import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Layout from "../../components/layout/Layout";
import { useSelector } from "react-redux";

const CreateAdmin = () => {
  const user = useSelector((state) => state.auth.user)
  
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "AO",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL; 

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
// Handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const response = await axios.post(
      `${apiUrl}/admin/register`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      }
    );

    if (response.status === 201) {
      toast.success("Admin created successfully!");
      navigate("/dashboard");
    } else {
      const message = response.data?.message || "Registration failed.";
      setError(message);
      toast.error(message);
    }
  } catch (err) {
    console.error("Registration error:", err);
    const errorMessage = err.response?.data?.message || "Something went wrong!";
    setError(errorMessage);
    toast.error(errorMessage);
  } finally {
    setLoading(false);
  }
};


  return (
    <Layout>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex w-[100%] items-center justify-center mt-10">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-1 p-8 border border-zinc-200 shadow-lg bg-white rounded-md w-full sm:w-[500px]"
        >
          <label htmlFor="username" className="text-black font-bold">
            Name
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your name"
            required
            className="border border-gray-500 rounded-md p-2 w-full placeholder:text-gray-500"
          />
          <br />

          <label htmlFor="email" className="text-black font-bold">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="name@gmail.com"
            required
            className="border border-gray-500 rounded-md p-2 w-full placeholder:text-gray-500"
          />
          <br />

          <label htmlFor="password" className="text-black font-bold">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="........."
              required
              className="border border-gray-500 rounded-md p-2 w-full placeholder:text-gray-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-600"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <br />

          <label htmlFor="role" className="text-black font-bold">
            Role
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="border border-gray-500 rounded-md p-2"
          >
            <option value="AO">AO</option>
            <option value="DSW">DSW</option>
            <option value="HOD">HOD</option>
            <option value="Warden">Warden</option>
          </select>

          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-500 text-white rounded-md mt-6"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default CreateAdmin;
