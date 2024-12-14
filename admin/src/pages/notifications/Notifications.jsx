import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { FaSearch, FaEdit, FaTrashAlt, FaEye } from "react-icons/fa";

const Notifications = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editNotification, setEditNotification] = useState({
    title: "",
    description: "",
    links: [""],
    sender: "",
  });
  const apiUrl = import.meta.env.VITE_API_URL;
  const user = useSelector((state) => state.auth.user);

  // Fetch notifications
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/notifications`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
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
      item.sender?.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle view notification
  const handleView = (notificationId) => {
    const notification = data?.find((item) => item._id === notificationId);
    setSelectedNotification(notification);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNotification(null);
  };

  // Handle edit notification
  const handleEdit = (notificationId) => {
    const notification = data?.find((item) => item._id === notificationId);
    setEditNotification({
      title: notification?.title || "",
      description: notification?.description || "",
      links: notification?.links || [""],
      sender: notification?.sender?._id || "",
    });
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditNotification((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async () => {
    try {
      const response = await axios.put(
        `${apiUrl}/notifications/edit/${selectedNotification._id}`,
        editNotification,
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );

      if (response.status === 200) {
        toast.success("Notification updated successfully!");
        fetchData(); // Refresh data after editing
        setIsEditModalOpen(false);
      }
    } catch (error) {
      toast.error("Failed to update notification.");
    }
  };

  // Handle delete notification
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
      <div className="w-full flex-wrap flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-fit inline-block">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-[120px] border sm:w-fit border-gray-500 placeholder-gray-500 p-1 px-2 pr-[24px] my-1 rounded-md"
            />
            <FaSearch className="absolute right-0 text-[15px] top-[0px] text-gray-500 m-4" />
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-purple-600 h-[40px] text-white">
            <tr>
              <td className="ps-3">Sno</td>
              <td className="ps-3">Title</td>
              <td className="ps-3">Sender</td>
              <td className="ps-3">Description</td>
              <td className="ps-3">Actions</td>
            </tr>
          </thead>

          <tbody>
            {filteredNotifications?.length > 0 ? (
              filteredNotifications.map((item, index) => (
                <tr key={item._id} className="border min-h-[40px]">
                  <td className="ps-3 py-2">{index + 1}</td>
                  <td className="ps-3 py-2">{truncateText(item.title)}</td>
                  <td className="ps-3 py-2">{item.sender?.username}</td>
                  <td className="ps-3 py-2">
                    {truncateText(item.description)}
                  </td>
                  <td className="ps-3 py-2 flex items-center gap-2">
                    <FaEye
                      className="text-blue-600 text-[20px] mx-2 cursor-pointer"
                      onClick={() => handleView(item._id)}
                    />
                    <FaEdit
                      className="text-yellow-600 text-[20px] mx-2 cursor-pointer"
                      onClick={() => handleEdit(item._id)}
                    />
                    <FaTrashAlt
                      className="text-red-600 text-[20px] mx-2 cursor-pointer"
                      onClick={() => handleDelete(item._id)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-2">
                  No notifications found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {loading && (
          <div className="text-center text-2xl font-bold py-10">
            Data is Loading....
          </div>
        )}
      </div>

      {/* Modal to show notification details */}
      {isModalOpen && selectedNotification && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-[97%] max-w-[600px]">
            <h2 className="text-xl font-bold mb-4">Notification Details</h2>
            <div className="mb-4">
              <p>
                <strong>From:</strong> {selectedNotification.sender?.username}
              </p>
              <p>
                <strong>Role:</strong> {selectedNotification.sender?.role}
              </p>
            </div>
            <div className="mb-4">
              <p>
                <strong>Title:</strong> {selectedNotification.title}
              </p>
              <p>
                <strong>Description:</strong> {selectedNotification.description}
              </p>
            </div>
            <div className="mb-4">
              <p>
                <strong>Links:</strong>
                <ul>
                  {selectedNotification.links?.map((link, index) => (
                    <li key={index}>
                      <a href={link} target="_blank" rel="noopener noreferrer">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </p>
            </div>
            <div className="mt-4 text-right">
              <button
                className="px-4 py-2 bg-gray-300 text-black rounded-md"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for editing notification */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-[97%] max-w-[600px]">
            <h2 className="text-xl font-bold mb-4">Edit Notification</h2>
            <div className="mb-4">
              <input
                type="text"
                name="title"
                value={editNotification.title}
                onChange={handleEditChange}
                placeholder="Title"
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <textarea
                name="description"
                value={editNotification.description}
                onChange={handleEditChange}
                placeholder="Description"
                className="w-full p-2 border rounded-md"
                rows="4"
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                name="links"
                value={editNotification.links[0]}
                onChange={(e) =>
                  setEditNotification({
                    ...editNotification,
                    links: [e.target.value],
                  })
                }
                placeholder="Link"
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="mt-4 text-right">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
                onClick={handleEditSave}
              >
                Save
              </button>
              <button
                className="px-4 py-2 bg-gray-300 text-black rounded-md ml-2"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Notifications;
