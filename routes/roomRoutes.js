const express = require('express');
const router = express.Router();
const {
  getRooms,
  getFeaturedRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
} = require('../controllers/roomController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getRooms);
router.get('/featured', getFeaturedRooms);
router.get('/:id', getRoom);

// Admin routes
router.post('/', protect, adminOnly, createRoom);
router.put('/:id', protect, adminOnly, updateRoom);
router.delete('/:id', protect, adminOnly, deleteRoom);

module.exports = router;
