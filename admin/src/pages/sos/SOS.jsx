import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Layout from "../../components/layout/Layout";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const SOS = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [sosData, setSosData] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const apiUrl = import.meta.env.VITE_API_URL;

  // Fetch SOS data
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/sos`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (response.status === 200) {
        setSosData(response.data);
        toast.success("Data fetched successfully!");
      } else {
        toast.error("Failed to fetch SOS data.");
      }
    } catch (error) {
      console.error("Error fetching SOS data:", error);
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Layout>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="w-full flex items-center justify-between flex-wrap">
        <h1 className="text-2xl font-bold">SOS List</h1>
        <button
          className="mx-2 rounded-md bg-purple-600 text-white px-3 py-2 font-bold"
          onClick={() => navigate("/SOS/new")}
        >
          + Add SOS
        </button>
      </div>
      <div className="mt-6">
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : sosData?.globalSOS?.length > 0 ? (
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Email</th>
                <th className="border border-gray-300 px-4 py-2">Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {sosData?.globalSOS?.map((item, index) => (
                <tr key={index} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.email}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.phno}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center">No SOS data available.</div>
        )}
      </div>
    </Layout>
  );
};

export default SOS;
