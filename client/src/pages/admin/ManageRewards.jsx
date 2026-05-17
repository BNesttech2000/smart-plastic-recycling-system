import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaGift } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ManageRewards = () => {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingReward, setEditingReward] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    points: '',
    stock: '',
    imageUrl: ''
  });

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      // Replace with actual API call
      // const response = await api.get('/admin/rewards');
      // setRewards(response.data);
      
      // Mock data for now
      setRewards([
        { id: 1, name: 'Grocery Voucher', description: 'K50 grocery voucher', points: 500, stock: 50, imageUrl: '' },
        { id: 2, name: 'Recycling Bin', description: 'Premium recycling bin', points: 300, stock: 25, imageUrl: '' },
        { id: 3, name: 'Eco-Friendly Bag', description: 'Reusable shopping bag', points: 100, stock: 100, imageUrl: '' },
        { id: 4, name: 'Plant a Tree', description: 'We\'ll plant a tree in your name', points: 50, stock: 999, imageUrl: '' },
      ]);
    } catch (error) {
      toast.error('Failed to fetch rewards');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingReward) {
        // Update reward
        setRewards(rewards.map(r => r.id === editingReward.id ? { ...r, ...formData } : r));
        toast.success('Reward updated successfully');
      } else {
        // Create reward
        const newReward = { id: Date.now(), ...formData };
        setRewards([...rewards, newReward]);
        toast.success('Reward created successfully');
      }
      setShowModal(false);
      setEditingReward(null);
      setFormData({ name: '', description: '', points: '', stock: '', imageUrl: '' });
    } catch (error) {
      toast.error('Failed to save reward');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this reward?')) {
      try {
        setRewards(rewards.filter(r => r.id !== id));
        toast.success('Reward deleted successfully');
      } catch (error) {
        toast.error('Failed to delete reward');
      }
    }
  };

  const handleEdit = (reward) => {
    setEditingReward(reward);
    setFormData({
      name: reward.name,
      description: reward.description,
      points: reward.points,
      stock: reward.stock,
      imageUrl: reward.imageUrl || ''
    });
    setShowModal(true);
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
        <h1 className="text-2xl font-bold text-gray-800">Manage Rewards</h1>
        <button
          onClick={() => {
            setEditingReward(null);
            setFormData({ name: '', description: '', points: '', stock: '', imageUrl: '' });
            setShowModal(true);
          }}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center space-x-2"
        >
          <FaPlus />
          <span>Add Reward</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-500">Reward</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-500">Description</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-500">Points</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-500">Stock</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rewards.map((reward) => (
              <tr key={reward.id} className="hover:bg-gray-50">
                <td className="py-3 px-6">
                  <div className="flex items-center space-x-3">
                    <FaGift className="text-primary-500" />
                    <span className="font-medium">{reward.name}</span>
                  </div>
                </td>
                <td className="py-3 px-6 text-gray-600">{reward.description}</td>
                <td className="py-3 px-6 font-medium text-primary-600">{reward.points}</td>
                <td className="py-3 px-6">{reward.stock}</td>
                <td className="py-3 px-6">
                  <div className="flex space-x-2">
                    <button onClick={() => handleEdit(reward)} className="text-blue-600 hover:text-blue-800">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(reward.id)} className="text-red-600 hover:text-red-800">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">{editingReward ? 'Edit Reward' : 'Add Reward'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                  rows="2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Points Required</label>
                <input
                  type="number"
                  value={formData.points}
                  onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Stock</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image URL (optional)</label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="input-field"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingReward ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ManageRewards;