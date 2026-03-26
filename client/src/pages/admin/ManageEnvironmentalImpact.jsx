import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { FaSpinner, FaLeaf, FaSave, FaInfoCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ManageEnvironmentalImpact = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    co2PerKg: 1.5,
    waterPerKg: 2000,
    energyPerKg: 88,
    oilPerKg: 1.5,
    treesPerTon: 20,
    landfillPerKg: 0.05,
    updateFrequency: 'daily',
    autoRecalculate: true,
    displayUnits: 'metric'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      // Replace with actual API call
      // const response = await api.get('/admin/environmental-impact/settings');
      // setSettings(response.data);
      
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch settings');
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Replace with actual API call
      // await api.put('/admin/environmental-impact/settings', settings);
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
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
          <h1 className="text-2xl font-bold text-gray-800">Environmental Impact Settings</h1>
          <p className="text-gray-600">Configure how environmental impact is calculated</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center space-x-2 disabled:opacity-50"
        >
          <FaSave className={saving ? 'animate-spin' : ''} />
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FaLeaf className="text-green-500 mr-2" />
          Calculation Factors
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CO₂ Emissions per kg of plastic
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                step="0.1"
                value={settings.co2PerKg}
                onChange={(e) => setSettings({ ...settings, co2PerKg: parseFloat(e.target.value) })}
                className="input-field"
              />
              <span className="text-gray-500">kg CO₂/kg plastic</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Each kg of plastic recycled saves this much CO₂</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Water Saved per kg of plastic
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                step="100"
                value={settings.waterPerKg}
                onChange={(e) => setSettings({ ...settings, waterPerKg: parseFloat(e.target.value) })}
                className="input-field"
              />
              <span className="text-gray-500">liters/kg plastic</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Water conserved through recycling</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Energy Saved per kg of plastic
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                step="1"
                value={settings.energyPerKg}
                onChange={(e) => setSettings({ ...settings, energyPerKg: parseFloat(e.target.value) })}
                className="input-field"
              />
              <span className="text-gray-500">% energy saved</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Percentage of energy saved vs. producing new plastic</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Oil Saved per kg of plastic
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                step="0.1"
                value={settings.oilPerKg}
                onChange={(e) => setSettings({ ...settings, oilPerKg: parseFloat(e.target.value) })}
                className="input-field"
              />
              <span className="text-gray-500">liters/kg plastic</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Crude oil saved through recycling</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trees per Ton of plastic
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                step="1"
                value={settings.treesPerTon}
                onChange={(e) => setSettings({ ...settings, treesPerTon: parseFloat(e.target.value) })}
                className="input-field"
              />
              <span className="text-gray-500">trees/ton plastic</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Number of trees equivalent to carbon offset</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Landfill Space Saved per kg
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                step="0.01"
                value={settings.landfillPerKg}
                onChange={(e) => setSettings({ ...settings, landfillPerKg: parseFloat(e.target.value) })}
                className="input-field"
              />
              <span className="text-gray-500">m³/kg plastic</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Space preserved in landfills</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">System Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Update Frequency</label>
            <select
              value={settings.updateFrequency}
              onChange={(e) => setSettings({ ...settings, updateFrequency: e.target.value })}
              className="input-field"
            >
              <option value="realtime">Real-time</option>
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">How often to recalculate impact data</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Display Units</label>
            <select
              value={settings.displayUnits}
              onChange={(e) => setSettings({ ...settings, displayUnits: e.target.value })}
              className="input-field"
            >
              <option value="metric">Metric (kg, liters)</option>
              <option value="imperial">Imperial (lbs, gallons)</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex items-center space-x-2">
          <input
            type="checkbox"
            id="autoRecalculate"
            checked={settings.autoRecalculate}
            onChange={(e) => setSettings({ ...settings, autoRecalculate: e.target.checked })}
            className="w-4 h-4 text-primary-600 rounded"
          />
          <label htmlFor="autoRecalculate" className="text-sm font-medium text-gray-700">
            Automatically recalculate environmental impact
          </label>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <FaInfoCircle className="text-blue-500 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-800 mb-1">About Environmental Impact Calculations</h3>
            <p className="text-sm text-blue-700">
              These factors are used to calculate the environmental impact of recycled plastic. 
              Values are based on industry standards and can be adjusted based on local conditions 
              and recycling methods. Changes will affect all future calculations and may trigger 
              a recalculation of historical data if auto-recalculation is enabled.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageEnvironmentalImpact;