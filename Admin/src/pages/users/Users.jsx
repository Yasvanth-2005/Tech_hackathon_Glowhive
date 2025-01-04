import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import Layout from "../../components/layout/Layout";

const Users = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const token = localStorage.getItem("authToken")

  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/user/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setUsersData(response.data.users);
      }
    } catch (error) {
      toast.error("Error while fetching users data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = usersData.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.collegeId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="container mx-auto ">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-800 mb-4 md:mb-0">User Management</h1>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-pulse rounded-full h-8 w-8 bg-blue-500"></div>
              <p className="mt-2 text-blue-600">Loading users...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[97%] mx-auto divide-y divide-gray-200">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Username</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase text-nowrap tracking-wider">Phone Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase text-nowrap tracking-wider">College ID</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.phno}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.collegeId}</td>
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

export default Users;