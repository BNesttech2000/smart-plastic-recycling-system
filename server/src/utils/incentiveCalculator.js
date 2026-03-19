// server/src/utils/incentiveCalculator.js
/**
 * Calculate incentive points based on plastic type and quantity
 * @param {string} plasticType - Type of plastic (PET, HDPE, PVC, LDPE, PP, PS, OTHER)
 * @param {number} quantity - Quantity in kg
 * @returns {number} - Calculated points
 */
const calculateIncentivePoints = (plasticType, quantity) => {
  // Points per kg for different plastic types
  const pointsPerKg = {
    'PET': parseInt(process.env.INCENTIVE_POINTS_PER_KG_PET) || 10,
    'HDPE': parseInt(process.env.INCENTIVE_POINTS_PER_KG_HDPE) || 8,
    'PVC': parseInt(process.env.INCENTIVE_POINTS_PER_KG_PVC) || 6,
    'LDPE': parseInt(process.env.INCENTIVE_POINTS_PER_KG_LDPE) || 5,
    'PP': parseInt(process.env.INCENTIVE_POINTS_PER_KG_PP) || 7,
    'PS': parseInt(process.env.INCENTIVE_POINTS_PER_KG_PS) || 4,
    'OTHER': parseInt(process.env.INCENTIVE_POINTS_PER_KG_OTHER) || 2
  };

  const points = pointsPerKg[plasticType] || pointsPerKg['OTHER'];
  
  // Calculate total points (rounded to 2 decimal places)
  const totalPoints = points * quantity;
  
  // Additional bonus for larger quantities (optional)
  let bonus = 0;
  if (quantity >= 10) {
    bonus = totalPoints * 0.1; // 10% bonus for 10+ kg
  } else if (quantity >= 5) {
    bonus = totalPoints * 0.05; // 5% bonus for 5+ kg
  }

  return Math.round((totalPoints + bonus) * 100) / 100;
};

/**
 * Convert points to monetary value (optional feature)
 * @param {number} points - Points earned
 * @returns {number} - Monetary value in local currency
 */
const pointsToMoney = (points) => {
  const conversionRate = 0.1; // 10 points = 1 currency unit
  return points * conversionRate;
};

/**
 * Get reward tier based on points
 * @param {number} points - Total points
 * @returns {Object} - Reward tier information
 */
const getRewardTier = (points) => {
  if (points >= 1000) {
    return { tier: 'Platinum', multiplier: 2.0, benefits: ['Priority collection', 'Double points'] };
  } else if (points >= 500) {
    return { tier: 'Gold', multiplier: 1.5, benefits: ['Bonus points', 'Monthly rewards'] };
  } else if (points >= 100) {
    return { tier: 'Silver', multiplier: 1.2, benefits: ['Small bonuses'] };
  } else {
    return { tier: 'Bronze', multiplier: 1.0, benefits: ['Basic rewards'] };
  }
};

module.exports = { calculateIncentivePoints, pointsToMoney, getRewardTier };