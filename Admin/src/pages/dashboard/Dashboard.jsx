import React, { useState } from "react";
import { useSelector } from "react-redux";
import Layout from "../../components/layout/Layout";
import { FaSearch, FaUserCircle } from "react-icons/fa";
import { MdDashboard, MdPeople, MdReport, MdCheckCircle } from "react-icons/md";

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user.admin);
  const [searchTerm, setSearchTerm] = useState("");
  const [complaints,setComplaints] = useState(null)
  const [usersCount,setUsersCount] = useState(null)

  const data = [
    { id: 1, complaint_name: "Cleanliness", status: "pending" },
    { id: 2, complaint_name: "Noise Pollution", status: "rejected" },
    { id: 3, complaint_name: "Water Supply", status: "solved" },
    { id: 4, complaint_name: "Electricity Issue", status: "pending" },
  ];

  const filteredData = data.filter(item =>
    item.complaint_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const StatCard = ({ title, count, icon: Icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border border-purple-100 transition-all duration-300 hover:shadow-lg hover:border-purple-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-purple-600 mb-2">{title}</h2>
          <p className="text-3xl font-bold text-purple-800">{count}</p>
        </div>
        <Icon className="text-4xl text-purple-500 opacity-80" />
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="dashboard bg-gray-100 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-purple-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.username}!</p>
        </div>

        <div className="grid gap-8 mb-8 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Users" count="10" icon={MdPeople} />
          <StatCard title="Total Complaints" count="20" icon={MdReport} />
          <StatCard title="Pending Complaints" count="12" icon={MdDashboard} />
          <StatCard title="Solved Complaints" count="8" icon={MdCheckCircle} />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-purple-800 mb-4 md:mb-0">Recent Complaints</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search complaints..."
                className="pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Complaint</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{item.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.complaint_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        item.status === 'solved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-purple-800 mb-6">Admin Profile</h2>
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-32 h-32 bg-purple-200 rounded-full flex items-center justify-center mb-4 md:mb-0 md:mr-6">
              {user.avatar ? (
                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover rounded-full" />
              ) : (
                <FaUserCircle className="w-24 h-24 text-purple-600" />
              )}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-purple-600">{user.username}</h3>
              <p className="text-gray-600 mb-2">{user.email}</p>
              <p className="text-gray-700">
                Role: <span className="font-semibold">{user.role}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

