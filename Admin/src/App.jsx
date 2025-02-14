import React, { useEffect, useState } from "react";
import "./App.css";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import { ClipLoader } from "react-spinners"; // React spinner loader

// Import Pages
import Dashboard from "./pages/dashboard/Dashboard";
import Login from "./auth/Login";
import Notifications from "./pages/notifications/Notifications";
import Admin from "./pages/admin/Admin";
import CreateAdmin from "./pages/admin/CreateAdmin";
import Complaint from "./pages/complaints/Complaint";
import CreateNotification from "./pages/notifications/CreateNotification";
import Support from "./pages/support/Support";
import AddSupport from "./pages/support/AddSupport";
import SOS from "./pages/sos/SOS";
import AddSOS from "./pages/sos/AddSOS";
import Users from "./pages/users/Users";
import Criticals from "./pages/criticals/Criticals";
import Alert from "./pages/alerts/Alert";

// Redux Actions
import { signInSuccess } from "./store/authSlice";

const App = () => {
  const [loading, setLoading] = useState(true); // Loading state
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Fetch User Details from API
  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.warn("No token found, redirecting to login.");
        setLoading(false); // Stop loading if no token
        navigate("/");
        return;
      }

      try {
        const response = await axios.get(`${apiUrl}/admin`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200 && response.data) {
          dispatch(signInSuccess(response.data)); // Update user in Redux
        } else {
          console.error("Invalid response or no user data found.");
          localStorage.removeItem("authToken");
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Error fetching user details:", error.message);
        localStorage.removeItem("authToken");
        navigate("/");
      } finally {
        setLoading(false); // Stop loading after API call
      }
    };

    fetchUserDetails();
  }, [dispatch, navigate, apiUrl]);

  // Handle Redirects based on URL Parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const redirectPage = params.get("redirect");
    if (redirectPage) {
      navigate(`/${redirectPage}`);
    }
  }, [location, navigate]);

  if (loading) {
    // Display loading spinner
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={50} color="#3498db" />
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/notifications/create" element={<CreateNotification />} />
        <Route path="/alerts" element={<Alert />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/criticals" element={<Criticals />} />
        <Route path="/admin/create" element={<CreateAdmin />} />
        <Route path="/complaint" element={<Complaint />} />
        <Route path="/support" element={<Support />} />
        <Route path="/support/add" element={<AddSupport />} />
        <Route path="/sos" element={<SOS />} />
        <Route path="/users" element={<Users />} />
        <Route path="/sos/new" element={<AddSOS />} />
      </Routes>
    </>
  );
};

export default App;
