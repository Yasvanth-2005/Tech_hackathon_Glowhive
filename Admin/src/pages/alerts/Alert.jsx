import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import Layout from "../../components/layout/Layout";

const Alert = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const token = localStorage.getItem("authToken");

  const [alertsData, setAlertsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/sos/alerts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setAlertsData(response.data.alerts);
      }
    } catch (error) {
      toast.error("Error while fetching alerts data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const filteredAlerts = alertsData.filter(
    (alert) =>
      alert.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewDetails = (alertId) => {
    navigate(`/sos/alerts/${alertId}`);
  };

  const handleDownload = async (url, filename) => {
    try {
      const response = await axios.get(url, {
        responseType: "blob",
      });
      const blob = new Blob([response.data]);
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast.error("Failed to download file");
    }
  };

  const toggleAlertStatus = async (alertId, currentStatus) => {
    const newStatus = currentStatus === "Solved" ? "Unsolved" : "Solved";
    try {
      const response = await axios.patch(
        `${apiUrl}/sos/edit/alert/${alertId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Update the local state to reflect the change
        const updatedAlerts = alertsData.map((alert) =>
          alert._id === alertId ? { ...alert, status: newStatus } : alert
        );
        setAlertsData(updatedAlerts);
        toast.success(`Status updated to ${newStatus}`);
      }
    } catch (error) {
      toast.error("Error updating status");
    }
  };

  return (
    <Layout>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-800 mb-4 md:mb-0">Alert Management</h1>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search alerts..."
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
              <p className="mt-2 text-blue-600">Loading alerts...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[97%] mx-auto divide-y divide-gray-200">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Username</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Evidence</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAlerts.map((alert) => (
                    <tr key={alert._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">{alert.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{alert.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => {
                            if (alert.audioLink) {
                              handleDownload(alert.audioLink, `${alert.username}_audio.mp3`);
                            } else if (alert.videoLink) {
                              handleDownload(alert.videoLink, `${alert.username}_video.mp4`);
                            }
                          }}
                          className="text-blue-600 hover:underline"
                        >
                          {alert.audioLink && "Download Audio"}
                          {alert.videoLink && "Download Video"}
                          {!alert.audioLink && !alert.videoLink && "No Evidence"}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a target="_blank" className="text-blue-600 hover:underline" href={`https://www.google.com/maps/search/?api=1&query=${alert.location[0]},${alert.location[1]}`}>View Location</a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{alert.status}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
                          onClick={() => toggleAlertStatus(alert._id, alert.status)}
                        >
                          {alert.status === "Solved" ? "Mark as Unsolved" : "Mark as Solved"}
                        </button>
                      </td>
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

export default Alert;
