import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Layout from "../../components/layout/Layout";
import { FaSearch, FaUserCircle } from "react-icons/fa";
import { MdDashboard, MdPeople, MdReport, MdCheckCircle } from "react-icons/md";
import axios from "axios";
import { ClipLoader } from "react-spinners";

const StatCard = ({ title, count, icon: Icon, bgColor, loading }) => (
  <div
    className={`p-6 rounded-lg shadow-md transition-transform transform hover:scale-105 flex items-center ${bgColor}`}
  >
    {loading ? (
      <div className="animate-pulse flex-1">
        <div className="h-6 bg-gray-300 rounded w-1/3 mb-2"></div>
        <div className="h-8 bg-gray-300 rounded w-1/2"></div>
      </div>
    ) : (
      <div className="flex items-center justify-between w-full">
        <div>
          <h2 className="text-sm font-semibold text-gray-200 mb-1">{title}</h2>
          <p className="text-2xl font-bold text-white">{count}</p>
        </div>
        <Icon className="text-3xl text-white opacity-80" />
      </div>
    )}
  </div>
);

const Dashboard = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("authToken");
  const user = useSelector((state) => state.auth.user?.admin);
  const [searchTerm, setSearchTerm] = useState("");
  const [complaints, setComplaints] = useState([]);

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    solved: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get(`${apiUrl}/complaints/admin`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const fetchedComplaints = response.data.complaints;

        const criticalComplaints = fetchedComplaints.filter(
          (complaint) => complaint.isCritical
        );

        const total = fetchedComplaints.length;
        const pending = fetchedComplaints.filter(
          (complaint) => complaint.status.toLowerCase() === "pending"
        ).length;
        const solved = fetchedComplaints.filter(
          (complaint) => complaint.status.toLowerCase() === "solved"
        ).length;

        setComplaints(criticalComplaints);
        setStats({ total, pending, solved });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching complaints:", error);
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // const filteredData = complaints.filter((item) =>
  //   item.statement.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  const filteredData = complaints.filter(
    (item) =>
      item?.statement?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <ClipLoader size={50} color="#3498db" />
      </div>
    );
  }

  return (
    <Layout>
      <div className="dashboard bg-gray-100 p-2 min-h-screen">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-sm text-gray-600">
            Welcome back, {user.username}!
          </p>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            title="Total Critical Complaints"
            count={stats.total}
            icon={MdReport}
            bgColor="bg-red-500"
            loading={loading}
          />
          <StatCard
            title="Pending Complaints"
            count={stats.pending}
            icon={MdDashboard}
            bgColor="bg-yellow-500"
            loading={loading}
          />
          <StatCard
            title="Solved Complaints"
            count={stats.solved}
            icon={MdCheckCircle}
            bgColor="bg-green-500"
            loading={loading}
          />
        </section>

        <section className="bg-white my-3 shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Admin Profile
          </h2>
          <div className="flex items-center">
            <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center mr-6">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaUserCircle className="text-4xl text-gray-400" />
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                {user.username}
              </h3>
              <p className="text-sm text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-700">
                Role:{" "}
                <span className="font-semibold text-gray-800">{user.role}</span>
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white shadow-md rounded-lg p-6 mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Critical Complaints
            </h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search complaints..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring focus:ring-blue-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="animate-pulse">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-10 bg-gray-300 rounded mb-3 w-full"
                  ></div>
                ))}
              </div>
            ) : (
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Statement
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Updated At
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredData.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {item.statement}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {item.category}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {item.status}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {formatDate(item.updatedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Dashboard;
