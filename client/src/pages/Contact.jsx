import React, { useState } from 'react';
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaPaperPlane,
  FaCheckCircle,
  FaSpinner,
  FaGlobe,
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call - Replace with actual backend endpoint
    setTimeout(() => {
      console.log('Contact form submitted:', formData);
      toast.success('Message sent successfully! We will get back to you soon.');
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setLoading(false);
      
      // Reset submitted status after 3 seconds
      setTimeout(() => setSubmitted(false), 3000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: FaMapMarkerAlt,
      title: 'Visit Us',
      details: ['Lusaka, Zambia', 'Great East Road, Cavendish University'],
      color: 'text-red-500',
      bg: 'bg-red-100',
    },
    {
      icon: FaPhone,
      title: 'Call Us',
      details: ['+260 975 692353', '+260 96 765 4321'],
      color: 'text-green-500',
      bg: 'bg-green-100',
    },
    {
      icon: FaEnvelope,
      title: 'Email Us',
      details: ['info@smartrecycle.com', 'support@smartrecycle.com'],
      color: 'text-blue-500',
      bg: 'bg-blue-100',
    },
    {
      icon: FaClock,
      title: 'Working Hours',
      details: ['Monday - Friday: 8:00 AM - 5:00 PM', 'Saturday: 9:00 AM - 2:00 PM'],
      color: 'text-purple-500',
      bg: 'bg-purple-100',
    },
  ];

  const socialLinks = [
    { icon: FaFacebook, url: 'https://facebook.com', color: 'bg-blue-600', hover: 'hover:bg-blue-700' },
    { icon: FaTwitter, url: 'https://twitter.com', color: 'bg-sky-500', hover: 'hover:bg-sky-600' },
    { icon: FaInstagram, url: 'https://instagram.com', color: 'bg-pink-600', hover: 'hover:bg-pink-700' },
    { icon: FaLinkedin, url: 'https://linkedin.com', color: 'bg-blue-700', hover: 'hover:bg-blue-800' },
  ];

  // Google Maps embed URL (Lusaka, Zambia coordinates)
  const mapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d123456!2d28.3228!3d-15.3875!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1940f4f5e5f5e5f5%3A0x5f5e5f5e5f5e5f5e!2sLusaka%2C%20Zambia!5e0!3m2!1sen!2s!4v1234567890";

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaEnvelope className="text-primary-600 text-4xl" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-3">Contact Us</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have questions about recycling? Want to partner with us? We'd love to hear from you!
            Get in touch with our team today.
          </p>
        </motion.div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactInfo.map((info, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow"
            >
              <div className={`${info.bg} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                <info.icon className={`${info.color} text-2xl`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">{info.title}</h3>
              {info.details.map((detail, i) => (
                <p key={i} className="text-gray-600 text-sm">{detail}</p>
              ))}
            </motion.div>
          ))}
        </div>

        {/* Map and Contact Form Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Google Map */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="h-96 w-full">
              <iframe
                title="SmartRecycle Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.0!2d28.3228!3d-15.3875!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1940f5e5e5e5e5e5%3A0x5f5e5f5e5f5e5f5e!2sLusaka%2C%20Zambia!5e0!3m2!1sen!2s!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              ></iframe>
            </div>
            <div className="p-4 bg-gray-50 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FaMapMarkerAlt className="text-red-500" />
                  <span className="text-sm text-gray-600">Lusaka, Zambia</span>
                </div>
                <a
                  href="https://www.google.com/maps/dir//Lusaka,+Zambia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 text-sm hover:underline"
                >
                  Get Directions →
                </a>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h2>
            
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCheckCircle className="text-green-600 text-4xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Message Sent!</h3>
                <p className="text-gray-600">Thank you for reaching out. We'll get back to you soon.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="How can we help you?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="input-field"
                    placeholder="Tell us about your recycling needs, questions, or feedback..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-3 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 bg-white rounded-xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">How do I start recycling?</h3>
              <p className="text-gray-600 text-sm">Simply register an account, then submit your plastic collection through our platform.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">How are points calculated?</h3>
              <p className="text-gray-600 text-sm">Points are based on the type and quantity of plastic you recycle. Different plastics earn different points per kg.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">How do I redeem my points?</h3>
              <p className="text-gray-600 text-sm">Go to the Rewards Store section to browse available rewards and redeem your points.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">What types of plastic are accepted?</h3>
              <p className="text-gray-600 text-sm">We accept PET, HDPE, PVC, LDPE, PP, PS, and other plastic types. Check our guidelines for details.</p>
            </div>
          </div>
        </motion.div>

        {/* Social Media Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Follow Us</h2>
          <div className="flex justify-center space-x-4">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${social.color} ${social.hover} w-12 h-12 rounded-full flex items-center justify-center text-white transition-all transform hover:scale-110`}
              >
                <social.icon className="text-xl" />
              </a>
            ))}
          </div>
          <p className="text-gray-500 text-sm mt-4">Stay updated with our latest news and recycling tips!</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;