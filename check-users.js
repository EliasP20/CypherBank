const axios = require('axios');

const checkUsers = async () => {
    try {
        console.log('Fetching all users...');
        const response = await axios.get('http://localhost:8080/api/users');
        console.log('All users in database:');
        response.data.forEach((user, index) => {
            console.log(`${index + 1}. ID: ${user.id}, Name: ${user.firstName} ${user.lastName}, Email: ${user.email}, Role: ${user.role}`);
        });
        
        console.log('\nLooking for user with email "epr@gmail.com"...');
        const specificUser = response.data.find(user => user.email === 'epr@gmail.com');
        if (specificUser) {
            console.log('Found user:', specificUser);
            
            // Check if this user has accounts
            console.log('Checking accounts for this user...');
            const accountsResponse = await axios.get(`http://localhost:8080/api/accounts/user/${specificUser.id}`);
            console.log('User accounts:', accountsResponse.data);
        } else {
            console.log('User with email "epr@gmail.com" not found!');
        }
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
};

checkUsers();


