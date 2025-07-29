// src/pages/AdminSettings.jsx

import React from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminSettings = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken"); // Or however you're storing it
    alert("You have been logged out.");
    navigate("/login"); // Redirect to admin login page
  };

  const handleBack = () => {
    navigate("/admin/dashboard"); // Redirect to admin dashboard
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Settings</h2>

      <div className="bg-white shadow-md rounded-lg p-4 max-w-md">
        <h3 className="text-lg font-semibold mb-2">Account Settings</h3>

        <button
          onClick={handleLogout}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer transition"
        >
          Logout
        </button>
        <button
          onClick={handleBack}
          className="ml-3 mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 cursor-pointer transition"
        >
          Back
        </button>
      </div>
      <Link
        to="/admin/customers"
        className="block px-4 py-2 text-blue-600 hover:underline"
      >
        👥 Manage Customers
      </Link>

    </div>
  );
};

export default AdminSettings;
