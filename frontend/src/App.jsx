import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import Login from "./Auth/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import Game from "./components/Game/Game";
import Categories from "./components/Categories/Categories";


const isAuthenticated = () => !!localStorage.getItem("jwt");
const ProtectedRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" replace />;
};

function App() {
  const location = useLocation();
  const showLayout = location.pathname !== "/login"; 

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
    <div className="flex flex-col min-h-screen bg-gray-900">
      {showLayout && <Navbar />}
      
      <div className="flex flex-grow">
        {showLayout && <Sidebar />} 
        
        <div className="flex-grow p-4">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
            <Route path="/game" element={<ProtectedRoute element={<Game />} />} />
            <Route path="/categories" element={<ProtectedRoute element={<Categories />} />} />
          </Routes>
        </div>
      </div>
    </div>
    </>
  );
}

export default App;
