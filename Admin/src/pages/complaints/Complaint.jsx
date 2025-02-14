import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import toast from "react-hot-toast";

const apiUrl = import.meta.env.VITE_API_URL;

const statusStyles = {
  Pending: "bg-yellow-100 text-yellow-800",
  Rejected: "bg-red-100 text-red-800",
  Solved: "bg-green-100 text-green-800",
  New: "bg-green-100 text-green-800",
};

const ComplaintDashboard = () => {
  const { searchQuery: paramQuery } = useParams();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const token = localStorage.getItem("authToken");

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/complaints/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch complaints");
      }
      const data = await response.json();
      setComplaints(data.complaints);
      toast.success(`Fetched ${data.complaints.length} complaints`);
    } catch (error) {
      toast.error("Failed to fetch complaints");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  useEffect(() => {
    // Sync input field with URL query
    if (paramQuery !== searchQuery) {
      setSearchQuery(paramQuery || "");
    }
  }, [paramQuery]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    navigate(`/complaint/${value}`); // Update URL on search
  };

  const filteredComplaints = complaints.filter(
    (complaint) =>
      complaint.typeOfComplaint
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      complaint.status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      new Date(complaint.createdAt)
        .toLocaleString()
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      complaint.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.userId?.username
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      complaint.acknowledgementId
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const handleStatusChange = async (complaintId, newStatus) => {
    try {
      const response = await fetch(`${apiUrl}/complaints/${complaintId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) {
        throw new Error("Failed to update complaint status");
      }
      setComplaints(
        complaints.map((c) =>
          c._id === complaintId ? { ...c, status: newStatus } : c
        )
      );
      setSelectedComplaint({ ...selectedComplaint, status: newStatus });
      toast.success("status updated successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto ">
        <div className="bg-white shadow-md rounded-lg p-2">
          <h1 className="text-3xl font-bold text-blue-800 mb-6">
            Complaints Dashboard
          </h1>
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search complaints..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              <p className="mt-2 text-blue-600">Loading complaints...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-600">
                  <tr>
                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Type
                    </th> */}
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Critical
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredComplaints.length > 0 ? (
                    filteredComplaints.map((complaint) => (
                      <tr key={complaint._id}>
                        {/* <td className="px-6 py-4 whitespace-nowrap">
                          {complaint.typeOfComplaint}
                        </td> */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {complaint.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(complaint.createdAt).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              statusStyles[complaint.status]
                            }`}
                          >
                            {complaint.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {complaint.isCritical ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              Critical
                            </span>
                          ):<div className="relative left-1/4">-</div>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => {
                              setSelectedComplaint(complaint);
                              setIsModalOpen(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No complaints found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {isModalOpen && selectedComplaint && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <h2 className="text-2xl font-bold text-blue-800 mb-4">
                Complaint Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex gap-2 flex-col">
                <p className="font-semibold">
                AcknowledgementId:{" "}
                    <span className="font-normal">
                      {selectedComplaint.acknowledgementId}
                    </span>
                  </p>
                  <p className="font-semibold">
                    Category:{" "}
                    <span className="font-normal">
                      {selectedComplaint.category}
                    </span>
                  </p>
                  <p className="font-semibold">
                    Workplace:{" "}
                    <span className="font-normal">
                      {selectedComplaint.workplace}
                    </span>
                  </p>
                  <p className="font-semibold">
                    Section:{" "}
                    <span className="font-normal">
                      {selectedComplaint.section}
                    </span>
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="font-semibold">
                    Status:
                    <span
                      className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                        statusStyles[selectedComplaint.status]
                      }`}
                    >
                      {selectedComplaint.status}
                    </span>
                  </p>
                  <p className="font-semibold">
                    Critical:
                    <span
                      className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedComplaint.isCritical
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {selectedComplaint.isCritical ? "Yes" : "No"}
                    </span>
                  </p>
                  <p className="font-semibold">
                    Date & Time:{" "}
                    <span className="font-normal">
                      {new Date(selectedComplaint.createdAt).toLocaleString()}
                    </span>
                  </p>
                </div>
              </div>
              <div className="mb-4">
                <p className="font-semibold">Description:</p>
                <p className="mt-1 text-gray-600">
                  {selectedComplaint.description}
                </p>
              </div>
              {selectedComplaint.photo && (
                <div className="mb-4">
                  <p className="font-semibold">Photo Evidence:</p>
                  <img
                    src={selectedComplaint.photo}
                    alt="Complaint Evidence"
                    className="mt-2 max-w-full rounded-md"
                  />
                </div>
              )}
              <div className="mb-4">
                <p className="font-semibold mb-2">Change Status:</p>
                <div className="flex space-x-2">
                  {["New", "Pending", "Solved", "Rejected"].map((status) => (
                    <button
                      key={status}
                      onClick={() =>
                        handleStatusChange(selectedComplaint._id, status)
                      }
                      className={`px-4 py-2 rounded-md transition duration-300 ${
                        selectedComplaint.status === status
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ComplaintDashboard;
