const express = require('express');
const router = express.Router();
const {
  getAllResources,
  createResource,
  updateResource,
  deleteResource
} = require('../controllers/resourceController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect);
router.use(admin);

router.get('/', getAllResources);
router.post('/', createResource);
router.put('/:id', updateResource);
router.delete('/:id', deleteResource);

module.exports = router;