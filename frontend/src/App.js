import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Container } from '@mui/material';
import Dashboard from './components/Dashboard';
import UserManagement from './components/UserManagement';
import AccountManagement from './components/AccountManagement';
import TransactionManagement from './components/TransactionManagement';
import BankingOperations from './components/BankingOperations';
import MyAccounts from './components/MyAccounts';
import MyTransactions from './components/MyTransactions';
import NavigationBar from './components/NavigationBar';
import Login from './components/Login';
import { ThemeProvider as CustomThemeProvider, useTheme } from './contexts/ThemeContext';

const createAppTheme = (isDarkMode) => createTheme({
  palette: {
    mode: isDarkMode ? 'dark' : 'light',
    primary: {
      main: isDarkMode ? '#90caf9' : '#1976d2',
    },
    secondary: {
      main: isDarkMode ? '#f48fb1' : '#dc004e',
    },
    background: {
      default: isDarkMode ? '#121212' : '#f5f5f5',
      paper: isDarkMode ? '#1e1e1e' : '#ffffff',
    },
    text: {
      primary: isDarkMode ? '#ffffff' : '#000000',
      secondary: isDarkMode ? '#b0b0b0' : '#666666',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: isDarkMode 
            ? '0 4px 20px rgba(0, 0, 0, 0.3)' 
            : '0 4px 20px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

function AppContent() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const { isDarkMode } = useTheme();

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('dashboard');
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} currentUser={user} />;
      case 'banking':
        return <BankingOperations currentUser={user} />;
      case 'my-accounts':
        return <MyAccounts currentUser={user} />;
      case 'my-transactions':
        return <MyTransactions currentUser={user} />;
      case 'accounts':
        return <AccountManagement />;
      case 'transactions':
        return <TransactionManagement />;
      case 'users':
        return <UserManagement />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  const theme = createAppTheme(isDarkMode);

  if (!user) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Login onLogin={handleLogin} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <NavigationBar 
          currentUser={user} 
          onLogout={handleLogout} 
          onNavigate={handleNavigate} 
        />
        <Box component="main" sx={{ 
          flexGrow: 1, 
          p: 2, 
          ml: { sm: '250px' },
          width: { sm: 'calc(100% - 250px)' },
          overflow: 'hidden'
        }}>
          <Container maxWidth="xl" sx={{ width: '100%', maxWidth: '100%' }}>
            {renderCurrentPage()}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

function App() {
  return (
    <CustomThemeProvider>
      <AppContent />
    </CustomThemeProvider>
  );
}

export default App;

