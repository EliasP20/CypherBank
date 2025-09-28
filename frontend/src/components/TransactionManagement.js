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
  InputLabel,
  Chip
} from '@mui/material';
import { PlayArrow, Cancel, Add } from '@mui/icons-material';
import axios from 'axios';

const TransactionManagement = () => {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    fromAccountId: '',
    toAccountId: '',
    amount: '',
    type: 'TRANSFER'
  });

  useEffect(() => {
    fetchTransactions();
    fetchAccounts();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('/api/transactions');
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      showSnackbar('Error fetching transactions', 'error');
    }
  };

  const fetchAccounts = async () => {
    try {
      const response = await axios.get('/api/accounts');
      setAccounts(response.data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpen = () => {
    setFormData({
      fromAccountId: '',
      toAccountId: '',
      amount: '',
      type: 'TRANSFER'
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('/api/transactions', {
        fromAccountId: parseInt(formData.fromAccountId),
        toAccountId: parseInt(formData.toAccountId),
        amount: parseFloat(formData.amount),
        type: formData.type
      });
      showSnackbar('Transaction created successfully', 'success');
      fetchTransactions();
      handleClose();
    } catch (error) {
      console.error('Error creating transaction:', error);
      showSnackbar('Error creating transaction', 'error');
    }
  };

  const handleProcessTransaction = async (transactionId) => {
    try {
      await axios.post(`/api/transactions/${transactionId}/process`);
      showSnackbar('Transaction processed successfully', 'success');
      fetchTransactions();
    } catch (error) {
      console.error('Error processing transaction:', error);
      showSnackbar('Error processing transaction', 'error');
    }
  };

  const handleCancelTransaction = async (transactionId) => {
    if (window.confirm('Are you sure you want to cancel this transaction?')) {
      try {
        await axios.post(`/api/transactions/${transactionId}/cancel`);
        showSnackbar('Transaction cancelled successfully', 'success');
        fetchTransactions();
      } catch (error) {
        console.error('Error cancelling transaction:', error);
        showSnackbar('Error cancelling transaction', 'error');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'PENDING': return 'warning';
      case 'FAILED': return 'error';
      case 'CANCELLED': return 'default';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Transaction Management</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpen}
        >
          Create Transaction
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>From Account</TableCell>
              <TableCell>To Account</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Timestamp</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.id}</TableCell>
                <TableCell>{transaction.fromAccountId}</TableCell>
                <TableCell>{transaction.toAccountId}</TableCell>
                <TableCell>${transaction.amount}</TableCell>
                <TableCell>{transaction.type}</TableCell>
                <TableCell>{new Date(transaction.timestamp).toLocaleString()}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleProcessTransaction(transaction.id)}
                    color="success"
                    size="small"
                  >
                    <PlayArrow />
                  </IconButton>
                  <IconButton
                    onClick={() => handleCancelTransaction(transaction.id)}
                    color="error"
                    size="small"
                  >
                    <Cancel />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Create New Transaction</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>From Account</InputLabel>
                <Select
                  value={formData.fromAccountId}
                  onChange={(e) => setFormData({ ...formData, fromAccountId: e.target.value })}
                >
                  {accounts.map((account) => (
                    <MenuItem key={account.id} value={account.id}>
                      Account {account.id} - {account.type} (${account.balance})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>To Account</InputLabel>
                <Select
                  value={formData.toAccountId}
                  onChange={(e) => setFormData({ ...formData, toAccountId: e.target.value })}
                >
                  {accounts.map((account) => (
                    <MenuItem key={account.id} value={account.id}>
                      Account {account.id} - {account.type} (${account.balance})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Transaction Type</InputLabel>
                <Select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <MenuItem value="TRANSFER">Transfer</MenuItem>
                  <MenuItem value="DEPOSIT">Deposit</MenuItem>
                  <MenuItem value="WITHDRAW">Withdraw</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Create Transaction
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

export default TransactionManagement;

