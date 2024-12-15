import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { FaSearch, FaEdit, FaTrashAlt, FaEye } from "react-icons/fa";

const Complaint = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;
  const user = useSelector((state) => state.auth.user);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/complaints/admin`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (response.status === 200) {
        setData(response.data);
        toast.success(
          `Fetched ${response.data.Complaints?.length} complaints successfully!`
        );
      } else {
        toast.error("Failed to fetch complaints.");
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

  const filteredComplaints = data?.complaints?.filter(
    (item) =>
      item.typeOfComplaint?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      new Date(item.createdAt)
        .toLocaleString()
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.userId?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle view complaint
  const handleView = (complaintId) => {
    const complaint = data?.complaints?.find(
      (item) => item._id === complaintId
    );
    setSelectedComplaint(complaint);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedComplaint(null);
  };

  // Handle status change to Rejected
  const handleReject = async () => {
    try {
      await axios.put(
        `${apiUrl}/complaints/${selectedComplaint._id}`, // Using _id for put request
        { status: "Rejected" }, // Set the status to "Rejected"
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );
      toast.success("Complaint rejected successfully!");
      window.location.reload();
      setSelectedComplaint({ ...selectedComplaint, status: "Rejected" });
    } catch (error) {
      toast.error("Failed to reject complaint.");
    }
  };

  // Handle status change to Solved
  const handleSolve = async () => {
    try {
      await axios.put(
        `${apiUrl}/complaints/${selectedComplaint._id}`, // Using _id for patch request
        { status: "Solved" }, // Set the status to "Solved"
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );
      toast.success("Complaint solved successfully!");
      window.location.reload();
      setSelectedComplaint({ ...selectedComplaint, status: "Solved" });
    } catch (error) {
      toast.error("Failed to mark complaint as solved.");
    }
  };

  const statusStyle = (status) => {
    if (status === "Pending") {
      return "bg-yellow-200 text-yellow-800";
    }
    if (status === "Rejected") {
      return "bg-red-200 text-red-800";
    }
    if (status === "Solved") {
      return "bg-green-200 text-green-800";
    }
  };

  return (
    <Layout>
      <div className="w-full flex-wrap flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-fit inline-block">
            <input
              type="text"
              placeholder="search...."
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
              <td className="ps-3">Type</td>
              <td className="ps-3">Category</td>
              <td className="ps-3">Date</td>
              <td className="ps-3">Status</td>
              <td className="ps-3">Actions</td>
            </tr>
          </thead>

          <tbody>
            {filteredComplaints?.length > 0 ? (
              filteredComplaints.map((item, index) => (
                <tr key={index} className="border min-h-[40px]">
                  <td className="ps-3 py-2">{index + 1}</td>
                  <td className="ps-3 py-2">{item.typeOfComplaint}</td>
                  <td className="ps-3 py-2">{item.category}</td>
                  <td className="ps-3 py-2">
                    {new Date(item.createdAt).toLocaleString()}
                  </td>
                  <td className="ps-3 py-2">
                    <span
                      className={`${statusStyle(
                        item.status
                      )} font-bold px-2 py-1 border rounded-lg shadow`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="ps-3 py-2 flex  items-center gap-2">
                    <div
                      className="bg-purple-200 text-purple-800 px-2 py-1 rounded-md text-left text-[20px] mx-2 cursor-pointer"
                      onClick={() => handleView(item._id)}
                    >View</div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-2">
                  No complaints found
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
        {data?.complaints?.length === 0 && !loading && (
          <div className="text-center text-2xl font-bold py-10">
            No complaints available
          </div>
        )}
      </div>

      {/* Modal to show complaint details */}
      {isModalOpen && selectedComplaint && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-[97%] max-w-[600px]">
            <h2 className="text-xl font-bold mb-4">Complaint Details</h2>
            <div className="mb-4">
              <p>
                <strong>From:</strong> {selectedComplaint.userId?.username}
              </p>
              <p>
                <strong>Email:</strong> {selectedComplaint.userId?.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedComplaint.userId?.phno}
              </p>
            </div>
            <div className="mb-4">
              <p>
                <strong>Type:</strong> {selectedComplaint.typeOfComplaint}
              </p>
              <p>
                <strong>Category:</strong> {selectedComplaint.category}
              </p>
              <p>
                <strong>Description:</strong> {selectedComplaint.description}
              </p>
              <p>
                <strong>Location:</strong> {selectedComplaint.location}
              </p>
            </div>
            <div className="mb-4">
              <p>
                <strong>Date:</strong>{" "}
                {new Date(selectedComplaint.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Status:</strong> {selectedComplaint.status}
              </p>
            </div>
            <div className="flex gap-4 mt-4">
              {selectedComplaint.status === "Pending" ? (
                <>
                  <button
                    onClick={handleReject}
                    className="px-4 py-2 bg-red-600 text-white rounded-md"
                  >
                    Reject
                  </button>
                  <button
                    onClick={handleSolve}
                    className="px-4 py-2 bg-green-600 text-white rounded-md"
                  >
                    Solve
                  </button>
                </>
              ) : (
                <button
                  className="px-4 py-2 bg-gray-400 text-white rounded-md cursor-not-allowed"
                  disabled
                >
                  {selectedComplaint.status}
                </button>
              )}
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
    </Layout>
  );
};

export default Complaint;
