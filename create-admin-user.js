// Simple script to create an admin user for testing
const axios = require('axios');

const createAdminUser = async () => {
  try {
    const adminData = {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@cypherbank.com',
      password: 'admin123',
      role: 'ADMIN'
    };

    console.log('Creating admin user...');
    const response = await axios.post('http://localhost:8080/api/users/create-admin', adminData);
    
    console.log('Admin user created successfully!');
    console.log('Admin user details:', response.data);
    console.log('\nYou can now login with:');
    console.log('Email: admin@cypherbank.com');
    console.log('Password: admin123');
    
  } catch (error) {
    console.error('Error creating admin user:', error.response?.data || error.message);
  }
};

createAdminUser();


