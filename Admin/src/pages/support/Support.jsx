import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

const Support = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState(null); // For editing
  const [formData, setFormData] = useState({ name: "", phno: "", position: "" });
  const apiUrl = import.meta.env.VITE_API_URL;
  const user = useSelector((state) => state.auth.user);
  const token = localStorage.getItem("authToken")

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/support`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setMembers(response.data.supportStaff || []);
        toast.success("Fetching successful");
      } else {
        toast.error("Failed to fetch support staff data.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const deleteMember = async (id) => {
    try {
      const response = await axios.delete(`${apiUrl}/support/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setMembers(members.filter((member) => member._id !== id));
        toast.success("Member deleted successfully.");
      } else {
        toast.error("Failed to delete member.");
      }
    } catch (error) {
      console.error("Error deleting member:", error);
      toast.error("Something went wrong.");
    }
  };

  const openEditModal = (member) => {
    setCurrentMember(member);
    setFormData({ name: member.name, phno: member.phno, position: member.position });
    setIsModalOpen(true);
  };

  const updateMember = async (id) => {
    try {
      const response = await axios.patch(`${apiUrl}/support/edit/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setMembers(
          members.map((member) =>
            member._id === id ? { ...member, ...formData } : member
          )
        );
        toast.success("Member updated successfully.");
        setIsModalOpen(false);
      } else {
        toast.error("Failed to update member.");
      }
    } catch (error) {
      console.error("Error updating member:", error);
      toast.error("Something went wrong.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Layout>
      <div className="w-full flex items-center justify-between flex-wrap mb-6">
        <h1 className="text-2xl font-bold">Support Staff</h1>
        <button
          className="mx-2 rounded-md bg-blue-600 text-white px-3 py-2 font-bold"
          onClick={() => navigate("/support/add")}
        >
          + Add Support
        </button>
      </div>

      <div className="w-full">
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : members.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-nowrap text-left">
              <thead className="bg-blue-600 font-bold text-white text-nowrap">
                <tr>
                  <th className="text-nowrap px-4 py-2">Name</th>
                  <th className="text-nowrap px-4 py-2">Phone Number</th>
                  <th className="text-nowrap px-4 py-2">Position</th>
                  <th className="text-nowrap px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member._id} className="hover:bg-gray-50">
                    <td className="text-nowrap px-4 py-2">{member.name}</td>
                    <td className="text-nowrap px-4 py-2">{member.phno}</td>
                    <td className="text-nowrap px-4 py-2">{member.position}</td>
                    <td className="text-nowrap px-4 py-2">
                      <button
                        className="bg-blue-200 px-2 py-1 text-[12px] rounded-md text-blue-600 font-bold mx-2"
                        onClick={() => openEditModal(member)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-200 px-2 py-1 text-[12px] rounded-md text-red-600 font-bold mx-2"
                        onClick={() => deleteMember(member._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center">No support staff data available.</div>
        )}
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-[600px]">
            <h2 className="text-xl font-bold mb-4">Edit Member</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateMember(currentMember._id);
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-bold mb-1">Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-1">Phone Number</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.phno}
                  onChange={(e) =>
                    setFormData({ ...formData, phno: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-1">Position</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.position}
                  onChange={(e) =>
                    setFormData({ ...formData, position: e.target.value })
                  }
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md mr-2"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Support;
