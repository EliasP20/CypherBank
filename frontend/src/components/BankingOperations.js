import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  IconButton,
  Divider,
  LinearProgress
} from '@mui/material';
import {
  AccountBalance,
  Send,
  Receipt,
  History,
  TrendingUp,
  TrendingDown,
  SwapHoriz,
  PersonAdd,
  CreditCard,
  AttachMoney,
  ArrowUpward,
  ArrowDownward,
  SwapVert,
  Email,
  MoreVert
} from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';
import axios from 'axios';

const BankingOperations = ({ currentUser }) => {
  const { isDarkMode } = useTheme();
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientAccount, setRecipientAccount] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      fetchAccounts();
      fetchTransactions();
    }
  }, [currentUser]);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/accounts/user/${currentUser.id}`);
      setAccounts(response.data);
      if (response.data.length > 0) {
        setSelectedAccount(response.data[0].id);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
      showSnackbar('Error fetching accounts', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`/api/transactions/user/${currentUser.id}`);
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenDialog = (type) => {
    setDialogType(type);
    setOpenDialog(true);
    setAmount('');
    setRecipientEmail('');
    setRecipientAccount('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setAmount('');
    setRecipientEmail('');
    setRecipientAccount('');
  };

  const handleDeposit = async () => {
    try {
      setLoading(true);
      await axios.post(`/api/accounts/${selectedAccount}/deposit`, null, {
        params: { amount: parseFloat(amount) }
      });
      showSnackbar('Deposit successful!', 'success');
      fetchAccounts();
      fetchTransactions();
      handleCloseDialog();
    } catch (error) {
      console.error('Deposit error:', error);
      showSnackbar('Deposit failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    try {
      setLoading(true);
      await axios.post(`/api/accounts/${selectedAccount}/withdraw`, null, {
        params: { amount: parseFloat(amount) }
      });
      showSnackbar('Withdrawal successful!', 'success');
      fetchAccounts();
      fetchTransactions();
      handleCloseDialog();
    } catch (error) {
      console.error('Withdrawal error:', error);
      showSnackbar('Withdrawal failed - insufficient funds', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTransferToAccount = async () => {
    try {
      setLoading(true);
      await axios.post('/api/accounts/transfer', null, {
        params: {
          fromAccountId: selectedAccount,
          toAccountId: recipientAccount,
          amount: parseFloat(amount)
        }
      });
      showSnackbar('Transfer successful!', 'success');
      fetchAccounts();
      fetchTransactions();
      handleCloseDialog();
    } catch (error) {
      console.error('Transfer error:', error);
      showSnackbar('Transfer failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTransferToUser = async () => {
    try {
      setLoading(true);
      console.log('Starting Zelle transfer to email:', recipientEmail);
      
      const userResponse = await axios.get(`/api/users/email/${recipientEmail}`);
      const recipientUser = userResponse.data;
      console.log('Found user:', recipientUser);
      
      const accountsResponse = await axios.get(`/api/accounts/user/${recipientUser.id}`);
      const recipientAccounts = accountsResponse.data;
      console.log('Found accounts:', recipientAccounts);
      
      if (recipientAccounts.length === 0) {
        showSnackbar('Recipient has no accounts', 'error');
        return;
      }
      
      console.log('Starting transfer from account:', selectedAccount, 'to account:', recipientAccounts[0].id, 'amount:', amount);
      await axios.post('/api/accounts/transfer', null, {
        params: {
          fromAccountId: selectedAccount,
          toAccountId: recipientAccounts[0].id,
          amount: parseFloat(amount)
        }
      });
      showSnackbar('Transfer to user successful!', 'success');
      fetchAccounts();
      fetchTransactions();
      handleCloseDialog();
    } catch (error) {
      console.error('Transfer to user error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      if (error.response?.status === 404) {
        showSnackbar('User not found with that email', 'error');
      } else if (error.response?.status === 500) {
        showSnackbar('Server error - please try again', 'error');
      } else {
        showSnackbar('Transfer failed - user not found or no accounts', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!amount || parseFloat(amount) <= 0) {
      showSnackbar('Please enter a valid amount', 'error');
      return;
    }

    switch (dialogType) {
      case 'deposit':
        handleDeposit();
        break;
      case 'withdraw':
        handleWithdraw();
        break;
      case 'transfer-account':
        handleTransferToAccount();
        break;
      case 'transfer-user':
        handleTransferToUser();
        break;
      default:
        break;
    }
  };

  const getAccountBalance = () => {
    const account = accounts.find(acc => acc.id === selectedAccount);
    return account ? account.balance : 0;
  };

  const getTotalBalance = () => {
    return accounts.reduce((total, account) => total + (parseFloat(account.balance) || 0), 0);
  };

  const getRecentTransactions = () => {
    return transactions.slice(0, 5);
  };

  const TransactionItem = ({ transaction, index }) => (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      py: 2,
      px: 2,
      borderBottom: index < getRecentTransactions().length - 1 ? '1px solid' : 'none',
      borderColor: 'divider',
      '&:hover': {
        bgcolor: 'action.hover',
        borderRadius: 1
      }
    }}>
      <Avatar sx={{ 
        bgcolor: transaction.type === 'DEPOSIT' ? 'success.main' : 'error.main',
        mr: 2,
        width: 40,
        height: 40
      }}>
        {transaction.type === 'DEPOSIT' ? <ArrowUpward /> : <ArrowDownward />}
      </Avatar>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {transaction.type}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {new Date(transaction.timestamp).toLocaleDateString()}
        </Typography>
      </Box>
      <Typography 
        variant="h6" 
        sx={{ 
          fontWeight: 'bold',
          color: transaction.type === 'DEPOSIT' ? 'success.main' : 'error.main'
        }}
      >
        {transaction.type === 'DEPOSIT' ? '+' : '-'}${parseFloat(transaction.amount).toFixed(2)}
      </Typography>
    </Box>
  );

  const renderDialog = () => {
    const getTitle = () => {
      switch (dialogType) {
        case 'deposit': return 'Deposit Money';
        case 'withdraw': return 'Withdraw Money';
        case 'transfer-account': return 'Transfer to Account';
        case 'transfer-user': return 'Send Money (Zelle)';
        default: return '';
      }
    };

    const getIcon = () => {
      switch (dialogType) {
        case 'deposit': return <TrendingUp />;
        case 'withdraw': return <TrendingDown />;
        case 'transfer-account': return <SwapHoriz />;
        case 'transfer-user': return <Send />;
        default: return <AttachMoney />;
      }
    };

    return (
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
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
            {getIcon()}
          </Avatar>
          {getTitle()}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>From Account</InputLabel>
              <Select
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                {accounts.map((account) => (
                  <MenuItem key={account.id} value={account.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CreditCard sx={{ fontSize: 20 }} />
                      <Box>
                        <Typography variant="body1">{account.type}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          ${parseFloat(account.balance).toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              margin="normal"
              inputProps={{ min: 0, step: 0.01 }}
              sx={{ borderRadius: 2 }}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>
              }}
            />

            {dialogType === 'transfer-account' && (
              <FormControl fullWidth margin="normal">
                <InputLabel>To Account</InputLabel>
                <Select
                  value={recipientAccount}
                  onChange={(e) => setRecipientAccount(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  {accounts.filter(acc => acc.id !== selectedAccount).map((account) => (
                    <MenuItem key={account.id} value={account.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CreditCard sx={{ fontSize: 20 }} />
                        <Box>
                          <Typography variant="body1">{account.type}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            ${parseFloat(account.balance).toFixed(2)}
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {dialogType === 'transfer-user' && (
              <TextField
                fullWidth
                label="Recipient Email"
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                margin="normal"
                helperText="Enter the email of the user you want to send money to"
                sx={{ borderRadius: 2 }}
                InputProps={{
                  startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={handleCloseDialog} variant="outlined">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={loading}
            startIcon={loading ? <LinearProgress size={20} /> : getIcon()}
          >
            {loading ? 'Processing...' : 
             dialogType === 'deposit' ? 'Deposit' : 
             dialogType === 'withdraw' ? 'Withdraw' : 'Transfer'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  if (loading && accounts.length === 0) {
    return (
      <Box sx={{ width: '100%', p: 3 }}>
        <LinearProgress />
        <Typography sx={{ mt: 2, textAlign: 'center' }}>Loading banking operations...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          Banking Operations
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your money with ease - deposit, withdraw, and transfer funds.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Account Overview */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Account Overview
                </Typography>
                <IconButton>
                  <MoreVert />
                </IconButton>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ 
                    p: 3, 
                    bgcolor: 'primary.main', 
                    color: 'white', 
                    borderRadius: 2,
                    textAlign: 'center'
                  }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                      ${getTotalBalance().toFixed(2)}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Total Balance
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ 
                    p: 3, 
                    bgcolor: 'success.main', 
                    color: 'white', 
                    borderRadius: 2,
                    textAlign: 'center'
                  }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {accounts.length}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Active Accounts
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {accounts.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Your Accounts
                  </Typography>
                  <Grid container spacing={2}>
                    {accounts.map((account) => (
                      <Grid item xs={12} sm={6} key={account.id}>
                        <Card 
                          sx={{ 
                            border: selectedAccount === account.id ? '2px solid' : '1px solid',
                            borderColor: selectedAccount === account.id ? 'primary.main' : 'divider',
                            cursor: 'pointer',
                            '&:hover': {
                              borderColor: 'primary.main',
                              transform: 'translateY(-2px)',
                              transition: 'all 0.2s ease'
                            }
                          }}
                          onClick={() => setSelectedAccount(account.id)}
                        >
                          <CardContent sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Box>
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                  {account.type}
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                  ${parseFloat(account.balance).toFixed(2)}
                                </Typography>
                              </Box>
                              <CreditCard sx={{ color: 'text.secondary' }} />
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                Quick Actions
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<TrendingUp />}
                  onClick={() => handleOpenDialog('deposit')}
                  sx={{ 
                    py: 1.5,
                    borderRadius: 2,
                    background: 'linear-gradient(45deg, #4caf50, #66bb6a)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #388e3c, #4caf50)'
                    }
                  }}
                >
                  Deposit Money
                </Button>
                
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<TrendingDown />}
                  onClick={() => handleOpenDialog('withdraw')}
                  sx={{ 
                    py: 1.5,
                    borderRadius: 2,
                    background: 'linear-gradient(45deg, #ff9800, #ffb74d)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #f57c00, #ff9800)'
                    }
                  }}
                >
                  Withdraw Money
                </Button>
                
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<SwapHoriz />}
                  onClick={() => handleOpenDialog('transfer-account')}
                  sx={{ 
                    py: 1.5,
                    borderRadius: 2,
                    background: 'linear-gradient(45deg, #2196f3, #64b5f6)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1976d2, #2196f3)'
                    }
                  }}
                >
                  Transfer to My Account
                </Button>
                
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<Send />}
                  onClick={() => handleOpenDialog('transfer-user')}
                  sx={{ 
                    py: 1.5,
                    borderRadius: 2,
                    background: 'linear-gradient(45deg, #9c27b0, #ba68c8)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #7b1fa2, #9c27b0)'
                    }
                  }}
                >
                  Send Money (Zelle)
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Transactions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Recent Transactions
                </Typography>
                <Button 
                  size="small" 
                  startIcon={<History />}
                  onClick={() => window.location.href = '#my-transactions'}
                >
                  View All
                </Button>
              </Box>
              
              {getRecentTransactions().length > 0 ? (
                <Box>
                  {getRecentTransactions().map((transaction, index) => (
                    <TransactionItem key={transaction.id} transaction={transaction} index={index} />
                  ))}
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Receipt sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    No recent transactions
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {renderDialog()}

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

export default BankingOperations;