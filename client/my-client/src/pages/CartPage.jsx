// src/pages/CartPage.jsx
import React, { useEffect, useState } from "react";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(stored);
  }, []);

  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter((item) => item._id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">🛒 Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {cartItems.map((item) => (
              <li
                key={item._id}
                className="border p-4 rounded shadow flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p>Price: ₹{item.price}</p>
                </div>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => removeFromCart(item._id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <button
            onClick={clearCart}
            className="mt-6 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded"
          >
            Clear Cart
          </button>
        </>
      )}
    </div>
  );
};

export default CartPage;
