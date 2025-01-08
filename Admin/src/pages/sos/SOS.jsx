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
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ phno: "", email: "", name: "" });
  const [currentEditId, setCurrentEditId] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const token = localStorage.getItem("authToken")
  const apiUrl = import.meta.env.VITE_API_URL;

  // Fetch SOS data
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/sos`, {
        headers: {
          Authorization: `Bearer ${token}`,
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

  // Delete SOS entry
  const deleteSOS = async (id) => {
    try {
      const response = await axios.delete(`${apiUrl}/sos/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        toast.success("SOS deleted successfully!");
        fetchData(); // Refresh data
      } else {
        toast.error("Failed to delete SOS.");
      }
    } catch (error) {
      console.error("Error deleting SOS:", error);
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  // Open Edit Modal
  const openEditModal = (id, data) => {
    setCurrentEditId(id);
    setEditFormData(data);
    setEditModalOpen(true);
  };

  // Close Edit Modal
  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditFormData({ phno: "", email: "", name: "" });
    setCurrentEditId(null);
  };

  // Submit Edited Data
  const submitEdit = async () => {
    try {
      const response = await axios.patch(`${apiUrl}/sos/edit/${currentEditId}`, editFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        toast.success("SOS updated successfully!");
        fetchData(); // Refresh data
        closeEditModal();
      } else {
        toast.error("Failed to update SOS.");
      }
    } catch (error) {
      console.error("Error updating SOS:", error);
      toast.error(error.response?.data?.message || "Something went wrong.");
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
          className="mx-2 rounded-md bg-blue-600 text-white px-3 py-2 font-bold"
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
                <tr className="bg-blue-600 text-white font-bold">
                  <th className="px-4 py-2 text-left">Sno</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Phone Number</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sosData?.globalSOS?.map((item, index) => (
                  <tr key={index} className="text-center border border-gray-300">
                    <td className="px-4 py-2 text-left">{index + 1}</td>
                    <td className="px-4 py-2 text-left">{item.name}</td>
                    <td className="px-4 py-2 text-left">{item.email}</td>
                    <td className="px-4 py-2 text-left">{item.phno}</td>
                    <td className="px-4 py-2 text-left">
                      <button
                        className="mx-1 px-3 py-1 rounded-md bg-blue-600 text-white"
                        onClick={() =>
                          openEditModal(item._id, { phno: item.phno, email: item.email, name: item.name })
                        }
                      >
                        Edit
                      </button>
                      <button
                        className="mx-1 px-3 py-1 rounded-md bg-red-600 text-white"
                        onClick={() => deleteSOS(item._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center">No SOS data available.</div>
        )}
      </div>

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Edit SOS</h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Name</label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Email</label>
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Phone Number</label>
                <input
                  type="text"
                  value={editFormData.phno}
                  onChange={(e) => setEditFormData({ ...editFormData, phno: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={submitEdit}
                  className="mx-2 px-4 py-2 bg-green-600 text-white rounded-md"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 bg-gray-400 text-white rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default SOS;
