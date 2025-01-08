import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";
import Layout from "../../components/layout/Layout";

const Admin = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const token = localStorage.getItem("authToken");
  
  const [adminsData, setAdminsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/admin/admins`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setAdminsData(response.data.admins);
      }
    } catch (error) {
      toast.error("Error while fetching admins data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleEdit = (adminId) => {
    // Implement edit functionality
    navigate(`/admin/edit/${adminId}`);
  };

  const handleDelete = async (adminId) => {
    if (window.confirm("Are you sure you want to delete this admin?")) {
      try {
        const response = await axios.delete(`${apiUrl}/admin/delete/${adminId}`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });

        if (response.status === 200) {
          toast.success("Admin deleted successfully");
          fetchAdmins(); // Refresh the admin list
        }
      } catch (error) {
        toast.error("Error deleting admin");
      }
    }
  };

  const filteredAdmins = adminsData.filter(
    (admin) =>
      admin.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-800 mb-4 md:mb-0">Admin Management</h1>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out flex items-center"
            onClick={() => navigate("/admin/create")}
          >
            <FaPlus className="mr-2" /> Add Admin
          </button>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-4 ">
            <div className="relative">
              <input
                type="text"
                placeholder="Search admins..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-1/2 transform-translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              <p className="mt-2 text-blue-600">Loading admins...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[97%] mx-auto divide-y divide-gray-200">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Username</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Role</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAdmins.map((admin) => (
                    <tr key={admin._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">{admin.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{admin.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{admin.role}</td>
                     
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Admin;

