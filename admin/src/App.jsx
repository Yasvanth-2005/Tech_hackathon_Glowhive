import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import Login from "./auth/Login";
import Notifications from "./pages/notifications/Notifications";
import Admin from "./pages/admin/Admin";
import { useSelector } from "react-redux";
import CreateAdmin from "./pages/admin/CreateAdmin";
import Complaint from "./pages/complaints/Complaint";
import CreateNotification from "./pages/notifications/CreateNotification";
import { Toaster } from "react-hot-toast";

const App = () => {
  const user = useSelector((state) => state.auth.user);
  console.log(user);
  return (
    <Router>
      <Toaster /> {/* This is essential for the toast notifications */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/notifications" element={<Notifications />} />
        <Route path="/notifications/create" element={<CreateNotification />} />

        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/create" element={<CreateAdmin />} />

        <Route path="/complaint" element={<Complaint />} />
      </Routes>
    </Router>
  );
};

export default App;
