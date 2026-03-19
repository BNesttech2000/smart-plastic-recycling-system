import React from 'react';
import { Link } from 'react-router-dom';
import { FaRecycle, FaUser, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <FaRecycle className="text-primary-600 text-3xl" />
            <span className="font-bold text-xl text-gray-800">
              Smart<span className="text-primary-600">Recycle</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-primary-600 transition-colors">
              Home
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-primary-600 transition-colors">
              About
            </Link>
            <Link to="/dashboard" className="text-gray-600 hover:text-primary-600 transition-colors">
              Dashboard
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Link 
              to="/login" 
              className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <FaSignInAlt />
              <span>Login</span>
            </Link>
            <Link 
              to="/register" 
              className="flex items-center space-x-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              <FaUserPlus />
              <span>Register</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;