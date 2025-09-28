import React, { useState, useEffect, useCallback } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
  Avatar
} from '@mui/material';
import {
  AccountBalance,
  TrendingUp,
  CreditCard,
  Receipt,
  ArrowUpward,
  ArrowDownward
} from '@mui/icons-material';
import axios from 'axios';

const Dashboard = ({ onNavigate, currentUser }) => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAccounts: 0,
    totalTransactions: 0,
    pendingTransactions: 0
  });
  const [accounts, setAccounts] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
    if (!currentUser) return;
    
    try {
      const [accountsRes, transactionsRes] = await Promise.all([
        axios.get(`/api/accounts/user/${currentUser.id}`).catch(() => ({ data: [] })),
        axios.get(`/api/transactions/user/${currentUser.id}/with-emails`).catch(() => ({ data: [] }))
      ]);
      
      setAccounts(accountsRes.data);
      setRecentTransactions(transactionsRes.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, [currentUser]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      const promises = [
        axios.get('/api/users').catch(err => ({ data: [] })),
        axios.get('/api/accounts').catch(err => ({ data: [] })),
        axios.get('/api/transactions').catch(err => ({ data: [] }))
      ];

      const [usersRes, accountsRes, transactionsRes] = await Promise.all(promises);

      const pendingTransactions = transactionsRes.data.filter(
        t => t.status === 'PENDING'
      ).length;

      setStats({
        totalUsers: usersRes.data.length,
        totalAccounts: accountsRes.data.length,
        totalTransactions: transactionsRes.data.length,
        pendingTransactions
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchUserData();
  }, [currentUser, fetchUserData]);

  const getTotalBalance = () => {
    return accounts.reduce((total, account) => total + (parseFloat(account.balance) || 0), 0);
  };

  const AccountCard = ({ account, index }) => (
    <Card 
      sx={{ 
        background: `linear-gradient(135deg, ${
          index === 0 ? '#1976d2' : 
          index === 1 ? '#2e7d32' : 
          '#7b1fa2'
        }, ${
          index === 0 ? '#42a5f5' : 
          index === 1 ? '#4caf50' : 
          '#ba68c8'
        })`,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        transform: `translateY(${index * -8}px)`,
        zIndex: accounts.length - index,
        cursor: 'pointer',
        '&:hover': {
          transform: `translateY(${index * -8 - 4}px)`,
          transition: 'transform 0.3s ease',
          boxShadow: 6
        }
      }}
      onClick={() => onNavigate('my-accounts')}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {account.type}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            VISA
          </Typography>
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          ${parseFloat(account.balance).toFixed(2)}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
          •••• •••• •••• {account.id.toString().padStart(4, '0')}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
          {currentUser?.firstName} {currentUser?.lastName}
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.6, fontSize: '0.7rem' }}>
          Click to view all accounts
        </Typography>
      </CardContent>
    </Card>
  );

  const TransactionItem = ({ transaction, index }) => {
    // Determine if this is a positive or negative transaction for the current user
    const isPositive = transaction.type === 'DEPOSIT' || 
                      (transaction.type === 'TRANSFER' && transaction.toUserEmail === currentUser?.email);
    
    return (
      <ListItem 
        sx={{ 
          px: 0, 
          py: 1.5,
          borderBottom: index < recentTransactions.length - 1 ? '1px solid' : 'none',
          borderColor: 'divider'
        }}
      >
        <Avatar sx={{ 
          bgcolor: isPositive ? 'success.main' : 'error.main',
          mr: 2,
          width: 40,
          height: 40
        }}>
          {isPositive ? <ArrowUpward /> : <ArrowDownward />}
        </Avatar>
        <ListItemText
          primary={
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {transaction.type}
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  fontWeight: 'bold',
                  color: isPositive ? 'success.main' : 'error.main'
                }}
              >
                {isPositive ? '+' : '-'}${parseFloat(transaction.amount).toFixed(2)}
              </Typography>
            </Box>
          }
          secondary={
            <Typography variant="body2" color="text.secondary">
              {new Date(transaction.timestamp).toLocaleDateString()}
            </Typography>
          }
        />
      </ListItem>
    );
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', p: 3 }}>
        <LinearProgress />
        <Typography sx={{ mt: 2, textAlign: 'center' }}>Loading dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {currentUser?.firstName}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with your accounts today.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* My Cards Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  My Cards
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer' }} onClick={() => onNavigate('my-accounts')}>
                  View All
                </Typography>
              </Box>
              
              {accounts.length > 0 ? (
                <Box sx={{ position: 'relative', height: 200 }}>
                  {accounts.slice(0, 3).map((account, index) => (
                    <AccountCard key={account.id} account={account} index={index} />
                  ))}
                  {accounts.length > 3 && (
                    <Box sx={{ 
                      position: 'absolute', 
                      right: 0, 
                      top: '50%', 
                      transform: 'translateY(-50%)',
                      zIndex: 1,
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.04)',
                        borderRadius: 1,
                        px: 1,
                        py: 0.5
                      }
                    }}
                    onClick={() => onNavigate('my-accounts')}
                    >
                      <Typography variant="body2" color="primary.main" sx={{ fontWeight: 'bold' }}>
                        +{accounts.length - 3} more
                      </Typography>
                    </Box>
                  )}
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CreditCard sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    No accounts yet
                  </Typography>
                  <Button 
                    variant="contained" 
                    onClick={() => onNavigate('my-accounts')}
                    startIcon={<CreditCard />}
                  >
                    Create Account
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    ${getTotalBalance().toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Balance
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                    {accounts.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Accounts
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                    {recentTransactions.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Recent Transactions
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                    {stats.pendingTransactions}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Recent Transactions */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Recent Transactions
                </Typography>
                <Button 
                  size="small" 
                  onClick={() => onNavigate('my-transactions')}
                >
                  See all
                </Button>
              </Box>
              
              {recentTransactions.length > 0 ? (
                <List sx={{ p: 0 }}>
                  {recentTransactions.map((transaction, index) => (
                    <TransactionItem key={transaction.id} transaction={transaction} index={index} />
                  ))}
                </List>
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

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                Quick Actions
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button 
                    variant="contained" 
                    fullWidth
                    onClick={() => onNavigate('banking')}
                    startIcon={<AccountBalance />}
                    sx={{ py: 1.5 }}
                  >
                    Banking
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button 
                    variant="outlined" 
                    fullWidth
                    onClick={() => onNavigate('my-accounts')}
                    startIcon={<CreditCard />}
                    sx={{ py: 1.5 }}
                  >
                    Accounts
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button 
                    variant="outlined" 
                    fullWidth
                    onClick={() => onNavigate('my-transactions')}
                    startIcon={<Receipt />}
                    sx={{ py: 1.5 }}
                  >
                    Transactions
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button 
                    variant="outlined" 
                    fullWidth
                    onClick={() => onNavigate('banking')}
                    startIcon={<TrendingUp />}
                    sx={{ py: 1.5 }}
                  >
                    Transfer
                  </Button>
                </Grid>
              </Grid>

              {currentUser?.role === 'ADMIN' && (
                <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
                    Admin Tools
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item xs={4}>
                      <Button 
                        size="small" 
                        variant="outlined" 
                        fullWidth
                        onClick={() => onNavigate('users')}
                      >
                        Users
                      </Button>
                    </Grid>
                    <Grid item xs={4}>
                      <Button 
                        size="small" 
                        variant="outlined" 
                        fullWidth
                        onClick={() => onNavigate('accounts')}
                      >
                        All Accounts
                      </Button>
                    </Grid>
                    <Grid item xs={4}>
                      <Button 
                        size="small" 
                        variant="outlined" 
                        fullWidth
                        onClick={() => onNavigate('transactions')}
                      >
                        All Transactions
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;