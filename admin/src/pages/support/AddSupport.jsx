import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Layout from "../../components/layout/Layout";
import { useSelector } from "react-redux";

const AddSupport = () => {
  const [formData, setFormData] = useState({
    name: "",
    phno: "",
    position: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const user = useSelector((state) => state.auth.user);

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
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${apiUrl}/support/new`, formData, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (response.status === 201) {
        toast.success("Support member added successfully!");
        setFormData({
          name: "",
          phno: "",
          position: "",
        });
      } else {
        const message =
          response.data?.message || "Failed to add support member.";
        setError(message);
        toast.error(message);
      }
    } catch (err) {
      console.error("Error adding support member:", err);
      const errorMessage =
        err.response?.data?.message || "Something went wrong!";
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
          <label htmlFor="name" className="text-black font-semibold">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter the name"
            required
            className="border border-gray-500 rounded-md p-2 w-full placeholder:text-gray-500"
          />
          <br />

          <label htmlFor="phno" className="text-black font-semibold">
            Phone Number <span className="text-zinc-400">(whatsapp)</span>
          </label>
          <input
            type="tel"
            name="phno"
            value={formData.phno}
            onChange={handleChange}
            placeholder="Enter the phone number"
            required
            className="border border-gray-500 rounded-md p-2 w-full placeholder:text-gray-500"
          />
          <br />

          <label htmlFor="position" className="text-black font-semibold">
            Position
          </label>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            placeholder="Enter the position"
            required
            className="border border-gray-500 rounded-md p-2 w-full placeholder:text-gray-500"
          />
          <br />

          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-purple-500 text-white rounded-md mt-6"
          >
            {loading ? "Adding..." : "Add Support Member"}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default AddSupport;
