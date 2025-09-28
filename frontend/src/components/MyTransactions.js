import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Grid
} from '@mui/material';
import axios from 'axios';

const MyTransactions = ({ currentUser }) => {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      fetchMyTransactions();
      fetchAccounts();
    }
  }, [currentUser]);

  const fetchMyTransactions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/transactions/user/${currentUser.id}/with-emails`);
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching my transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAccounts = async () => {
    try {
      const response = await axios.get(`/api/accounts/user/${currentUser.id}`);
      setAccounts(response.data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'FAILED':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatAmount = (amount, type, transaction) => {
    let prefix = '+';
    if (type === 'WITHDRAWAL') {
      prefix = '-';
    } else if (type === 'TRANSFER') {
      // For TRANSFER, check if the current user is the sender or receiver
      const currentUserEmail = currentUser?.email;
      const isReceiver = transaction.toUserEmail === currentUserEmail;
      const isSender = transaction.fromUserEmail === currentUserEmail;
      
      if (isReceiver && !isSender) {
        prefix = '+'; // User received money
      } else if (isSender && !isReceiver) {
        prefix = '-'; // User sent money
      } else {
        prefix = '+'; // Default to positive if unclear
      }
    }
    return `${prefix}$${Math.abs(amount)}`;
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', overflow: 'hidden' }}>
        <Typography variant="h4" gutterBottom>
          My Transactions
        </Typography>
        <Typography>Loading transactions...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
        My Transactions
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
        View all your banking transactions and account activity.
      </Typography>

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
              <TableCell sx={{ minWidth: 100 }}>Type</TableCell>
              <TableCell sx={{ minWidth: 120 }}>Amount</TableCell>
              <TableCell sx={{ minWidth: 100 }}>From User</TableCell>
              <TableCell sx={{ minWidth: 100 }}>To User</TableCell>
              <TableCell sx={{ minWidth: 100 }}>Status</TableCell>
              <TableCell sx={{ minWidth: 120 }}>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No transactions found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell sx={{ minWidth: 60 }}>{transaction.id}</TableCell>
                  <TableCell sx={{ minWidth: 100 }}>{transaction.type}</TableCell>
                  <TableCell sx={{ 
                    minWidth: 120,
                    color: transaction.type === 'WITHDRAWAL' ? 'error.main' : 'success.main',
                    fontWeight: 'bold'
                  }}>
                    {formatAmount(transaction.amount, transaction.type, transaction)}
                  </TableCell>
                  <TableCell sx={{ minWidth: 100 }}>{transaction.fromUserEmail || 'N/A'}</TableCell>
                  <TableCell sx={{ minWidth: 100 }}>{transaction.toUserEmail || 'N/A'}</TableCell>
                  <TableCell sx={{ minWidth: 100 }}>
                    <Chip 
                      label={transaction.status} 
                      color={getStatusColor(transaction.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell sx={{ minWidth: 120 }}>
                    {new Date(transaction.timestamp).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MyTransactions;

