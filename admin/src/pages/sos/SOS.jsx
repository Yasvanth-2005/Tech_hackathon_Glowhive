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
      <div className="w-full flex flex-wrap items-center justify-between">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">SOS List</h1>
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
          <div className="overflow-x-auto">
            {/* Responsive table container */}
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-purple-600 text-white font-bold">
                  <th className="px-4  text-nowrap py-2 text-left">Sno</th>
                  <th className="px-4  text-nowrap py-2 text-left">Name</th>
                  <th className="px-4  text-nowrap py-2 text-left">Email</th>
                  <th className="px-4  text-nowrap py-2 text-left">Phone Number</th>
                </tr>
              </thead>
              <tbody>
                {sosData?.globalSOS?.map((item, index) => (
                  <tr
                    key={index}
                    className="text-center border border-gray-300"
                  >
                    <td className="px-4  text-nowrap py-2 text-left">{index + 1}</td>
                    <td className="px-4  text-nowrap py-2 text-left">{item.name}</td>
                    <td className="px-4  text-nowrap py-2 text-left">{item.email}</td>
                    <td className="px-4  text-nowrap py-2 text-left">{item.phno}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center">No SOS data available.</div>
        )}
      </div>
    </Layout>
  );
};

export default SOS;
