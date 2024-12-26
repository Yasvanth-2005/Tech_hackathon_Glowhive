import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { FaSearch, FaEye, FaTrashAlt, FaPlus } from "react-icons/fa";
import Layout from "../../components/layout/Layout";

const Notifications = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;
  const user = useSelector((state) => state.auth.user);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/notifications`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });

      if (response.status === 200) {
        setData(response.data.notifications);
        toast.success(`Fetched ${response.data.notifications.length} notifications successfully!`);
      } else {
        toast.error("Failed to fetch notifications.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredNotifications = data?.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sender?.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleView = (notificationId) => {
    const notification = data?.find((item) => item._id === notificationId);
    setSelectedNotification(notification);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNotification(null);
  };

  const handleDelete = async (notificationId) => {
    try {
      const response = await axios.delete(
        `${apiUrl}/notifications/delete/${notificationId}`,
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );
      if (response.status === 200) {
        setData(data.filter((item) => item._id !== notificationId));
        toast.success("Notification deleted successfully!");
      }
    } catch (error) {
      toast.error("Failed to delete notification.");
    }
  };

  const truncateText = (text, length = 50) => {
    return text?.length > length ? `${text.substring(0, length)}...` : text;
  };

  return (
    <Layout>
      <div className="">
        <h1 className="text-3xl font-bold text-purple-800 mb-6">Notifications</h1>
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="relative w-full md:w-64 mb-4 md:mb-0">
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button
            className="bg-purple-600 px-4 py-2 rounded-lg text-white font-bold flex items-center hover:bg-purple-700 transition duration-300"
            onClick={() => navigate("/notifications/create")}
          >
            <FaPlus className="mr-2" /> Add Notification
          </button>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
            <p className="mt-2 text-purple-600">Loading notifications...</p>
          </div>
        ) : (
          <div className="bg-white s  overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-purple-600 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Sender</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredNotifications?.length > 0 ? (
                    filteredNotifications.map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-nowrap">{truncateText(item.title)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-nowrap">{item.sender?.username}</td>
                        <td className="px-6 py-4 text-nowrap">{truncateText(item.description, 20)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleView(item._id)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            <FaEye className="inline-block mr-1" /> View
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FaTrashAlt className="inline-block mr-1" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                        No notifications found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-4 text-purple-800">Notification Details</h2>
            <div className="mb-4">
              <p className="font-semibold">From: <span className="font-normal">{selectedNotification.sender?.username}</span></p>
              <p className="font-semibold">Role: <span className="font-normal">{selectedNotification.sender?.role}</span></p>
            </div>
            <div className="mb-4">
              <p className="font-semibold">Title: <span className="font-normal">{selectedNotification.title}</span></p>
              <p className="font-semibold">Description: <span className="font-normal">{selectedNotification.description}</span></p>
            </div>
            <div className="mb-4">
              <p className="font-semibold">Links:</p>
              <ul className="list-disc pl-5">
                {selectedNotification.links?.map((link, index) => (
                  <li key={index}>
                    <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6 text-right">
              <button
                className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition duration-300"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Notifications;

