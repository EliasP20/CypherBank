const axios = require('axios');

const createTestUser = async () => {
    try {
        // First, try to get all users to see what exists
        console.log('Fetching all users...');
        const usersResponse = await axios.get('http://localhost:8080/api/users');
        console.log('Existing users:', usersResponse.data);

        // Try to create a test user with the email from the error
        const testUserData = {
            firstName: "Test",
            lastName: "User",
            email: "epr@gmail.com",
            password: "testpassword",
            role: "USER"
        };

        console.log('Creating test user...');
        const response = await axios.post('http://localhost:8080/api/users/register', testUserData);
        console.log('Test user created successfully:', response.data);
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
};

createTestUser();



