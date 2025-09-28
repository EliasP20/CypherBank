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
  Card,
  CardContent,
  Chip,
  Avatar,
  Divider,
  LinearProgress,
  Fab
} from '@mui/material';
import {
  Edit,
  Delete,
  Add,
  CreditCard,
  AccountBalance,
  TrendingUp,
  TrendingDown,
  MoreVert,
  AttachMoney,
  AccountBalanceWallet,
  SwapHoriz
} from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';
import axios from 'axios';

const MyAccounts = ({ currentUser }) => {
  const { isDarkMode } = useTheme();
  const [accounts, setAccounts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'Checking',
    initialBalance: ''
  });

  useEffect(() => {
    if (currentUser) {
      fetchMyAccounts();
    }
  }, [currentUser]);

  const fetchMyAccounts = async () => {
    try {
      setLoading(true);
      console.log('Fetching accounts for user ID:', currentUser.id);
      const response = await axios.get(`/api/accounts/user/${currentUser.id}`);
      console.log('Accounts response:', response.data);
      setAccounts(response.data);
    } catch (error) {
      console.error('Error fetching my accounts:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      showSnackbar(`Error fetching accounts: ${error.response?.data?.message || error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpen = (account = null) => {
    if (account) {
      setEditingAccount(account);
      setFormData({
        type: account.type,
        initialBalance: account.balance
      });
    } else {
      setEditingAccount(null);
      setFormData({
        type: 'Checking',
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
      setLoading(true);
      if (editingAccount) {
        await axios.put(`/api/accounts/${editingAccount.id}/balance`, null, {
          params: { newBalance: formData.initialBalance }
        });
        showSnackbar('Account updated successfully', 'success');
      } else {
        await axios.post('/api/accounts', null, {
          params: {
            userId: currentUser.id,
            type: formData.type,
            initialBalance: parseFloat(formData.initialBalance) || 0
          }
        });
        showSnackbar('Account created successfully', 'success');
      }
      fetchMyAccounts();
      handleClose();
    } catch (error) {
      console.error('Error saving account:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      showSnackbar(`Error saving account: ${error.response?.data?.message || error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (accountId) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      try {
        setLoading(true);
        await axios.delete(`/api/accounts/${accountId}`);
        showSnackbar('Account deleted successfully', 'success');
        fetchMyAccounts();
      } catch (error) {
        console.error('Error deleting account:', error);
        showSnackbar('Error deleting account', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const getTotalBalance = () => {
    return accounts.reduce((total, account) => total + (parseFloat(account.balance) || 0), 0);
  };

  const getAccountTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'checking': return '#1976d2';
      case 'savings': return '#2e7d32';
      case 'transfer account': return '#7b1fa2';
      default: return '#666666';
    }
  };

  const getAccountTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'checking': return <AccountBalance />;
      case 'savings': return <TrendingUp />;
      case 'transfer account': return <SwapHoriz />;
      default: return <CreditCard />;
    }
  };

  const AccountCard = ({ account, index }) => (
    <Card 
      sx={{ 
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${getAccountTypeColor(account.type)}, ${getAccountTypeColor(account.type)}dd)`,
        color: 'white',
        '&:hover': {
          transform: 'translateY(-4px)',
          transition: 'transform 0.3s ease',
          boxShadow: 6
        }
      }}
    >
      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 40, height: 40 }}>
              {getAccountTypeIcon(account.type)}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {account.type}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Account #{account.id}
              </Typography>
            </Box>
          </Box>
          <IconButton 
            sx={{ color: 'white' }}
            onClick={(e) => {
              e.stopPropagation();
              // Add menu functionality here
            }}
          >
            <MoreVert />
          </IconButton>
        </Box>

        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            ${parseFloat(account.balance).toFixed(2)}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
            Current Balance
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Created: {new Date(account.createdAt).toLocaleDateString()}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton 
              size="small" 
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                color: 'white',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleOpen(account);
              }}
            >
              <Edit fontSize="small" />
            </IconButton>
            <IconButton 
              size="small" 
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                color: 'white',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(account.id);
              }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading && accounts.length === 0) {
    return (
      <Box sx={{ width: '100%', p: 3 }}>
        <LinearProgress />
        <Typography sx={{ mt: 2, textAlign: 'center' }}>Loading your accounts...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          My Accounts
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your bank accounts and view your balances.
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
                ${getTotalBalance().toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Balance
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main', mb: 1 }}>
                {accounts.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Accounts
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'info.main', mb: 1 }}>
                {accounts.filter(acc => parseFloat(acc.balance) > 0).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Accounts with Balance
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main', mb: 1 }}>
                {accounts.filter(acc => parseFloat(acc.balance) === 0).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Empty Accounts
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Accounts Grid */}
      {accounts.length > 0 ? (
        <Grid container spacing={3}>
          {accounts.map((account, index) => (
            <Grid item xs={12} sm={6} md={4} key={account.id}>
              <AccountCard account={account} index={index} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Card sx={{ textAlign: 'center', py: 6 }}>
          <CardContent>
            <AccountBalanceWallet sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              No accounts yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Create your first account to start managing your finances.
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpen()}
              size="large"
            >
              Create Account
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add account"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
          '&:hover': {
            background: 'linear-gradient(45deg, #1565c0, #1976d2)',
          }
        }}
        onClick={() => handleOpen()}
      >
        <Add />
      </Fab>

      {/* Add/Edit Dialog */}
      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          pb: 1
        }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            <Add />
          </Avatar>
          {editingAccount ? 'Edit Account' : 'Create New Account'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Account Type</InputLabel>
                <Select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  disabled={editingAccount}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="Checking">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccountBalance />
                      Checking
                    </Box>
                  </MenuItem>
                  <MenuItem value="Savings">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TrendingUp />
                      Savings
                    </Box>
                  </MenuItem>
                  <MenuItem value="Transfer Account">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <SwapHoriz />
                      Transfer Account
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Initial Balance"
                type="number"
                value={formData.initialBalance}
                onChange={(e) => setFormData({ ...formData, initialBalance: e.target.value })}
                sx={{ borderRadius: 2 }}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>
                }}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={loading}
            startIcon={loading ? <LinearProgress size={20} /> : <Add />}
          >
            {loading ? 'Processing...' : editingAccount ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          severity={snackbar.severity}
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MyAccounts;