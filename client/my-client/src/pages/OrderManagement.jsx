import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MdPeople, MdShoppingCart, MdPendingActions } from 'react-icons/md';
import { BarChart3 } from "lucide-react";
import CountUp from 'react-countup';
import { motion } from 'framer-motion';

const BACKEND_URL = "http://localhost:5000";

const OrderManagement = () => {
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "9876543210"
  });

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/stats/customers`)
      .then(res => setTotalCustomers(res.data.totalCustomers))
      .catch(err => console.error("Customer Count Error:", err));
  }, []);

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/stats/products`)
      .then(res => setTotalProducts(res.data.totalProducts))
      .catch(err => console.error("Product Count Error:", err));
  }, []);

  useEffect(() => {
    const cartData = localStorage.getItem("cartItems");
    try {
      const parsedCart = cartData ? JSON.parse(cartData) : [];
      setCartItems(parsedCart);
      setCartCount(parsedCart.length);
    } catch (error) {
      console.error("Error parsing cart data:", error);
      setCartItems([]);
      setCartCount(0);
    }
  }, []);

  const openCustomerDetails = () => {
    setShowCustomerDetails(true);
  };

  const closeCustomerDetails = () => {
    setShowCustomerDetails(false);
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-[#e0e7ff] via-[#f3e8ff] to-[#e0f2fe] transition-all duration-500 ease-in-out">
      <motion.h1
        className="text-4xl font-extrabold text-center text-gray-800 mb-10 tracking-tight flex items-center justify-center gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <BarChart3 className="w-9 h-9 text-indigo-600 animate-pulse" />
        <span className="bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Order Management
        </span>
      </motion.h1>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {[{
          icon: <MdPeople className="text-4xl text-indigo-500 mx-auto mb-3" />,
          title: "Total Customers",
          count: totalCustomers,
          color: "text-indigo-700"
        }, {
          icon: <MdShoppingCart className="text-4xl text-emerald-500 mx-auto mb-3" />,
          title: "Total Products",
          count: totalProducts,
          color: "text-emerald-700"
        }, {
          icon: <MdPendingActions className="text-4xl text-purple-500 mx-auto mb-3" />,
          title: "Cart Items",
          count: cartCount,
          color: "text-purple-700"
        }].map((item, index) => (
          <motion.div
            key={index}
            className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-md border border-gray-200 hover:shadow-xl transition"
            whileHover={{ scale: 1.04 }}
          >
            {item.icon}
            <h2 className="text-md font-semibold text-gray-600">{item.title}</h2>
            <p className={`text-3xl font-bold mt-1 ${item.color}`}>
              <CountUp end={item.count} duration={1.2} />
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Customer Detail Section */}
      <div className="flex justify-end mb-6">
        <button
          onClick={openCustomerDetails}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-xl shadow transition-all duration-300"
        >
          View Customer Details
        </button>
      </div>

      {/* Modal for Customer Details */}
      {showCustomerDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
          <motion.div
            className="bg-white p-8 rounded-2xl shadow-lg w-[90%] max-w-md"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-bold mb-4 text-gray-800">Customer Details</h2>
            <p><strong>Name:</strong> {customerInfo.name}</p>
            <p><strong>Email:</strong> {customerInfo.email}</p>
            <p><strong>Phone:</strong> {customerInfo.phone}</p>
            <button
              onClick={closeCustomerDetails}
              className="mt-6 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}

      {/* Cart Items List */}
      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-purple-800 flex items-center mb-6">
          <MdPendingActions className="mr-2 text-3xl" />
          Products in Cart
        </h2>

        {cartItems.length === 0 ? (
          <p className="text-gray-500 text-center py-10 text-lg">No products currently in the cart.</p>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {cartItems.map((item, index) => (
              <motion.div
                key={index}
                className="p-4 rounded-xl bg-gradient-to-br from-violet-100 to-pink-50 shadow-sm border border-violet-200 hover:shadow-lg transition"
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.name || "Unnamed Product"}</h3>
                <p className="text-sm text-gray-600">Qty: <span className="font-semibold">{item.quantity || 1}</span></p>
                <p className="text-sm text-gray-600">Price: ₹<span className="font-semibold">{item.price || 0}</span></p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
