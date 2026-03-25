import React, { useState, useEffect } from 'react';
import { 
  FaSave, 
  FaUserCog, 
  FaBell, 
  FaShieldAlt, 
  FaPalette,
  FaRecycle,
  FaTrophy,
  FaDollarSign,
  FaGlobe,
  FaMailBulk,
  FaDatabase,
  FaSync,
  FaLock
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'Smart Plastic Recycling System',
    siteDescription: 'Earn rewards while saving the environment',
    adminEmail: 'admin@recycling.com',
    supportEmail: 'support@recycling.com',
    
    // Incentive Settings
    pointsPerKgPET: 10,
    pointsPerKgHDPE: 8,
    pointsPerKgPVC: 6,
    pointsPerKgLDPE: 5,
    pointsPerKgPP: 7,
    pointsPerKgPS: 4,
    pointsPerKgOther: 2,
    
    // Bonus Settings
    bulkBonusThreshold: 10, // kg
    bulkBonusPercentage: 10, // %
    weeklyBonusEnabled: true,
    weeklyBonusPoints: 50,
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    adminAlerts: true,
    contributionAlerts: true,
    
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: 30, // minutes
    maxLoginAttempts: 5,
    
    // Appearance
    themeColor: 'blue',
    darkMode: false,
    compactMode: false,
    
    // System Settings
    maintenanceMode: false,
    autoApproveContributions: false,
    maxImageSize: 5, // MB
    allowedImageTypes: ['jpg', 'jpeg', 'png', 'gif'],
  });

  useEffect(() => {
    // Load settings from localStorage or API
    const savedSettings = localStorage.getItem('adminSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      [name]: parseInt(value) || 0,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Save to localStorage (temporary)
      localStorage.setItem('adminSettings', JSON.stringify(settings));
      
      // Here you would save to backend API
      // await api.post('/admin/settings', settings);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all settings to default?')) {
      setSettings({
        siteName: 'Smart Plastic Recycling System',
        siteDescription: 'Earn rewards while saving the environment',
        adminEmail: 'admin@recycling.com',
        supportEmail: 'support@recycling.com',
        pointsPerKgPET: 10,
        pointsPerKgHDPE: 8,
        pointsPerKgPVC: 6,
        pointsPerKgLDPE: 5,
        pointsPerKgPP: 7,
        pointsPerKgPS: 4,
        pointsPerKgOther: 2,
        bulkBonusThreshold: 10,
        bulkBonusPercentage: 10,
        weeklyBonusEnabled: true,
        weeklyBonusPoints: 50,
        emailNotifications: true,
        smsNotifications: false,
        adminAlerts: true,
        contributionAlerts: true,
        twoFactorAuth: false,
        sessionTimeout: 30,
        maxLoginAttempts: 5,
        themeColor: 'blue',
        darkMode: false,
        compactMode: false,
        maintenanceMode: false,
        autoApproveContributions: false,
        maxImageSize: 5,
        allowedImageTypes: ['jpg', 'jpeg', 'png', 'gif'],
      });
      toast.success('Settings reset to default');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">System Settings</h1>
        <p className="text-gray-600 mt-1">Configure your recycling system preferences</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Settings */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center">
            <FaGlobe className="text-gray-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">General Settings</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Name
              </label>
              <input
                type="text"
                name="siteName"
                value={settings.siteName}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Description
              </label>
              <input
                type="text"
                name="siteDescription"
                value={settings.siteDescription}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Email
              </label>
              <input
                type="email"
                name="adminEmail"
                value={settings.adminEmail}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Support Email
              </label>
              <input
                type="email"
                name="supportEmail"
                value={settings.supportEmail}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Incentive Points Settings */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center">
            <FaTrophy className="text-gray-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">Points Configuration</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PET (Plastic #1) - points/kg
              </label>
              <input
                type="number"
                name="pointsPerKgPET"
                value={settings.pointsPerKgPET}
                onChange={handleNumberChange}
                className="input-field"
                min="0"
                step="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                HDPE (Plastic #2) - points/kg
              </label>
              <input
                type="number"
                name="pointsPerKgHDPE"
                value={settings.pointsPerKgHDPE}
                onChange={handleNumberChange}
                className="input-field"
                min="0"
                step="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PVC (Plastic #3) - points/kg
              </label>
              <input
                type="number"
                name="pointsPerKgPVC"
                value={settings.pointsPerKgPVC}
                onChange={handleNumberChange}
                className="input-field"
                min="0"
                step="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LDPE (Plastic #4) - points/kg
              </label>
              <input
                type="number"
                name="pointsPerKgLDPE"
                value={settings.pointsPerKgLDPE}
                onChange={handleNumberChange}
                className="input-field"
                min="0"
                step="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PP (Plastic #5) - points/kg
              </label>
              <input
                type="number"
                name="pointsPerKgPP"
                value={settings.pointsPerKgPP}
                onChange={handleNumberChange}
                className="input-field"
                min="0"
                step="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PS (Plastic #6) - points/kg
              </label>
              <input
                type="number"
                name="pointsPerKgPS"
                value={settings.pointsPerKgPS}
                onChange={handleNumberChange}
                className="input-field"
                min="0"
                step="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Other Plastics - points/kg
              </label>
              <input
                type="number"
                name="pointsPerKgOther"
                value={settings.pointsPerKgOther}
                onChange={handleNumberChange}
                className="input-field"
                min="0"
                step="1"
              />
            </div>
          </div>
        </div>

        {/* Bonus Settings */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center">
            <FaRecycle className="text-gray-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">Bonus & Rewards</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bulk Bonus Threshold (kg)
              </label>
              <input
                type="number"
                name="bulkBonusThreshold"
                value={settings.bulkBonusThreshold}
                onChange={handleNumberChange}
                className="input-field"
                min="0"
              />
              <p className="text-xs text-gray-500 mt-1">Minimum kg to qualify for bulk bonus</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bulk Bonus Percentage (%)
              </label>
              <input
                type="number"
                name="bulkBonusPercentage"
                value={settings.bulkBonusPercentage}
                onChange={handleNumberChange}
                className="input-field"
                min="0"
                max="100"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Weekly Bonus
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="weeklyBonusEnabled"
                  checked={settings.weeklyBonusEnabled}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
            {settings.weeklyBonusEnabled && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weekly Bonus Points
                </label>
                <input
                  type="number"
                  name="weeklyBonusPoints"
                  value={settings.weeklyBonusPoints}
                  onChange={handleNumberChange}
                  className="input-field"
                  min="0"
                />
              </div>
            )}
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center">
            <FaBell className="text-gray-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive email alerts for system events</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={settings.emailNotifications}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">SMS Notifications</p>
                <p className="text-sm text-gray-500">Send SMS alerts (requires Twilio/Africa's Talking)</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="smsNotifications"
                  checked={settings.smsNotifications}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Admin Alerts</p>
                <p className="text-sm text-gray-500">Notify admins of important events</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="adminAlerts"
                  checked={settings.adminAlerts}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Contribution Alerts</p>
                <p className="text-sm text-gray-500">Get notified of new contributions</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="contributionAlerts"
                  checked={settings.contributionAlerts}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center">
            <FaLock className="text-gray-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">Security</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Two-Factor Authentication</p>
                <p className="text-sm text-gray-500">Add extra security to admin accounts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="twoFactorAuth"
                  checked={settings.twoFactorAuth}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                name="sessionTimeout"
                value={settings.sessionTimeout}
                onChange={handleNumberChange}
                className="input-field"
                min="5"
                max="120"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Login Attempts
              </label>
              <input
                type="number"
                name="maxLoginAttempts"
                value={settings.maxLoginAttempts}
                onChange={handleNumberChange}
                className="input-field"
                min="3"
                max="10"
              />
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center">
            <FaDatabase className="text-gray-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">System</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Maintenance Mode</p>
                <p className="text-sm text-gray-500">Temporarily disable user access</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Auto-Approve Contributions</p>
                <p className="text-sm text-gray-500">Skip manual approval for contributions</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="autoApproveContributions"
                  checked={settings.autoApproveContributions}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Image Size (MB)
              </label>
              <input
                type="number"
                name="maxImageSize"
                value={settings.maxImageSize}
                onChange={handleNumberChange}
                className="input-field"
                min="1"
                max="20"
                step="1"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pb-8">
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Reset to Default
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center space-x-2 px-6 py-2"
          >
            {loading ? (
              <FaSync className="animate-spin" />
            ) : (
              <FaSave />
            )}
            <span>{loading ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;