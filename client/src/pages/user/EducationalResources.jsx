import React, { useState, useEffect } from 'react';
import { FaBookOpen, FaVideo, FaFileAlt, FaSearch, FaSpinner, FaDownload, FaPlay } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const EducationalResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedResource, setSelectedResource] = useState(null);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      // Replace with actual API call
      const response = await fetch('/api/educational-resources');
      const data = await response.json();
      setResources(data);
    } catch (error) {
      console.error('Error fetching resources:', error);
      // Mock data - replace with real API
      setResources([
        {
          id: 1,
          title: 'Understanding Plastic Types',
          type: 'article',
          content: 'Learn about the 7 types of plastics and how to identify them...',
          imageUrl: '/plastic-types.jpg',
          readTime: '5 min',
          date: '2024-01-15'
        },
        {
          id: 2,
          title: 'How to Clean and Prepare Plastics for Recycling',
          type: 'video',
          url: 'https://youtube.com/watch?v=example',
          duration: '3:45',
          thumbnail: '/recycling-tips.jpg',
          date: '2024-01-20'
        },
        {
          id: 3,
          title: 'The Recycling Process: From Bin to New Product',
          type: 'infographic',
          imageUrl: '/recycling-process.jpg',
          downloadUrl: '/infographics/recycling-process.pdf',
          date: '2024-01-10'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const types = [
    { value: 'all', label: 'All Resources', icon: FaBookOpen },
    { value: 'article', label: 'Articles', icon: FaFileAlt },
    { value: 'video', label: 'Videos', icon: FaPlay },
    { value: 'infographic', label: 'Infographics', icon: FaDownload }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    return matchesSearch && matchesType;
  });

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
            <FaBookOpen className="text-primary-600 text-4xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Educational Resources</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Learn about recycling, environmental impact, and how to make a difference
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex gap-2">
            {types.map((type) => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  selectedType === type.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                <type.icon />
                <span>{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource, index) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => setSelectedResource(resource)}
            >
              {resource.type === 'video' ? (
                <div className="relative h-48 bg-gray-800">
                  {resource.thumbnail ? (
                    <img src={resource.thumbnail} alt={resource.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaPlay className="text-white text-4xl" />
                    </div>
                  )}
                  <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                    {resource.duration}
                  </span>
                </div>
              ) : (
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  {resource.imageUrl ? (
                    <img src={resource.imageUrl} alt={resource.title} className="w-full h-full object-cover" />
                  ) : (
                    <FaFileAlt className="text-4xl text-gray-400" />
                  )}
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    resource.type === 'article' ? 'bg-blue-100 text-blue-700' :
                    resource.type === 'video' ? 'bg-red-100 text-red-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {format(new Date(resource.date), 'MMM dd, yyyy')}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{resource.title}</h3>
                {resource.readTime && (
                  <p className="text-sm text-gray-500 mb-3">{resource.readTime} read</p>
                )}
                {resource.content && (
                  <p className="text-gray-600 text-sm line-clamp-2">{resource.content}</p>
                )}
                <button className="mt-4 text-primary-600 hover:text-primary-700 font-medium text-sm">
                  {resource.type === 'video' ? 'Watch Now →' : 
                   resource.type === 'infographic' ? 'Download →' : 'Read More →'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <FaBookOpen className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Resources Found</h3>
            <p className="text-gray-500">Try adjusting your search or check back later</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EducationalResources;