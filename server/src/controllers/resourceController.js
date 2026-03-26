const Resource = require('../models/Resource');
const { asyncHandler } = require('../middleware/errorMiddleware');

// @desc    Get all published resources
// @route   GET /api/resources
// @access  Public
const getResources = asyncHandler(async (req, res) => {
  const { type } = req.query;
  const filter = { isPublished: true };
  if (type) filter.type = type;
  
  const resources = await Resource.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, data: resources });
});

// @desc    Get single resource
// @route   GET /api/resources/:id
// @access  Public
const getResourceById = asyncHandler(async (req, res) => {
  const resource = await Resource.findById(req.params.id);
  if (!resource) {
    res.status(404);
    throw new Error('Resource not found');
  }
  res.json({ success: true, data: resource });
});

// @desc    Increment view count
// @route   POST /api/resources/:id/view
// @access  Public
const incrementViewCount = asyncHandler(async (req, res) => {
  const resource = await Resource.findById(req.params.id);
  if (!resource) {
    res.status(404);
    throw new Error('Resource not found');
  }
  resource.viewCount += 1;
  await resource.save();
  res.json({ success: true, viewCount: resource.viewCount });
});

// ============ ADMIN CONTROLLERS ============

// @desc    Create resource (Admin)
// @route   POST /api/admin/resources
// @access  Private/Admin
const createResource = asyncHandler(async (req, res) => {
  const resource = await Resource.create(req.body);
  res.status(201).json({ success: true, data: resource });
});

// @desc    Update resource (Admin)
// @route   PUT /api/admin/resources/:id
// @access  Private/Admin
const updateResource = asyncHandler(async (req, res) => {
  const resource = await Resource.findById(req.params.id);
  if (!resource) {
    res.status(404);
    throw new Error('Resource not found');
  }
  Object.assign(resource, req.body);
  await resource.save();
  res.json({ success: true, data: resource });
});

// @desc    Delete resource (Admin)
// @route   DELETE /api/admin/resources/:id
// @access  Private/Admin
const deleteResource = asyncHandler(async (req, res) => {
  const resource = await Resource.findById(req.params.id);
  if (!resource) {
    res.status(404);
    throw new Error('Resource not found');
  }
  await resource.deleteOne();
  res.json({ success: true, message: 'Resource deleted successfully' });
});

// @desc    Get all resources (Admin)
// @route   GET /api/admin/resources
// @access  Private/Admin
const getAllResources = asyncHandler(async (req, res) => {
  const resources = await Resource.find({}).sort({ createdAt: -1 });
  res.json({ success: true, data: resources });
});

module.exports = {
  getResources,
  getResourceById,
  incrementViewCount,
  createResource,
  updateResource,
  deleteResource,
  getAllResources
};