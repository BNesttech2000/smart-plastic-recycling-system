import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { 
  FaPlus, FaEdit, FaTrash, FaSpinner, FaMapMarkerAlt, 
  FaPhone, FaClock, FaStar, FaSave, FaTimes 
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const ManageRecyclingCenters = () => {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCenter, setEditingCenter] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    hours: '',
    rating: 0,
    acceptedPlastics: [],
    coordinates: { lat: -15.3875, lng: 28.3228 },
    isActive: true
  });
  const [plasticTypes, setPlasticTypes] = useState(['PET', 'HDPE', 'PVC', 'LDPE', 'PP', 'PS', 'OTHER']);

  useEffect(() => {
    fetchCenters();
  }, []);

  const fetchCenters = async () => {
    try {
      // Replace with actual API call
      // const response = await api.get('/admin/recycling-centers');
      // setCenters(response.data);
      
      // Mock data for now
      setCenters([
        {
          id: 1,
          name: 'Lusaka Recycling Hub',
          address: 'Great East Road, Lusaka',
          phone: '+260 97 123 4567',
          hours: 'Mon-Fri: 8am-5pm, Sat: 9am-2pm',
          rating: 4.5,
          acceptedPlastics: ['PET', 'HDPE', 'PP'],
          coordinates: { lat: -15.3875, lng: 28.3228 },
          isActive: true
        },
        {
          id: 2,
          name: 'Ndola Waste Management',
          address: 'Independence Avenue, Ndola',
          phone: '+260 96 765 4321',
          hours: 'Mon-Sat: 7am-4pm',
          rating: 4.2,
          acceptedPlastics: ['PET', 'HDPE', 'LDPE', 'PP'],
          coordinates: { lat: -12.9667, lng: 28.6333 },
          isActive: true
        }
      ]);
    } catch (error) {
      toast.error('Failed to fetch recycling centers');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCenter) {
        setCenters(centers.map(c => c.id === editingCenter.id ? { ...c, ...formData } : c));
        toast.success('Recycling center updated successfully');
      } else {
        const newCenter = { id: Date.now(), ...formData };
        setCenters([...centers, newCenter]);
        toast.success('Recycling center created successfully');
      }
      setShowModal(false);
      setEditingCenter(null);
      resetForm();
    } catch (error) {
      toast.error('Failed to save recycling center');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this recycling center?')) {
      try {
        setCenters(centers.filter(c => c.id !== id));
        toast.success('Recycling center deleted successfully');
      } catch (error) {
        toast.error('Failed to delete recycling center');
      }
    }
  };

  const handleEdit = (center) => {
    setEditingCenter(center);
    setFormData({
      name: center.name,
      address: center.address,
      phone: center.phone,
      hours: center.hours,
      rating: center.rating,
      acceptedPlastics: center.acceptedPlastics,
      coordinates: center.coordinates,
      isActive: center.isActive
    });
    setShowModal(true);
  };

  const togglePlasticType = (type) => {
    if (formData.acceptedPlastics.includes(type)) {
      setFormData({
        ...formData,
        acceptedPlastics: formData.acceptedPlastics.filter(t => t !== type)
      });
    } else {
      setFormData({
        ...formData,
        acceptedPlastics: [...formData.acceptedPlastics, type]
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      phone: '',
      hours: '',
      rating: 0,
      acceptedPlastics: [],
      coordinates: { lat: -15.3875, lng: 28.3228 },
      isActive: true
    });
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
          <h1 className="text-2xl font-bold text-gray-800">Manage Recycling Centers</h1>
          <p className="text-gray-600">Add and manage recycling center locations</p>
        </div>
        <button
          onClick={() => {
            setEditingCenter(null);
            resetForm();
            setShowModal(true);
          }}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center space-x-2"
        >
          <FaPlus />
          <span>Add Center</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {centers.map((center) => (
          <div key={center.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-2">
                  <FaMapMarkerAlt className="text-primary-500 text-xl" />
                  <h3 className="text-xl font-semibold text-gray-800">{center.name}</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <FaStar className="text-yellow-500" />
                    <span className="text-sm font-medium">{center.rating}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${center.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {center.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-3">{center.address}</p>
              <div className="space-y-2 mb-4">
                <p className="flex items-center text-sm text-gray-500">
                  <FaPhone className="mr-2" />
                  {center.phone}
                </p>
                <p className="flex items-center text-sm text-gray-500">
                  <FaClock className="mr-2" />
                  {center.hours}
                </p>
              </div>
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Accepted Plastics:</p>
                <div className="flex flex-wrap gap-2">
                  {center.acceptedPlastics.map((type) => (
                    <span key={type} className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                      {type}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button onClick={() => handleEdit(center)} className="text-blue-600 hover:text-blue-800 p-2">
                  <FaEdit />
                </button>
                <button onClick={() => handleDelete(center.id)} className="text-red-600 hover:text-red-800 p-2">
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{editingCenter ? 'Edit Recycling Center' : 'Add Recycling Center'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Center Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Address *</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="input-field"
                  rows="2"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Phone *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                    className="input-field"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Operating Hours *</label>
                <input
                  type="text"
                  value={formData.hours}
                  onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                  placeholder="e.g., Mon-Fri: 8am-5pm, Sat: 9am-2pm"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Accepted Plastic Types</label>
                <div className="flex flex-wrap gap-2">
                  {plasticTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => togglePlasticType(type)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        formData.acceptedPlastics.includes(type)
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.coordinates.lat}
                    onChange={(e) => setFormData({
                      ...formData,
                      coordinates: { ...formData.coordinates, lat: parseFloat(e.target.value) }
                    })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.coordinates.lng}
                    onChange={(e) => setFormData({
                      ...formData,
                      coordinates: { ...formData.coordinates, lng: parseFloat(e.target.value) }
                    })}
                    className="input-field"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-primary-600 rounded"
                />
                <label htmlFor="isActive" className="text-sm font-medium">Active</label>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex items-center space-x-2">
                  <FaSave />
                  <span>{editingCenter ? 'Update' : 'Create'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ManageRecyclingCenters;