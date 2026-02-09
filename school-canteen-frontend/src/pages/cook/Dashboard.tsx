import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Restaurant,
  History,
  Person,
  ExitToApp,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import CookOrdersPage from './CookOrdersPage';
import CookMenuPage from './CookMenuPage';
import CookProfilePage from './ProfilePage';

const drawerWidth = 280;

const CookDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activePage, setActivePage] = useState('orders');

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleLogout = () => { logout(); navigate('/login'); };

  const menuItems = [
    { text: 'Текущие заказы', icon: <History />, page: 'orders' },
    { text: 'Управление меню', icon: <Restaurant />, page: 'menu' },
    { text: 'Профиль', icon: <Person />, page: 'profile' },
  ];

  const renderPage = () => {
    switch (activePage) {
      case 'orders':
        return <CookOrdersPage />;
      case 'menu':
        return <CookMenuPage />;
      case 'profile':
        return <CookProfilePage />;
      default:
        return <CookOrdersPage />;
    }
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar />
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}>
        <Avatar sx={{ width: 56, height: 56, mr: 2, bgcolor: 'secondary.main' }}>
          {user?.fullName?.charAt(0) || 'П'}
        </Avatar>
        <Box>
          <Typography variant="subtitle1" fontWeight="bold">{user?.fullName || 'Повар'}</Typography>
          <Typography variant="body2" color="text.secondary">Повар</Typography>
        </Box>
      </Box>
      <List sx={{ flexGrow: 1, px: 2, py: 3 }}>
        {menuItems.map((item) => (
          <ListItem button key={item.text} onClick={() => setActivePage(item.page)}
            selected={activePage === item.page} sx={{ borderRadius: 2, mb: 1 }}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List><ListItem button onClick={handleLogout}><ListItemIcon><ExitToApp /></ListItemIcon><ListItemText primary="Выйти" /></ListItem></List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` } }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            {activePage === 'orders' ? 'Текущие заказы' : activePage === 'menu' ? 'Управление меню' : 'Профиль повара'}
          </Typography>
          <Avatar sx={{ width: 40, height: 40, bgcolor: 'secondary.main' }}>
            {user?.fullName?.charAt(0) || 'П'}
          </Avatar>
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { width: drawerWidth } }}>
          {drawer}
        </Drawer>
        <Drawer variant="permanent" sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { width: drawerWidth } }} open>
          {drawer}
        </Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, backgroundColor: 'grey.50' }}>
        <Toolbar />
        {renderPage()}
      </Box>
    </Box>
  );
};

export default CookDashboard;