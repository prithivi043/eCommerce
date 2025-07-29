// src/pages/CustomerManagement.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [impersonatedUser, setImpersonatedUser] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get("/api/admin/customers");
      setCustomers(response.data);
    } catch (err) {
      console.error("Failed to fetch customers", err);
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/admin/customers/${id}`);
    fetchCustomers();
  };

  const handleBlockToggle = async (id, isBlocked) => {
    await axios.patch(`/api/admin/customers/${id}/block`, { blocked: !isBlocked });
    fetchCustomers();
  };

  const handleImpersonate = (user) => {
    setImpersonatedUser(user);
    localStorage.setItem("impersonatedUser", JSON.stringify(user));
  };

  const stopImpersonation = () => {
    setImpersonatedUser(null);
    localStorage.removeItem("impersonatedUser");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Customer Management</h2>

      {impersonatedUser && (
        <div className="bg-yellow-300 text-black p-4 rounded mb-4 shadow-md">
          <p>
            🔄 You are impersonating <strong>{impersonatedUser.name}</strong> —{" "}
            <button
              className="text-red-600 underline"
              onClick={stopImpersonation}
            >
              Stop Impersonation
            </button>
          </p>
        </div>
      )}

      <table className="w-full bg-white shadow-md rounded overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left px-4 py-2">Name</th>
            <th className="text-left px-4 py-2">Email</th>
            <th className="text-left px-4 py-2">Status</th>
            <th className="text-left px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((user) => (
            <tr key={user._id} className="border-t">
              <td className="px-4 py-2">{user.name}</td>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">
                {user.blocked ? (
                  <span className="text-red-500">Blocked</span>
                ) : (
                  <span className="text-green-500">Active</span>
                )}
              </td>
              <td className="px-4 py-2 flex gap-2">
                <button
                  onClick={() => handleBlockToggle(user._id, user.blocked)}
                  className={`px-2 py-1 rounded text-white ${user.blocked ? "bg-green-600" : "bg-red-600"
                    }`}
                >
                  {user.blocked ? "Unblock" : "Block"}
                </button>

                <button
                  onClick={() => handleImpersonate(user)}
                  className="px-2 py-1 bg-blue-600 text-white rounded"
                >
                  Impersonate
                </button>

                <button
                  onClick={() => handleDelete(user._id)}
                  className="px-2 py-1 bg-gray-800 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerManagement;
