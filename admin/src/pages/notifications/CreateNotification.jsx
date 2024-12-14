import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Layout from "../../components/layout/Layout";

const CreateNotification = () => {
  const user = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    links: [""],
    sender: user?.admin?._id || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL;

  // Handle form input changes
  const handleChange = (e, index = null) => {
    const { name, value } = e.target;
    if (name === "links" && index !== null) {
      const updatedLinks = [...formData.links];
      updatedLinks[index] = value;
      setFormData((prevData) => ({ ...prevData, links: updatedLinks }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const addLink = () => {
    setFormData((prevData) => ({
      ...prevData,
      links: [...prevData.links, ""],
    }));
  };

  const removeLink = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      links: prevData.links.filter((_, i) => i !== index),
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${apiUrl}/notifications/new`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response.status === 201) {
        toast.success("Notification sent successfully!");
        setFormData({
          title: "",
          description: "",
          links: [""],
          sender: user?.id || "",
        });
      } else {
        const message =
          response.data?.message || "Failed to send notification.";
        setError(message);
        toast.error(message);
      }
    } catch (err) {
      console.error("Notification error:", err);
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
          <label htmlFor="title" className="text-black font-bold">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter the notification title"
            required
            className="border border-gray-500 rounded-md p-2 w-full placeholder:text-gray-500"
          />
          <br />

          <label htmlFor="description" className="text-black font-bold">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter the notification description"
            required
            className="border border-gray-500 rounded-md p-2 w-full placeholder:text-gray-500"
            rows={4}
          ></textarea>
          <br />

          <label className="text-black font-bold">Links</label>
          {formData.links.map((link, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                name="links"
                value={link}
                onChange={(e) => handleChange(e, index)}
                placeholder={`Enter link ${index + 1}`}
                required
                className="border border-gray-500 rounded-md p-2 w-full placeholder:text-gray-500"
              />
              {formData.links.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeLink(index)}
                  className="bg-red-500 px-2 py-1 rounded-md text-white  mt-2"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <div className="w-full flex items-center justify-end">
            <button
              type="button"
              onClick={addLink}
              className="bg-blue-500 px-2 py-1 rounded-md text-white  mt-2"
            >
              Add another link
            </button>
          </div>

          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-purple-500 text-white rounded-md mt-6"
          >
            {loading ? "Sending..." : "Send Notification"}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default CreateNotification;
