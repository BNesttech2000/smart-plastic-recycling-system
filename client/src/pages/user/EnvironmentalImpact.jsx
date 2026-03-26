import React, { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import { FaLeaf, FaWater, FaBolt, FaTrash, FaTree, FaCar, FaSpinner } from 'react-icons/fa';
import { motion } from 'framer-motion';

const EnvironmentalImpact = () => {
  const [impact, setImpact] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImpact();
  }, []);

  const fetchImpact = async () => {
    try {
      const response = await userService.getEnvironmentalImpact();
      setImpact(response.data);
    } catch (error) {
      console.error('Error fetching impact:', error);
      // Set default impact values for testing
      setImpact({
        totalWeight: 0,
        co2Saved: 0,
        treesEquivalent: 0,
        waterSaved: 0,
        energySaved: 0,
        landfillSpace: 0,
        oilSaved: 0,
        carbonOffset: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const impactMetrics = [
    {
      title: 'CO₂ Emissions Saved',
      value: impact?.co2Saved || 0,
      unit: 'kg',
      icon: FaLeaf,
      color: 'text-green-500',
      bg: 'bg-green-100',
      description: 'Carbon dioxide prevented from entering the atmosphere'
    },
    {
      title: 'Trees Equivalent',
      value: impact?.treesEquivalent || 0,
      unit: 'trees',
      icon: FaTree,
      color: 'text-emerald-500',
      bg: 'bg-emerald-100',
      description: 'Number of trees needed to absorb the same CO₂'
    },
    {
      title: 'Water Saved',
      value: impact?.waterSaved || 0,
      unit: 'liters',
      icon: FaWater,
      color: 'text-blue-500',
      bg: 'bg-blue-100',
      description: 'Water conserved through recycling'
    },
    {
      title: 'Energy Saved',
      value: impact?.energySaved || 0,
      unit: 'kWh',
      icon: FaBolt,
      color: 'text-yellow-500',
      bg: 'bg-yellow-100',
      description: 'Energy conserved through recycling'
    },
    {
      title: 'Landfill Space Saved',
      value: impact?.landfillSpace || 0,
      unit: 'm³',
      icon: FaTrash,
      color: 'text-red-500',
      bg: 'bg-red-100',
      description: 'Space preserved in landfills'
    },
    {
      title: 'Oil Saved',
      value: impact?.oilSaved || 0,
      unit: 'liters',
      icon: FaCar,
      color: 'text-orange-500',
      bg: 'bg-orange-100',
      description: 'Crude oil saved through plastic recycling'
    }
  ];

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaLeaf className="text-green-600 text-4xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Environmental Impact</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            See how your recycling efforts are making a difference for our planet
          </p>
        </motion.div>

        {/* Total Impact Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-8 mb-8 text-white text-center"
        >
          <h2 className="text-2xl font-bold mb-2">Total Plastic Recycled</h2>
          <p className="text-5xl font-bold mb-2">{impact?.totalWeight?.toFixed(1) || 0} kg</p>
          <p className="text-green-100">That's equivalent to saving the planet!</p>
        </motion.div>

        {/* Impact Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {impactMetrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${metric.bg} p-3 rounded-lg`}>
                  <metric.icon className={`${metric.color} text-2xl`} />
                </div>
                <span className="text-2xl font-bold text-gray-800">
                  {metric.value.toFixed(1)} <span className="text-sm text-gray-500">{metric.unit}</span>
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{metric.title}</h3>
              <p className="text-sm text-gray-500">{metric.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Fun Facts */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">Did You Know?</h3>
          <ul className="space-y-2 text-blue-700">
            <li>• Recycling 1 kg of plastic saves approximately 1.5 kg of CO₂ emissions</li>
            <li>• Every ton of recycled plastic saves 2,000-3,000 gallons of water</li>
            <li>• Recycling plastic uses 88% less energy than producing new plastic</li>
            <li>• One recycled plastic bottle can save enough energy to power a light bulb for 3 hours</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentalImpact;