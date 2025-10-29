const express = require('express');
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  getAllBookings,
  getBooking,
  updateBooking,
  updateBookingStatus,
  deleteBooking,
  getDashboardStats,
} = require('../controllers/bookingController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// User routes
router.post('/', protect, createBooking);
router.get('/user/:userId', protect, getUserBookings);
router.get('/:id', protect, getBooking);
router.put('/:id', protect, updateBooking);
router.delete('/:id', protect, deleteBooking);

// Admin routes
router.get('/admin/all', protect, adminOnly, getAllBookings);
router.put('/admin/:id/status', protect, adminOnly, updateBookingStatus);
router.get('/admin/dashboard/stats', protect, adminOnly, getDashboardStats);

module.exports = router;
