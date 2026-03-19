import React from 'react';
import { Link } from 'react-router-dom';
import { FaRecycle, FaTrophy, FaChartLine, FaUsers, FaArrowRight } from 'react-icons/fa';

const LandingPage = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Smart Plastic Collection & Recycling Incentive System
            </h1>
            <p className="text-xl mb-8 text-gray-100">
              Join the revolution in plastic recycling. Earn rewards while saving the environment.
              Every plastic counts, every contribution matters.
            </p>
            <div className="flex justify-center space-x-4">
              <Link 
                to="/register" 
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2"
              >
                <span>Get Started</span>
                <FaArrowRight />
              </Link>
              <Link 
                to="/about" 
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose SmartRecycle?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card text-center">
              <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaTrophy className="text-primary-600 text-4xl" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Earn Rewards</h3>
              <p className="text-gray-600">
                Get points for every plastic contribution. Redeem them for exciting rewards and benefits.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card text-center">
              <div className="bg-secondary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaChartLine className="text-secondary-600 text-4xl" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Track Progress</h3>
              <p className="text-gray-600">
                Monitor your contributions, earnings, and environmental impact through detailed analytics.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card text-center">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaUsers className="text-green-600 text-4xl" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Community Impact</h3>
              <p className="text-gray-600">
                Join a growing community of environmentally conscious citizens making a difference.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-primary-100">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">5000+</div>
              <div className="text-primary-100">Contributions</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-primary-100">KG Recycled</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50,000+</div>
              <div className="text-primary-100">Points Earned</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of others who are already earning rewards while helping the environment.
          </p>
          <Link 
            to="/register" 
            className="btn-primary inline-flex items-center space-x-2 text-lg px-8 py-4"
          >
            <span>Create Your Account</span>
            <FaArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;