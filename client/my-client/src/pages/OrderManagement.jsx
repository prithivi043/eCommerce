import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filters, setFilters] = useState({ status: '', customer: '' });

  const BACKEND_URL = "http://localhost:5000";

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/orders`, { params: filters })
      .then(res => setOrders(res.data))
      .catch(error => console.error("Order Fetch Error:", error));
  }, [filters]);


  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Orders</h1>
      <div className="flex gap-4 mb-4">
        <select className="border p-2 rounded" value={filters.status}
          onChange={e => setFilters({ ...filters, status: e.target.value })}>
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
        </select>
        <input
          className="border p-2 rounded"
          placeholder="Search Customer"
          value={filters.customer}
          onChange={e => setFilters({ ...filters, customer: e.target.value })}
        />
      </div>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">#</th>
              <th className="border p-2">Order ID</th>
              <th className="border p-2">Customer</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o, idx) => (
              <tr key={o._id} className="hover:bg-gray-50">
                <td className="border p-2">{idx + 1}</td>
                <td className="border p-2">{o._id.slice(-6)}</td>
                <td className="border p-2">{o.customerName}</td>
                <td className="border p-2">{o.status}</td>
                <td className="border p-2">₹{o.totalAmount}</td>
                <td className="border p-2 space-x-2">
                  <button onClick={() => alert(JSON.stringify(o, null, 2))} className="text-blue-600">View</button>
                  <button className="text-green-600">Update</button>
                  <button onClick={async () => {
                    await axios.delete(`/api/orders/${o._id}`);
                    setOrders(orders.filter(x => x._id !== o._id));
                  }} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p className="mt-4 text-gray-600">Total Orders: {orders.length}</p>
    </div>
  );
};
export default OrderManagement;
