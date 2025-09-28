import React from 'react';
import {
  Typography,
  Box,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  AccountBalance,
  Person,
  AccountBalanceWallet,
  Receipt,
  Logout,
  Dashboard,
  DarkMode,
  LightMode
} from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';

const NavigationBar = ({ currentUser, onLogout, onNavigate }) => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  
  const handleNavigation = (page) => {
    onNavigate(page);
  };

  const getMenuItems = (userRole) => {
    const baseItems = [
      { name: 'Dashboard', icon: <Dashboard />, page: 'dashboard' },
      { name: 'Banking Operations', icon: <AccountBalance />, page: 'banking' },
      { name: 'My Accounts', icon: <AccountBalanceWallet />, page: 'my-accounts' },
      { name: 'My Transactions', icon: <Receipt />, page: 'my-transactions' }
    ];

    if (userRole === 'ADMIN') {
      return [
        ...baseItems,
        { name: 'All Accounts', icon: <AccountBalanceWallet />, page: 'accounts' },
        { name: 'All Transactions', icon: <Receipt />, page: 'transactions' },
        { name: 'User Management', icon: <Person />, page: 'users' }
      ];
    }

    return baseItems;
  };


  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 250,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 250,
          boxSizing: 'border-box',
          position: 'relative',
          height: '100vh',
          overflow: 'hidden'
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              🏦 CYPHERBANK
            </Typography>
            <IconButton 
              onClick={toggleDarkMode} 
              sx={{ color: 'white' }}
              size="small"
            >
              {isDarkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
          </Box>
        </Box>
        
        {currentUser && (
          <Box sx={{ p: 2, bgcolor: 'primary.dark', color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
                {currentUser.firstName?.charAt(0)}
              </Avatar>
              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                Welcome, {currentUser.firstName}!
              </Typography>
            </Box>
          </Box>
        )}
        
        <List sx={{ flexGrow: 1, pt: 1 }}>
          {getMenuItems(currentUser?.role).map((item) => (
            <ListItem
              key={item.name}
              button
              onClick={() => handleNavigation(item.page)}
              sx={{ 
                py: 1.5,
                px: 2,
                '&:hover': {
                  bgcolor: 'action.hover'
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText 
                primary={item.name} 
                primaryTypographyProps={{ fontSize: '0.9rem' }}
              />
            </ListItem>
          ))}
          <Divider sx={{ my: 1 }} />
          <ListItem 
            button 
            onClick={onLogout} 
            sx={{ 
              py: 1.5,
              px: 2,
              '&:hover': {
                bgcolor: 'error.light',
                color: 'error.contrastText'
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Logout />
            </ListItemIcon>
            <ListItemText 
              primary="Logout" 
              primaryTypographyProps={{ fontSize: '0.9rem' }}
            />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default NavigationBar;
