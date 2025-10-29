const Booking = require('../models/Booking');
const Room = require('../models/Room');

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate, numberOfGuests, totalPrice, specialRequests } = req.body;

    // Check if room exists and is available
    const roomExists = await Room.findById(room);

    if (!roomExists) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }

    if (!roomExists.isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Room is not available',
      });
    }

    // Check if room is already booked for these dates
    const existingBooking = await Booking.findOne({
      room,
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        {
          checkInDate: { $lte: new Date(checkInDate) },
          checkOutDate: { $gte: new Date(checkInDate) },
        },
        {
          checkInDate: { $lte: new Date(checkOutDate) },
          checkOutDate: { $gte: new Date(checkOutDate) },
        },
      ],
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: 'Room is already booked for these dates',
      });
    }

    const booking = await Booking.create({
      user: req.user._id,
      room,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      totalPrice,
      specialRequests,
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('room')
      .populate('user', 'firstName lastName email phone');

    res.status(201).json({
      success: true,
      data: populatedBooking,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings/user/:userId
// @access  Private
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.userId })
      .populate('room')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all bookings (admin)
// @route   GET /api/admin/bookings
// @access  Private/Admin
exports.getAllBookings = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;

    let query = {};

    if (status) {
      query.status = status;
    }

    if (startDate || endDate) {
      query.checkInDate = {};
      if (startDate) query.checkInDate.$gte = new Date(startDate);
      if (endDate) query.checkInDate.$lte = new Date(endDate);
    }

    const bookings = await Booking.find(query)
      .populate('room')
      .populate('user', 'firstName lastName email phone')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('room')
      .populate('user', 'firstName lastName email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private
exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('room').populate('user', 'firstName lastName email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update booking status (admin)
// @route   PUT /api/admin/bookings/:id/status
// @access  Private/Admin
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('room').populate('user', 'firstName lastName email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete booking (cancel)
// @route   DELETE /api/bookings/:id
// @access  Private
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Update status to cancelled instead of deleting
    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get dashboard stats (admin)
// @route   GET /api/admin/dashboard/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const totalRooms = await Room.countDocuments();
    const availableRooms = await Room.countDocuments({ isAvailable: true });

    // Calculate revenue
    const completedBookings = await Booking.find({ status: 'completed', paymentStatus: 'paid' });
    const totalRevenue = completedBookings.reduce((sum, booking) => sum + booking.totalPrice, 0);

    // Recent bookings
    const recentBookings = await Booking.find()
      .populate('room')
      .populate('user', 'firstName lastName email')
      .sort('-createdAt')
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalBookings,
        pendingBookings,
        confirmedBookings,
        totalRooms,
        availableRooms,
        totalRevenue,
        recentBookings,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
