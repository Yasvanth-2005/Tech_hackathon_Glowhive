import React from "react";
import Layout from "../components/layout/Layout";
import puc from "../assets/puc.svg";

const Dashboard = () => {
  return (
    <Layout>
      <div className="dashboard bg-purple-50">
        <div className="registrations-data grid grid-cols-1 grid-rows-2 lg:grid-cols-2 gap-5 lg:grid-rows-1 w-full">
          <div className="profile-card w-full flex flex-col md:flex-row items-center p-4 bg-white shadow-md rounded-lg  mx-auto">
            {/* Profile Image */}
            <div className="profile-image w-[130px] h-[130px] bg-zinc-200  overflow-hidden flex-shrink-0">
              {/* Use your image source here */}
              {/* <img
                src="your-image-url.jpg" // Replace with your image URL
                alt="Profile"
                className="w-full h-full object-cover"
              /> */}
              {/* If no image is available, fallback to an icon */}
              {/* <FaUserCircle className="w-full h-full text-purple-600" /> */}
            </div>

            {/* Profile Details */}
            <div className="profile-details mt-4 md:mt-0 md:ml-6 text-center md:text-left">
              <h3 className="text-2xl font-semibold text-purple-600">
                John Doe
              </h3>
              <p className="text-gray-500">john.doe@example.com</p>
              <p className="text-gray-700 mt-2">Role: Admin</p>
            </div>
          </div>
          <div className="registration-statistics grid grid-cols-2 grid-rows-2 gap-4 h-full">
            <div className="total-registrations border border-purple-200 col-span-1 p-4 text-black rounded-lg shadow-lg bg-white">
              <h2 className="text-lg md:text-2xl font-semibold pb-[10px] text-purple-600">
                Total <br className="sm:hidden" /> Users
              </h2>
              <h2 className="registrations-count text-4xl font-semibold text-purple-800">
                0
              </h2>
            </div>
            <div className="fromcampus p-4 border border-purple-200 text-black rounded-lg shadow-lg bg-white">
              <h2 className="text-lg font-semibold md:text-2xl pb-[10px] text-purple-600">
                Total <br className="sm:hidden" /> Complaints
              </h2>
              <h2 className="registrations-count text-4xl font-semibold text-purple-800">
                0
              </h2>
            </div>
            <div className="offcampus p-4 border border-purple-200 text-black rounded-lg shadow-lg bg-white">
              <h2 className="text-lg font-semibold md:text-2xl pb-[10px] text-purple-600">
                Pending <br className="sm:hidden" /> Complaints
              </h2>
              <h2 className="registrations-count text-4xl font-semibold text-purple-800">
                0
              </h2>
            </div>
            <div className="received-money border border-purple-200 p-4 text-black rounded-lg shadow-lg bg-white">
              <h2 className="text-lg font-semibold md:text-2xl pb-[10px] text-purple-600">
                Solved <br className="sm:hidden" /> Complaints
              </h2>
              <h2 className="total-money text-4xl font-semibold text-purple-800">
                0
              </h2>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;