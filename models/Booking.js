const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    checkInDate: {
      type: Date,
      required: [true, 'Please provide check-in date'],
    },
    checkOutDate: {
      type: Date,
      required: [true, 'Please provide check-out date'],
    },
    numberOfGuests: {
      type: Number,
      required: [true, 'Please provide number of guests'],
      min: 1,
    },
    totalPrice: {
      type: Number,
      required: [true, 'Please provide total price'],
      min: 0,
    },
    specialRequests: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Validate check-out date is after check-in date
bookingSchema.pre('save', function (next) {
  if (this.checkOutDate <= this.checkInDate) {
    next(new Error('Check-out date must be after check-in date'));
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
