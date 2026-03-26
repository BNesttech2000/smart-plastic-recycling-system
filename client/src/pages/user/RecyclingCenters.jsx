import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaPhone, FaClock, FaStar, FaSpinner, FaSearch } from 'react-icons/fa';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const RecyclingCenters = () => {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    fetchCenters();
    getUserLocation();
  }, []);

  const fetchCenters = async () => {
    try {
      // Replace with actual API call
      const response = await fetch('/api/recycling-centers');
      const data = await response.json();
      setCenters(data);
    } catch (error) {
      console.error('Error fetching centers:', error);
      // Mock data for demonstration - replace with real API
      setCenters([
        {
          id: 1,
          name: 'Lusaka Recycling Hub',
          address: 'Great East Road, Lusaka',
          phone: '+260 97 123 4567',
          hours: 'Mon-Fri: 8am-5pm, Sat: 9am-2pm',
          acceptedPlastics: ['PET', 'HDPE', 'PP'],
          rating: 4.5,
          coordinates: { lat: -15.3875, lng: 28.3228 }
        },
        {
          id: 2,
          name: 'Ndola Waste Management',
          address: 'Independence Avenue, Ndola',
          phone: '+260 96 765 4321',
          hours: 'Mon-Sat: 7am-4pm',
          acceptedPlastics: ['PET', 'HDPE', 'LDPE', 'PP'],
          rating: 4.2,
          coordinates: { lat: -12.9667, lng: 28.6333 }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const filteredCenters = centers.filter(center =>
    center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    center.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="w-12 h-12 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaMapMarkerAlt className="text-primary-600 text-4xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Recycling Centers</h1>
          <p className="text-gray-600">Find recycling centers near you</p>
        </div>

        {/* Search */}
        <div className="relative max-w-md mx-auto mb-8">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Centers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCenters.map((center, index) => (
            <motion.div
              key={center.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => setSelectedCenter(center)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-800">{center.name}</h3>
                  <div className="flex items-center space-x-1">
                    <FaStar className="text-yellow-500" />
                    <span className="text-sm text-gray-600">{center.rating}</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-2 flex items-start">
                  <FaMapMarkerAlt className="mr-2 mt-1 flex-shrink-0" />
                  {center.address}
                </p>
                {userLocation && (
                  <p className="text-sm text-primary-600 mb-2">
                    {calculateDistance(userLocation.lat, userLocation.lng, center.coordinates.lat, center.coordinates.lng).toFixed(1)} km away
                  </p>
                )}
                <p className="text-gray-600 text-sm mb-2 flex items-center">
                  <FaPhone className="mr-2" />
                  {center.phone}
                </p>
                <p className="text-gray-600 text-sm mb-3 flex items-center">
                  <FaClock className="mr-2" />
                  {center.hours}
                </p>
                <div className="flex flex-wrap gap-2">
                  {center.acceptedPlastics.map((type) => (
                    <span key={type} className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCenters.length === 0 && (
          <div className="text-center py-12">
            <FaMapMarkerAlt className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Recycling Centers Found</h3>
            <p className="text-gray-500">Try adjusting your search or check back later</p>
          </div>
        )}

        {/* Center Details Modal */}
        {selectedCenter && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-lg w-full p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{selectedCenter.name}</h2>
                <button
                  onClick={() => setSelectedCenter(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-3">
                <p className="flex items-start">
                  <FaMapMarkerAlt className="mr-3 mt-1 text-gray-500" />
                  <span>{selectedCenter.address}</span>
                </p>
                <p className="flex items-center">
                  <FaPhone className="mr-3 text-gray-500" />
                  <a href={`tel:${selectedCenter.phone}`} className="text-primary-600 hover:underline">
                    {selectedCenter.phone}
                  </a>
                </p>
                <p className="flex items-start">
                  <FaClock className="mr-3 mt-1 text-gray-500" />
                  <span>{selectedCenter.hours}</span>
                </p>
                <div>
                  <p className="font-medium text-gray-700 mb-2">Accepted Plastics:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedCenter.acceptedPlastics.map((type) => (
                      <span key={type} className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="pt-4">
                  <a
                    href={`https://maps.google.com/?q=${selectedCenter.coordinates.lat},${selectedCenter.coordinates.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Get Directions
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecyclingCenters;