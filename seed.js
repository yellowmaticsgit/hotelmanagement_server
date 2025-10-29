const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');
const Room = require('./models/Room');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const seedDatabase = async () => {
  try {
    console.log('Seeding database...');

    // Clear existing data
    await Admin.deleteMany();
    await Room.deleteMany();
    console.log('Cleared existing data');

    // Create admin user
    const admin = await Admin.create({
      name: 'Admin User',
      email: 'admin@hotel.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log('Admin created:', admin.email);

    // Create sample rooms
    const rooms = await Room.insertMany([
      {
        roomNumber: '101',
        roomType: 'single',
        description: 'Cozy single room with city view, perfect for solo travelers',
        price: 99,
        capacity: 1,
        amenities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar'],
        images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'],
        isAvailable: true,
        featured: true,
      },
      {
        roomNumber: '201',
        roomType: 'double',
        description: 'Spacious double room with comfortable king-size bed',
        price: 149,
        capacity: 2,
        amenities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Room Service'],
        images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'],
        isAvailable: true,
        featured: true,
      },
      {
        roomNumber: '301',
        roomType: 'suite',
        description: 'Luxurious suite with separate living area and panoramic views',
        price: 299,
        capacity: 4,
        amenities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Room Service', 'Jacuzzi', 'Balcony'],
        images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'],
        isAvailable: true,
        featured: true,
      },
      {
        roomNumber: '401',
        roomType: 'deluxe',
        description: 'Premium deluxe room with ocean view and exclusive amenities',
        price: 399,
        capacity: 3,
        amenities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Room Service', 'Jacuzzi', 'Balcony', 'Butler Service'],
        images: ['https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800'],
        isAvailable: true,
        featured: false,
      },
      {
        roomNumber: '102',
        roomType: 'single',
        description: 'Comfortable single room with modern amenities',
        price: 89,
        capacity: 1,
        amenities: ['WiFi', 'TV', 'Air Conditioning'],
        images: ['https://images.unsplash.com/photo-1631049035182-249067d7618e?w=800'],
        isAvailable: true,
        featured: false,
      },
      {
        roomNumber: '202',
        roomType: 'double',
        description: 'Modern double room with garden view',
        price: 139,
        capacity: 2,
        amenities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar'],
        images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'],
        isAvailable: true,
        featured: false,
      },
    ]);

    console.log(`Created ${rooms.length} rooms`);
    console.log('\nSeed completed successfully!');
    console.log('\nAdmin Login:');
    console.log('Email: admin@hotel.com');
    console.log('Password: admin123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
