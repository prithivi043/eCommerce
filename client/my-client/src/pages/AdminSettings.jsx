// src/pages/AdminSettings.jsx

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUsers, FiLogOut, FiArrowLeft } from "react-icons/fi";

const AdminSettings = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  const handleBack = () => {
    navigate("/admin/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-6 font-sans">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Admin Settings
        </h2>

        <div className="space-y-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition"
          >
            <FiLogOut size={20} />
            Logout
          </button>

          <button
            onClick={handleBack}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-500 transition"
          >
            <FiArrowLeft size={20} />
            Back to Dashboard
          </button>

          <Link
            to="/admin/customers"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-blue-600 text-blue-600 font-semibold rounded hover:bg-blue-100 transition"
          >
            <FiUsers size={20} />
            Manage Customers
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
