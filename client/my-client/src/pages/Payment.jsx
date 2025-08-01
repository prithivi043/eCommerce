import React, { useEffect, useState } from "react";

const Payment = () => {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const storedProduct = JSON.parse(localStorage.getItem("productToBuy"));
    if (storedProduct) {
      setProduct(storedProduct);
    }
  }, []);

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-lg">
        ❌ No product selected for payment.
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-16 bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-green-600">🧾 Payment Summary</h2>

      <div className="space-y-2">
        <p><strong>Product:</strong> {product.name}</p>
        <p><strong>Price:</strong> ₹{product.discountPrice ?? product.price}</p>
        <p><strong>Description:</strong> {product.description}</p>
      </div>

      <hr className="my-6" />

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Cardholder Name"
          className="w-full px-4 py-2 border rounded-md focus:outline-none"
        />
        <input
          type="text"
          placeholder="Card Number"
          className="w-full px-4 py-2 border rounded-md focus:outline-none"
        />
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="MM/YY"
            className="w-1/2 px-4 py-2 border rounded-md focus:outline-none"
          />
          <input
            type="text"
            placeholder="CVV"
            className="w-1/2 px-4 py-2 border rounded-md focus:outline-none"
          />
        </div>
      </div>

      <button
        onClick={() => {
          alert(`✅ Payment Successful for "${product.name}"`);
          localStorage.removeItem("productToBuy");
        }}
        className="w-full mt-6 bg-green-600 text-white py-2 rounded-full hover:bg-green-700"
      >
        Pay ₹{product.discountPrice ?? product.price}
      </button>
    </div>
  );
};

export default Payment;
