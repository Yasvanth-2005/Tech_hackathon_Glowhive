import React, { useState, useEffect } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import Login from "./auth/Login";
import Notifications from "./pages/notifications/Notifications";
import Admin from "./pages/admin/Admin";
import CreateAdmin from "./pages/admin/CreateAdmin";
import Complaint from "./pages/complaints/Complaint";
import CreateNotification from "./pages/notifications/CreateNotification";
import { Toaster } from "react-hot-toast";
import Support from "./pages/support/Support";
import AddSupport from "./pages/support/AddSupport";
import SOS from "./pages/sos/SOS";
import AddSOS from "./pages/sos/AddSOS";
import { useSelector, useDispatch } from "react-redux";
import { fetchComplaints } from "./store/complaintsSlice";
import { fetchUsers } from "./store/userSlice";
import { useLocation, useNavigate } from "react-router-dom";

const ProtectedRoute = ({ user, children }) => {
  return user ? children : <Login />;
};

const App = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const redirectPage = params.get("redirect");

    if (redirectPage) {
      navigate(`/${redirectPage}`);
    }

    if (user) {
      dispatch(fetchComplaints());
      dispatch(fetchUsers());
    }
  }, [location, navigate, user, dispatch]);

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
          path="/admin"
          element={
            <ProtectedRoute user={user}>
              <Admin />
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
