const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: [true, 'Please provide room number'],
      unique: true,
      trim: true,
    },
    roomType: {
      type: String,
      required: [true, 'Please provide room type'],
      enum: ['single', 'double', 'suite', 'deluxe'],
    },
    description: {
      type: String,
      required: [true, 'Please provide room description'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide room price'],
      min: 0,
    },
    capacity: {
      type: Number,
      required: [true, 'Please provide room capacity'],
      min: 1,
    },
    amenities: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Room', roomSchema);
