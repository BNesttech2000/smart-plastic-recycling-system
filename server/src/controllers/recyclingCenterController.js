const RecyclingCenter = require('../models/RecyclingCenter');
const { asyncHandler } = require('../middleware/errorMiddleware');

// @desc    Get all recycling centers
// @route   GET /api/recycling-centers
// @access  Public
const getRecyclingCenters = asyncHandler(async (req, res) => {
  const centers = await RecyclingCenter.find({ isActive: true }).sort({ name: 1 });
  res.json({ success: true, data: centers });
});

// @desc    Get nearby recycling centers
// @route   GET /api/recycling-centers/nearby
// @access  Public
const getNearbyCenters = asyncHandler(async (req, res) => {
  const { lat, lng, radius = 10 } = req.query;
  
  if (!lat || !lng) {
    res.status(400);
    throw new Error('Latitude and longitude are required');
  }
  
  const centers = await RecyclingCenter.find({
    isActive: true,
    'coordinates.lat': { $gte: parseFloat(lat) - radius/111, $lte: parseFloat(lat) + radius/111 },
    'coordinates.lng': { $gte: parseFloat(lng) - radius/111, $lte: parseFloat(lng) + radius/111 }
  }).sort({ name: 1 });
  
  res.json({ success: true, data: centers });
});

// @desc    Get single recycling center by ID
// @route   GET /api/recycling-centers/:id
// @access  Public
const getCenterById = asyncHandler(async (req, res) => {
  const center = await RecyclingCenter.findById(req.params.id);
  if (!center) {
    res.status(404);
    throw new Error('Recycling center not found');
  }
  res.json({ success: true, data: center });
});

// ============ ADMIN CONTROLLERS ============

// @desc    Get all recycling centers (Admin)
// @route   GET /api/admin/recycling-centers
// @access  Private/Admin
const getAllRecyclingCenters = asyncHandler(async (req, res) => {
  const centers = await RecyclingCenter.find({}).sort({ createdAt: -1 });
  res.json({ success: true, data: centers });
});

// @desc    Create recycling center (Admin)
// @route   POST /api/admin/recycling-centers
// @access  Private/Admin
const createRecyclingCenter = asyncHandler(async (req, res) => {
  const center = await RecyclingCenter.create(req.body);
  res.status(201).json({ success: true, data: center });
});

// @desc    Update recycling center (Admin)
// @route   PUT /api/admin/recycling-centers/:id
// @access  Private/Admin
const updateRecyclingCenter = asyncHandler(async (req, res) => {
  const center = await RecyclingCenter.findById(req.params.id);
  if (!center) {
    res.status(404);
    throw new Error('Recycling center not found');
  }
  Object.assign(center, req.body);
  await center.save();
  res.json({ success: true, data: center });
});

// @desc    Delete recycling center (Admin)
// @route   DELETE /api/admin/recycling-centers/:id
// @access  Private/Admin
const deleteRecyclingCenter = asyncHandler(async (req, res) => {
  const center = await RecyclingCenter.findById(req.params.id);
  if (!center) {
    res.status(404);
    throw new Error('Recycling center not found');
  }
  await center.deleteOne();
  res.json({ success: true, message: 'Recycling center deleted successfully' });
});

module.exports = {
  getRecyclingCenters,
  getNearbyCenters,
  getCenterById,
  getAllRecyclingCenters,
  createRecyclingCenter,
  updateRecyclingCenter,
  deleteRecyclingCenter
};