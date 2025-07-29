import React, { useEffect, useState } from "react";

const AdminCustomerManager = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Mock data instead of fetching from API
  useEffect(() => {
    const mockData = [
      { _id: "1", name: "John Doe", email: "john@example.com", blocked: false },
      { _id: "2", name: "Jane Smith", email: "jane@example.com", blocked: true },
      { _id: "3", name: "Alice Bob", email: "alice@example.com", blocked: false }
    ];
    setCustomers(mockData);
    setLoading(false);
  }, []);

  const toggleBlock = (id) => {
    setCustomers((prev) =>
      prev.map((customer) =>
        customer._id === id
          ? { ...customer, blocked: !customer.blocked }
          : customer
      )
    );
  };

  const impersonate = (id) => {
    alert(`✅ Admin now impersonating customer with ID: ${id}`);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center">Customer Manager</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading customers...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 shadow rounded-md">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{customer.name}</td>
                  <td className="py-2 px-4 border-b">{customer.email}</td>
                  <td className="py-2 px-4 border-b">
                    {customer.blocked ? (
                      <span className="text-red-600 font-semibold">Blocked</span>
                    ) : (
                      <span className="text-green-600 font-semibold">Active</span>
                    )}
                  </td>
                  <td className="py-2 px-4 border-b space-x-2">
                    <button
                      onClick={() => toggleBlock(customer._id)}
                      className={`px-3 py-1 rounded text-white ${customer.blocked ? "bg-green-600" : "bg-red-600"
                        }`}
                    >
                      {customer.blocked ? "Unblock" : "Block"}
                    </button>
                    <button
                      onClick={() => impersonate(customer._id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded"
                    >
                      Impersonate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminCustomerManager;
