const Room = require('../models/Room');

// @desc    Get all rooms (public)
// @route   GET /api/rooms
// @access  Public
exports.getRooms = async (req, res) => {
  try {
    const { roomType, minPrice, maxPrice, capacity, available } = req.query;

    let query = {};

    if (roomType) {
      query.roomType = roomType;
    }

    if (available === 'true') {
      query.isAvailable = true;
    }

    if (capacity) {
      query.capacity = { $gte: parseInt(capacity) };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }

    const rooms = await Room.find(query);

    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get featured rooms
// @route   GET /api/rooms/featured
// @access  Public
exports.getFeaturedRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ featured: true, isAvailable: true });

    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single room
// @route   GET /api/rooms/:id
// @access  Public
exports.getRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }

    res.status(200).json({
      success: true,
      data: room,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create room
// @route   POST /api/admin/rooms
// @access  Private/Admin
exports.createRoom = async (req, res) => {
  try {
    const room = await Room.create(req.body);

    res.status(201).json({
      success: true,
      data: room,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update room
// @route   PUT /api/admin/rooms/:id
// @access  Private/Admin
exports.updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }

    res.status(200).json({
      success: true,
      data: room,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete room
// @route   DELETE /api/admin/rooms/:id
// @access  Private/Admin
exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Room deleted successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
