import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import toast from "react-hot-toast";
import { MdClose } from "react-icons/md";

const apiUrl = import.meta.env.VITE_API_URL;

const statusStyles = {
  Pending: "bg-yellow-100 text-yellow-800",
  Rejected: "bg-red-100 text-red-800",
  Solved: "bg-green-100 text-green-800",
  New: "bg-blue-100 text-blue-800",
};

const ComplaintDashboard = () => {
  const { searchQuery: paramQuery } = useParams();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminDescription, setAdminDescription] = useState("");
  const [newStatus, setNewStatus] = useState("");
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
    if (paramQuery !== searchQuery) {
      setSearchQuery(paramQuery || "");
    }
  }, [paramQuery, searchQuery]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    navigate(`/complaint/${value}`);
  };

  const filteredComplaints = complaints.filter(
    (complaint) =>
      complaint.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      new Date(complaint.createdAt)
        .toLocaleString()
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      complaint.workplace?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.userId?.username
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      complaint.acknowledgementId
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const handleStatusChange = async () => {
    if (!newStatus || !adminDescription) {
      toast.error("Please provide both status and description");
      return;
    }

    try {
      setUpdateLoading(true);
      const response = await fetch(
        `${apiUrl}/complaints/${selectedComplaint._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
            admin_description: adminDescription,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update complaint status");
      }
      setComplaints(
        complaints.map((c) =>
          c._id === selectedComplaint._id
            ? { ...c, status: newStatus, admin_description: adminDescription }
            : c
        )
      );
      setSelectedComplaint({
        ...selectedComplaint,
        status: newStatus,
        admin_description: adminDescription,
      });
      toast.success("Status updated successfully");
      setIsModalOpen(false);
      setAdminDescription("");
      setNewStatus("");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto">
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Acknowledgement Id
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Description
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
                      <tr key={complaint._id} className="overflow-hidden">
                        <td className="px-6 py-4">
                          {complaint.acknowledgementId}
                        </td>
                        <td className="px-6 my-4 max-w-[320px] line-clamp-3 max-h-[120px] overflow-hidden">
                          {complaint.description}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              statusStyles[complaint.status]
                            }`}
                          >
                            {complaint.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {complaint.isCritical && (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              Critical
                            </span>
                          )}
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
          <div
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 z-30 bg-black bg-opacity-50 flex justify-center items-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white max-h-[90vh] overflow-y-auto rounded-lg w-full max-w-2xl"
            >
              <div className="w-full bg-white shadow-md mb-4 px-3 py-2 sticky top-0 flex items-center justify-between">
                <div className="text-2xl font-bold text-blue-800 ">
                  Complaint Details
                </div>
                <MdClose
                  className="text-2xl cursor-pointer"
                  onClick={() => setIsModalOpen(false)}
                />
              </div>
              <div className=" p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="col-span-2 max-md:col-span-1">
                    <p className="font-semibold">
                      Acknowledgement Id:{" "}
                      <span className="font-normal">
                        {selectedComplaint.acknowledgementId}
                      </span>
                    </p>
                    <p className="font-semibold">
                      College Id:{" "}
                      <span className="font-normal">
                        {selectedComplaint.userId.collegeId}
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
                  <div className="flex flex-col col-span-1 gap-2">
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
                    {selectedComplaint.dateAndTime && (
                      <p className="font-semibold">
                        Date & Time:{" "}
                        <span className="font-normal">
                          {new Date(
                            selectedComplaint.dateAndTime
                          ).toLocaleString()}
                        </span>
                      </p>
                    )}
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
                      src={selectedComplaint.photo || "/placeholder.svg"}
                      alt="Complaint Evidence"
                      className="mt-2 max-w-full rounded-md w-24 h-24"
                    />
                  </div>
                )}
                {selectedComplaint.admin_description &&
                  selectedComplaint.admin_role && (
                    <div className="mb-4">
                      <p className="font-semibold">Admin Description:</p>
                      <p className="mt-1 text-gray-600">
                        {selectedComplaint.admin_role} :{" "}
                        {selectedComplaint.admin_description}
                      </p>
                    </div>
                  )}
                <div className="mb-4">
                  <p className="font-semibold mb-2">Change Status:</p>
                  <div className="flex flex-col space-y-2">
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">Select new status</option>
                      {["Pending", "Solved", "Rejected"].map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <textarea
                      value={adminDescription}
                      onChange={(e) => setAdminDescription(e.target.value)}
                      placeholder="Provide a description for the status change"
                      className="w-full p-2 border rounded-md"
                      rows="3"
                    ></textarea>
                    <button
                      onClick={handleStatusChange}
                      disabled={
                        newStatus === "" ||
                        adminDescription === "" ||
                        updateLoading
                      }
                      className={`px-4 py-2 rounded-md transition duration-300 ${
                        newStatus === "" ||
                        adminDescription === "" ||
                        updateLoading
                          ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      {updateLoading ? "Updating..." : "Update Status"}
                    </button>
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-1.5 bg-red-600 text-white font-semibold hover:bg-red-700  rounded-md hover:bg-gray-400 transition duration-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ComplaintDashboard;
