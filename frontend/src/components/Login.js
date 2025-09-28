import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import axios from 'axios';

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'USER'
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // Login
        const response = await axios.post('/api/users/login', {
          email: formData.email,
          password: formData.password
        });
        if (response.data) {
          onLogin(response.data);
          showSnackbar('Login successful!', 'success');
        }
      } else {
        // Register
        const response = await axios.post('/api/users/register', formData);
        console.log('Registration response:', response);
        console.log('Response status:', response.status);
        console.log('Response data:', response.data);
        if (response.status === 201 && response.data) {
          onLogin(response.data);
          showSnackbar('Registration successful!', 'success');
        } else {
          showSnackbar('Registration failed - invalid response', 'error');
        }
      }
    } catch (error) {
      console.error(isLogin ? 'Login error:' : 'Registration error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      showSnackbar(isLogin ? 'Invalid email or password' : 'Registration failed', 'error');
    }
  };

  const handleTabChange = (event, newValue) => {
    setIsLogin(newValue === 0);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'USER'
    });
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
    >
      <Paper elevation={3} sx={{ p: 4, width: 400 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          🏦 CYPHERBANK
        </Typography>
        
        <Tabs value={isLogin ? 0 : 1} onChange={handleTabChange} centered>
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <TextField
                fullWidth
                label="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                margin="normal"
                required
                helperText="First name must be 2-50 characters"
              />
              <TextField
                fullWidth
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                margin="normal"
                required
                helperText="Last name must be 2-50 characters"
              />
            </>
          )}
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            margin="normal"
            required
            helperText="Enter a valid email address"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            margin="normal"
            required
            helperText="Password must be at least 6 characters"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              label="Role"
            >
              <MenuItem value="USER">Regular User</MenuItem>
              <MenuItem value="ADMIN">Administrator</MenuItem>
            </Select>
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {isLogin ? 'Login' : 'Register'}
          </Button>
        </form>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
};

export default Login;
