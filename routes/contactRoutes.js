const express = require('express');
const router = express.Router();
const {
  createContact,
  getAllContacts,
  getContact,
  updateContact,
  deleteContact,
} = require('../controllers/contactController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public route
router.post('/', createContact);

// Admin routes
router.get('/', protect, adminOnly, getAllContacts);
router.get('/:id', protect, adminOnly, getContact);
router.put('/:id', protect, adminOnly, updateContact);
router.delete('/:id', protect, adminOnly, deleteContact);

module.exports = router;
