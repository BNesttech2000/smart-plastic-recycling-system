const express = require('express');
const router = express.Router();
const {
  getResources,
  getResourceById,
  incrementViewCount
} = require('../controllers/resourceController');

router.get('/', getResources);
router.get('/:id', getResourceById);
router.post('/:id/view', incrementViewCount);

module.exports = router;