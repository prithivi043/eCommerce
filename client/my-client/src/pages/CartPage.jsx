import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const CartPage = () => {
  const { state } = useLocation();
  const cartItems = state?.cartItems || [];
  const navigate = useNavigate();

  const handleRemove = (id) => {
    const updated = cartItems.filter(item => item._id !== id);
    navigate('/customer/cart', { state: { cartItems: updated } });
  };

  return (
    <motion.div
      className="p-6 min-h-screen bg-gradient-to-br from-slate-100 to-slate-200"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-slate-800 mb-6">🛒 Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white shadow-md rounded-xl p-6 text-center">
            <p className="text-slate-600 text-lg">Your cart is empty 😕</p>
            <button
              onClick={() => navigate('/customer/home')}
              className="mt-6 bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              ← Back to Shop
            </button>
          </div>
        ) : (
          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            {cartItems.map(product => (
              <motion.div
                key={product._id}
                className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-xl transition-all duration-300 border border-slate-200 group relative"
                whileHover={{ scale: 1.02 }}
              >
                <img
                  src={product.image || 'https://via.placeholder.com/300'}
                  alt={product.name}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-800">{product.name}</h3>
                    <span className="text-emerald-600 font-semibold">
                      ₹{product.discountPrice ?? product.price}
                    </span>
                  </div>
                  {product.discountPrice && (
                    <p className="text-sm text-slate-500 line-through">₹{product.price}</p>
                  )}
                  <p className="text-sm text-slate-600 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>⭐ {product.rating ?? 'N/A'}</span>
                    <span className={`font-medium ${product.stock > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {product.stock > 0 ? '🟢 In Stock' : '🔴 Out of Stock'}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemove(product._id)}
                    className="mt-3 text-red-600 hover:underline text-sm"
                  >
                    ❌ Remove
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {cartItems.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/customer/home')}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              ← Continue Shopping
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CartPage;
