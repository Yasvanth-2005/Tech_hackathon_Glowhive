import React from 'react'
import './App.css'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import Dashboard from './pages/dashboard/Dashboard'
import Login from './auth/Login'
import Notifications from './pages/notifications/Notifications'
import { useSelector } from 'react-redux'

const App = () => {
  const user = useSelector((state) => state.auth.user)
  console.log(user)
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/notifications" element={<Notifications/>} />
      </Routes>
    </Router>
  )
}

export default App
