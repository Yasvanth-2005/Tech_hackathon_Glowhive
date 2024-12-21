import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const Admin = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [adminsData, setAdminsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/admin/admins`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
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

  return (
    <Layout>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="w-full flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Admin Management</h1>
        <button
          className="mx-3 px-4 py-2 bg-purple-600 font-semibold rounded-md text-white"
          onClick={() => {
            navigate("/admin/create");
          }}
        >
          + Add Admin
        </button>
      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto   border-gray-300">
            <thead className="bg-purple-600 text-white font-bold">
              <tr>
                <th className="border border-gray-300  text-left px-4 py-2">Sno</th>
                <th className="border border-gray-300  text-left px-4 py-2">Username</th>
                <th className="border border-gray-300  text-left px-4 py-2">Email</th>
                <th className="border border-gray-300  text-left px-4 py-2">Role</th>
              </tr>
            </thead>
            <tbody>
              {adminsData.map((admin, index) => (
                <tr key={admin._id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 text-nowrap text-left py-2 ">{index + 1}</td>
                  <td className="border border-gray-300 px-4 text-nowrap text-left py-2">{admin.username}</td>
                  <td className="border border-gray-300 px-4 text-nowrap text-left py-2">{admin.email}</td>
                  <td className="border border-gray-300 px-4 text-nowrap text-left py-2">{admin.role}</td>
                 
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
};

export default Admin;
