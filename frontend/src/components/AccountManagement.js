import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  IconButton,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import axios from 'axios';

const AccountManagement = () => {
  const [accounts, setAccounts] = useState([]);
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    userId: '',
    type: 'Transfer Account',
    initialBalance: ''
  });

  useEffect(() => {
    fetchAccounts();
    fetchUsers();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get('/api/accounts');
      setAccounts(response.data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      showSnackbar('Error fetching accounts', 'error');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpen = (account = null) => {
    if (account) {
      setEditingAccount(account);
      setFormData({
        userId: account.userId,
        type: account.type,
        initialBalance: account.balance
      });
    } else {
      setEditingAccount(null);
      setFormData({
        userId: '',
        type: 'Transfer Account',
        initialBalance: ''
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingAccount(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingAccount) {
        await axios.put(`/api/accounts/${editingAccount.id}/balance`, null, {
          params: { newBalance: formData.initialBalance }
        });
        showSnackbar('Account updated successfully', 'success');
      } else {
        await axios.post('/api/accounts', null, {
          params: {
            userId: formData.userId,
            type: formData.type,
            initialBalance: formData.initialBalance
          }
        });
        showSnackbar('Account created successfully', 'success');
      }
      fetchAccounts();
      handleClose();
    } catch (error) {
      console.error('Error saving account:', error);
      showSnackbar('Error saving account', 'error');
    }
  };

  const handleDelete = async (accountId) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      try {
        await axios.delete(`/api/accounts/${accountId}`);
        showSnackbar('Account deleted successfully', 'success');
        fetchAccounts();
      } catch (error) {
        console.error('Error deleting account:', error);
        showSnackbar('Error deleting account', 'error');
      }
    }
  };

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : 'Unknown User';
  };

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        mb={3}
        sx={{ 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          alignItems: { xs: 'stretch', sm: 'center' }
        }}
      >
        <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
          Account Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpen()}
          sx={{ minWidth: 'fit-content' }}
        >
          Add Account
        </Button>
      </Box>

      <TableContainer 
        component={Paper} 
        sx={{ 
          width: '100%',
          overflowX: 'auto',
          '& .MuiTable-root': {
            minWidth: 600
          }
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ minWidth: 60 }}>ID</TableCell>
              <TableCell sx={{ minWidth: 120 }}>User</TableCell>
              <TableCell sx={{ minWidth: 100 }}>Type</TableCell>
              <TableCell sx={{ minWidth: 100 }}>Balance</TableCell>
              <TableCell sx={{ minWidth: 100 }}>Created</TableCell>
              <TableCell sx={{ minWidth: 120 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell sx={{ minWidth: 60 }}>{account.id}</TableCell>
                <TableCell sx={{ minWidth: 120 }}>{getUserName(account.userId)}</TableCell>
                <TableCell sx={{ minWidth: 100 }}>{account.type}</TableCell>
                <TableCell sx={{ minWidth: 100 }}>${account.balance}</TableCell>
                <TableCell sx={{ minWidth: 100 }}>{new Date(account.createdAt).toLocaleDateString()}</TableCell>
                <TableCell sx={{ minWidth: 120 }}>
                  <IconButton onClick={() => handleOpen(account)} color="primary" size="small">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(account.id)} color="error" size="small">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingAccount ? 'Edit Account' : 'Add New Account'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>User</InputLabel>
                <Select
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  disabled={editingAccount}
                >
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.firstName} {user.lastName} ({user.email})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Account Type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                disabled={editingAccount}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Balance"
                type="number"
                value={formData.initialBalance}
                onChange={(e) => setFormData({ ...formData, initialBalance: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingAccount ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AccountManagement;

