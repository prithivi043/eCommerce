import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // optional animation

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100 flex flex-col md:flex-row items-center justify-between px-6 py-12">

      {/* Left Content */}
      <motion.div
        className="max-w-xl text-center md:text-left ml-0 md:ml-12"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl font-extrabold text-gray-800 leading-tight mb-6">
          Welcome to <span className="text-indigo-600">our Market</span>
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Your one-stop destination to explore, compare, and choose the best-rated products. Start your journey with us today.
        </p>
        <div className="flex gap-4 justify-center md:justify-start">
          <button
            onClick={() => navigate('/register')}
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition"
          >
            Register Now
          </button>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 border border-indigo-600 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-100 transition"
          >
            Login
          </button>
        </div>
      </motion.div>

      {/* Right Image/Illustration */}
      <motion.div
        className="mt-10 md:mt-0 md:w-1/2"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        <img
          src="https://staticimg.amarujala.com/assets/images/2019/05/21/online-shopping_1558423417.jpeg?w=414&dpr=1.0&q=80"
          onMouseOver={(e) => {
            e.currentTarget.src = "https://uniworthdress.com/uploads/slider/237b7f574bf2f33d4445529054a31238.jpg";
          }}
          onMouseOut={(e) => {
            e.currentTarget.src = "https://staticimg.amarujala.com/assets/images/2019/05/21/online-shopping_1558423417.jpeg?w=414&dpr=1.0&q=80";
          }}
          alt="Shopping Illustration"
          className="w-full max-w-md mx-auto rounded-lg shadow-lg transition-transform duration-500 hover:scale-105"
        />

      </motion.div>
    </div>
  );
};

export default WelcomePage;
