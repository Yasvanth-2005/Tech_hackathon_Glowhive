import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { FaSearch, FaEye, FaTrashAlt, FaPen } from "react-icons/fa";
import Layout from "../../components/layout/Layout";

const Notifications = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    links: "",
    sender:user.admin._id
  });
  const token = localStorage.getItem("authToken");

  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setData(response.data.notifications);
        toast.success(
          `Fetched ${response.data.notifications.length} notifications successfully!`
        );
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
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedNotification(null);
  };

  const handleDelete = async (notificationId) => {
    try {
      const response = await axios.delete(
        `${apiUrl}/notifications/delete/${notificationId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
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

  const handleOpenEditModal = (notificationId) => {
    const notification = data?.find((item) => item._id === notificationId);
    setSelectedNotification(notification);
    setEditFormData({
      title: notification.title,
      description: notification.description,
      links: notification.links.join(", "),
    });
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedNotification(null);
    setEditFormData({ title: "", description: "", links: "" });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: editFormData.title,
      description: editFormData.description,
      links: editFormData.links.split(",").map((link) => link.trim()),
      sender: user?.id,
    };

    try {
      const response = await axios.patch(
        `${apiUrl}/notifications/edit/${selectedNotification._id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        toast.success("Notification updated successfully!");
        fetchData(); // Refresh notifications list
        handleCloseEditModal();
      } else {
        toast.error("Failed to update notification.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  const truncateText = (text, length = 50) => {
    return text?.length > length ? `${text.substring(0, length)}...` : text;
  };

  return (
    <Layout>
      <div>
        <h1 className="text-3xl font-bold text-blue-800 mb-6">Notifications</h1>
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="relative w-full md:w-64 mb-4 md:mb-0">
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button
            className="bg-blue-600 px-4 py-2 rounded-lg text-white font-bold flex items-center hover:bg-blue-700 transition duration-300"
            onClick={() => navigate("/notifications/create")}
          >
            + Add Notification
          </button>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-blue-600">Loading notifications...</p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Sender
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredNotifications?.length > 0 ? (
                    filteredNotifications.map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4  text-nowrap">
                          {truncateText(item.title)}
                        </td>
                        <td className="px-6 py-4  text-nowrap">
                          {item.sender?.username}
                        </td>
                        <td className="px-6 py-4 text-nowrap">
                          {truncateText(item.description, 20)}
                        </td>
                        <td className="px-6 py-4  text-nowrap text-sm font-medium flex gap-3">
                          <button
                            onClick={() => handleView(item._id)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(item._id)}
                            className="text-yellow-500 hover:text-yellow-700"
                          >
                            <FaPen />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FaTrashAlt />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-4 text-center text-gray-500"
                      >
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

      {/* View Modal */}
      {isViewModalOpen && selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-4 text-blue-800">
              Notification Details
            </h2>
            <p>
              <strong>Title:</strong> {selectedNotification.title}
            </p>
            <p>
              <strong>Description:</strong> {selectedNotification.description}
            </p>
            <p>
              <strong>Links:</strong> {selectedNotification.links?.join(", ")}
            </p>
            <button
              onClick={handleCloseViewModal}
              className="bg-gray-600 px-4 py-2 text-white rounded-lg font-semibold hover:bg-gray-800 transition duration-300 mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-blue-800">
              Edit Notification
            </h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-semibold mb-2"
                  htmlFor="title"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={editFormData.title}
                  onChange={handleEditFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-semibold mb-2"
                  htmlFor="description"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditFormChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-semibold mb-2"
                  htmlFor="links"
                >
                  Links (comma-separated)
                </label>
                <input
                  type="text"
                  id="links"
                  name="links"
                  value={editFormData.links}
                  onChange={handleEditFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="bg-gray-600 px-4 py-2 text-white rounded-lg font-semibold hover:bg-gray-800 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 px-4 py-2 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Notifications;
