import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { 
  FaPlus, FaEdit, FaTrash, FaSpinner, FaFileAlt, 
  FaVideo, FaDownload, FaSave, FaTimes, FaLink 
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const ManageResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'article',
    content: '',
    url: '',
    duration: '',
    readTime: '',
    imageUrl: '',
    downloadUrl: '',
    isPublished: true
  });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      // Replace with actual API call
      // const response = await api.get('/admin/resources');
      // setResources(response.data);
      
      setResources([
        { id: 1, title: 'Understanding Plastic Types', type: 'article', readTime: '5 min', isPublished: true },
        { id: 2, title: 'How to Clean Plastics for Recycling', type: 'video', duration: '3:45', isPublished: true },
        { id: 3, title: 'The Recycling Process', type: 'infographic', downloadUrl: '/recycling-process.pdf', isPublished: true }
      ]);
    } catch (error) {
      toast.error('Failed to fetch resources');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingResource) {
        setResources(resources.map(r => r.id === editingResource.id ? { ...r, ...formData } : r));
        toast.success('Resource updated successfully');
      } else {
        const newResource = { id: Date.now(), ...formData };
        setResources([...resources, newResource]);
        toast.success('Resource created successfully');
      }
      setShowModal(false);
      setEditingResource(null);
      resetForm();
    } catch (error) {
      toast.error('Failed to save resource');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        setResources(resources.filter(r => r.id !== id));
        toast.success('Resource deleted successfully');
      } catch (error) {
        toast.error('Failed to delete resource');
      }
    }
  };

  const handleEdit = (resource) => {
    setEditingResource(resource);
    setFormData({
      title: resource.title,
      type: resource.type,
      content: resource.content || '',
      url: resource.url || '',
      duration: resource.duration || '',
      readTime: resource.readTime || '',
      imageUrl: resource.imageUrl || '',
      downloadUrl: resource.downloadUrl || '',
      isPublished: resource.isPublished
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      type: 'article',
      content: '',
      url: '',
      duration: '',
      readTime: '',
      imageUrl: '',
      downloadUrl: '',
      isPublished: true
    });
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'video': return <FaVideo className="text-red-500" />;
      case 'infographic': return <FaDownload className="text-purple-500" />;
      default: return <FaFileAlt className="text-blue-500" />;
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin text-4xl text-primary-600" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Educational Resources</h1>
          <p className="text-gray-600">Add and manage articles, videos, and infographics</p>
        </div>
        <button
          onClick={() => {
            setEditingResource(null);
            resetForm();
            setShowModal(true);
          }}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center space-x-2"
        >
          <FaPlus />
          <span>Add Resource</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-500">Title</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-500">Type</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-500">Details</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-500">Status</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-500">Actions</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {resources.map((resource) => (
              <tr key={resource.id} className="hover:bg-gray-50">
                <td className="py-3 px-6">
                  <div className="flex items-center space-x-3">
                    {getTypeIcon(resource.type)}
                    <span className="font-medium">{resource.title}</span>
                  </div>
                </td>
                <td className="py-3 px-6">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    resource.type === 'article' ? 'bg-blue-100 text-blue-700' :
                    resource.type === 'video' ? 'bg-red-100 text-red-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                  </span>
                </td>
                <td className="py-3 px-6 text-gray-600">
                  {resource.readTime && `${resource.readTime} read`}
                  {resource.duration && `${resource.duration} duration`}
                </td>
                <td className="py-3 px-6">
                  <span className={`px-2 py-1 rounded-full text-xs ${resource.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {resource.isPublished ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="py-3 px-6">
                  <div className="flex space-x-2">
                    <button onClick={() => handleEdit(resource)} className="text-blue-600 hover:text-blue-800">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(resource.id)} className="text-red-600 hover:text-red-800">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{editingResource ? 'Edit Resource' : 'Add Resource'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Resource Type *</label>
                <div className="flex space-x-4">
                  {['article', 'video', 'infographic'].map((type) => (
                    <label key={type} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        value={type}
                        checked={formData.type === type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="text-primary-600"
                      />
                      <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                    </label>
                  ))}
                </div>
              </div>
              {formData.type === 'article' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Content *</label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="input-field"
                      rows="6"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Read Time</label>
                    <input
                      type="text"
                      value={formData.readTime}
                      onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                      placeholder="e.g., 5 min"
                      className="input-field"
                    />
                  </div>
                </>
              )}
              {formData.type === 'video' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Video URL *</label>
                    <input
                      type="url"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      placeholder="https://youtube.com/watch?v=..."
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Duration</label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="e.g., 3:45"
                      className="input-field"
                    />
                  </div>
                </>
              )}
              {formData.type === 'infographic' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Download URL *</label>
                  <input
                    type="url"
                    value={formData.downloadUrl}
                    onChange={(e) => setFormData({ ...formData, downloadUrl: e.target.value })}
                    placeholder="/infographics/recycling-process.pdf"
                    className="input-field"
                    required
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">Image URL (Optional)</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="input-field"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="w-4 h-4 text-primary-600 rounded"
                />
                <label htmlFor="isPublished" className="text-sm font-medium">Publish immediately</label>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex items-center space-x-2">
                  <FaSave />
                  <span>{editingResource ? 'Update' : 'Create'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ManageResources;