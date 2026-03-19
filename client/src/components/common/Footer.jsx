import React from 'react';
import { FaRecycle, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <FaRecycle className="text-primary-400 text-2xl" />
              <span className="font-bold text-xl">SmartRecycle</span>
            </div>
            <p className="text-gray-300 text-sm">
              Making plastic recycling rewarding and efficient through smart technology and incentives.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/" className="hover:text-primary-400 transition-colors">Home</a></li>
              <li><a href="/about" className="hover:text-primary-400 transition-colors">About Us</a></li>
              <li><a href="/dashboard" className="hover:text-primary-400 transition-colors">Dashboard</a></li>
              <li><a href="/contact" className="hover:text-primary-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Email: info@smartrecycle.com</li>
              <li>Phone: +260 975 692353</li>
              <li>Address: Lusaka, Zambia</li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors text-2xl">
                <FaFacebook />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors text-2xl">
                <FaTwitter />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors text-2xl">
                <FaInstagram />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors text-2xl">
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Smart Plastic Recycling System. All rights reserved. Developed by Limpo Gift Lubinda</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;