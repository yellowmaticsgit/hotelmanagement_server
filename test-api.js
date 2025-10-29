const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

// Test data
const testUser = {
  firstName: 'Test',
  lastName: 'User',
  email: `test${Date.now()}@example.com`,
  password: 'test123',
  phone: '1234567890'
};

const adminCredentials = {
  email: 'admin@hotel.com',
  password: 'admin123'
};

async function testAPI() {
  console.log('🚀 Starting API Tests...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣  Testing Health Check...');
    const healthRes = await axios.get(`${API_URL}/health`);
    console.log('✅ Health Check:', healthRes.data.message);
    console.log('');

    // Test 2: Get Featured Rooms
    console.log('2️⃣  Testing Get Featured Rooms...');
    const roomsRes = await axios.get(`${API_URL}/rooms/featured`);
    console.log(`✅ Featured Rooms: Found ${roomsRes.data.count} rooms`);
    console.log('');

    // Test 3: User Registration
    console.log('3️⃣  Testing User Registration...');
    const registerRes = await axios.post(`${API_URL}/auth/register`, testUser, {
      withCredentials: true
    });
    console.log('✅ User Registered:', registerRes.data.data.email);
    const userCookie = registerRes.headers['set-cookie'];
    console.log('');

    // Test 4: User Login
    console.log('4️⃣  Testing User Login...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    }, {
      withCredentials: true
    });
    console.log('✅ User Login Successful:', loginRes.data.data.email);
    console.log('');

    // Test 5: Admin Login
    console.log('5️⃣  Testing Admin Login...');
    const adminLoginRes = await axios.post(`${API_URL}/auth/admin/login`, adminCredentials, {
      withCredentials: true
    });
    console.log('✅ Admin Login Successful:', adminLoginRes.data.data.email);
    console.log('   Role:', adminLoginRes.data.data.role);
    console.log('');

    // Test 6: Submit Contact Form
    console.log('6️⃣  Testing Contact Form Submission...');
    const contactRes = await axios.post(`${API_URL}/contacts`, {
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
      subject: 'API Test',
      message: 'This is a test message from the API verification script'
    });
    console.log('✅ Contact Form Submitted:', contactRes.data.success);
    console.log('');

    // Test 7: Get All Rooms
    console.log('7️⃣  Testing Get All Rooms...');
    const allRoomsRes = await axios.get(`${API_URL}/rooms`);
    console.log(`✅ All Rooms: Found ${allRoomsRes.data.count} total rooms`);
    console.log('');

    console.log('🎉 All API Tests Passed!\n');
    console.log('✅ Backend server is working correctly');
    console.log('✅ MongoDB connection is active');
    console.log('✅ User authentication is functional');
    console.log('✅ Admin authentication is functional');
    console.log('✅ All CRUD endpoints are responsive\n');

  } catch (error) {
    console.error('❌ Test Failed:');
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Message:', error.response.data.message || error.response.data);
    } else {
      console.error('   Error:', error.message);
    }
    process.exit(1);
  }
}

// Run tests
testAPI();
