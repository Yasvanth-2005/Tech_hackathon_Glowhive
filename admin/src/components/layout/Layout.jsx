import React, { useState, useEffect } from "react";
import { HiOutlineViewList } from "react-icons/hi";
import { VscChromeClose } from "react-icons/vsc";
import { Link, useLocation } from "react-router-dom";
import { IoLogInOutline } from "react-icons/io5";
import { MdNotificationsActive } from "react-icons/md";
import { MdSpaceDashboard } from "react-icons/md";
import { useSelector } from "react-redux";
// Breadcrumb Component
const Breadcrumb = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  return (
    <nav className="breadcrumb mt-4 mb-2">
      <ul className="flex items-center text-sm text-gray-500 space-x-2">
        {pathSegments.map((segment, index) => {
          const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
          const isLast = index === pathSegments.length - 1;

          return (
            <li key={index} className="flex items-center space-x-2">
              <span>/</span>
              {isLast ? (
                <span className=" text-lg font-semibold text-purple-600 capitalize">
                  {segment}
                </span>
              ) : (
                <Link
                  to={path}
                  className="hover:text-purple-600 text-lg font-semibold capitalize"
                >
                  {segment}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

const Layout = ({ children }) => {
  const [width, setWidth] = useState(window.innerWidth);
  const [showSidebar, setShowSidebar] = useState(false);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.auth.user.admin)
  console.log(user)


  const topBarTabs = [
    { label: "Dashboard", path: "dashboard", icon: MdSpaceDashboard },
    {
      label: "Notifications",
      path: "notifications",
      icon: MdNotificationsActive,
    },
  ];

  const location = useLocation();

  // Utility function to check active tab
  const isActive = (path) => location.pathname.includes(path);

  // Handle responsive sidebar toggle
  const handleWidth = () => {
    setWidth(window.innerWidth);
    setShowSidebar(window.innerWidth < 768);
  };

  // Add event listener for window resize
  useEffect(() => {
    window.addEventListener("resize", handleWidth);
    return () => window.removeEventListener("resize", handleWidth);
  }, []);


  return (
    <>
      {/* Header */}
      <div className="w-full fixed top-0 flex items-center justify-between h-[60px] z-[2] shadow-md bg-white">
        <div className="flex items-center">
          <HiOutlineViewList
            className="text-2xl mx-3 block md:hidden text-purple-600 cursor-pointer"
            onClick={() => setShowSidebar(!showSidebar)}
          />
          <Link
            to="/"
            className="logo font-semibold text-purple-600 select-none px-3 text-2xl"
          >
            Girl Life
          </Link>
        </div>
        <div className="flex items-center text-gray-700">
          <div className="tab cursor-pointer font-semibold mx-[20px] px-4 py-1 flex items-center rounded-full md:shadow-md md:border">
            <div className="hidden mx-2 md:inline-block">{ user?.username}</div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`sidebar z-[1000] shadow-md fixed md:hidden w-full top-0 ${
          showSidebar ? "left-0" : "-left-full"
        } duration-500 h-screen bg-white flex flex-col`}
      >
        <div className="w-full flex items-center justify-end p-3">
          <VscChromeClose
            className="text-[30px] cursor-pointer"
            onClick={() => setShowSidebar(!showSidebar)}
          />
        </div>
        <div className="flex flex-col md:gap-4">
          {topBarTabs.map((item, index) => (
            <Link
              key={index}
              to={`/${item.path}`}
              onClick={() => setShowSidebar(false)}
              className={`tab-heading w-[97%] text-purple-600 mx-auto px-4 py-2 mt-2 text-lg font-bold flex items-center ${
                isActive(item.path)
                  ? "text-purple-600"
                  : "hover:text-purple-500"
              }`}
            >
              <item.icon className="mr-2" />
              <span>{item.label}</span>
            </Link>
          ))}
          <button
            className="w-[90%] py-2 mx-auto bg-purple-600 font-bold text-white rounded-md flex items-center justify-center gap-2 mt-10"
            onClick={() => {
              window.location.reload();
            }}
          >
            Logout
            <IoLogInOutline />
          </button>
        </div>
      </div>

      {/* Content Layout */}
      <div className="flex flex-col md:flex-row mt-[60px] h-[calc(100vh-60px)]">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex flex-col w-[240px] border-r h-full bg-purple-50">
          {topBarTabs.map((item, index) => (
            <Link
              key={index}
              to={`/${item.path}`}
              className={`tab-heading px-4 text-purple-600 py-2 text-lg mt-[3px] w-[92%] mx-auto font-semibold flex items-center rounded-md ${
                isActive(item.path)
                  ? "bg-purple-100 text-purple-600"
                  : "hover:bg-purple-100 hover:text-purple-600"
              }`}
            >
              <item.icon className="mr-2" />
              <span>{item.label}</span>
            </Link>
          ))}
          <button className="w-[90%] py-2 mx-auto bg-purple-600 text-white rounded-md flex items-center justify-center gap-2 mt-10">
            Logout
            <IoLogInOutline />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          <Breadcrumb />
          {children}
        </div>
      </div>
    </>
  );
};

export default Layout;
