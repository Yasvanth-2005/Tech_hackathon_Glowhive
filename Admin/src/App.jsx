import React, { useEffect } from "react";
import "./App.css";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { Toaster } from "react-hot-toast";

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

// Protected Route Component
const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    return <Login />;
  }
  return children;
};

const App = () => {
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
        navigate("/");
        return;
      }

      try {
        const response = await axios.get(`${apiUrl}/admin/getdetails`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200 && response.data) {
          dispatch(signInSuccess(response.data)); // Update user in Redux
        } else {
          console.error("Invalid response or no user data found.");
          localStorage.removeItem("authToken");
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching user details:", error.message);
        localStorage.removeItem("authToken");
        navigate("/");
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

  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute user={user}>
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications/create"
          element={
            <ProtectedRoute user={user}>
              <CreateNotification />
            </ProtectedRoute>
          }
        />
        <Route
          path="/alerts"
          element={
            <ProtectedRoute user={user}>
              <Alert />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute user={user}>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/criticals"
          element={
            <ProtectedRoute user={user}>
              <Criticals />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/create"
          element={
            <ProtectedRoute user={user}>
              <CreateAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/complaint"
          element={
            <ProtectedRoute user={user}>
              <Complaint />
            </ProtectedRoute>
          }
        />
        <Route
          path="/support"
          element={
            <ProtectedRoute user={user}>
              <Support />
            </ProtectedRoute>
          }
        />
        <Route
          path="/support/add"
          element={
            <ProtectedRoute user={user}>
              <AddSupport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sos"
          element={
            <ProtectedRoute user={user}>
              <SOS />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute user={user}>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sos/new"
          element={
            <ProtectedRoute user={user}>
              <AddSOS />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
