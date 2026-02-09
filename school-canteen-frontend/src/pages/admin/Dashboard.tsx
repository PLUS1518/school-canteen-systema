import React, { useState } from 'react';
import { 
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
  Container,
} from '@mui/material';
import { 
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  BarChart,
  Assignment,
  People,
  ExitToApp,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import StatsPage from './StatsPage';
import PurchaseRequestsAdminPage from './PurchaseRequestsAdminPage';
import OverviewPage from './OverviewPage';
import PeopleIcon from '@mui/icons-material/People';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MealsPage from './MealsPage';
import OrdersPage from './OrdersPage';
import FinancesPage from './FinancesPage';

const drawerWidth = 240;

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activePage, setActivePage] = useState('stats');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Обзор', icon: <DashboardIcon />, page: 'overview' },
    { text: 'Пользователи', icon: <PeopleIcon />, page: 'users' },
    { text: 'Блюда', icon: <RestaurantIcon />, page: 'meals' },
    { text: 'Заказы', icon: <ShoppingCartIcon />, page: 'orders' },
    { text: 'Финансы', icon: <AttachMoneyIcon />, page: 'finances' },
  ];

  const renderPage = () => {
    switch (activePage) {
      case 'overview':
        return <OverviewPage />;
      case 'stats':
        return <StatsPage />;
      case 'purchase':
        return <PurchaseRequestsAdminPage />;
      case 'users':
        return (
          <Container sx={{ py: 3 }}>
            <Typography variant="h4">Управление пользователями</Typography>
            <Typography color="textSecondary">Здесь будет таблица пользователей</Typography>
          </Container>
        );
      case 'meals':        // Добавьте этот case
        return <MealsPage />;
      case 'orders':       // Добавьте этот case
        return <OrdersPage />;
      case 'finances':     // Добавьте этот case
        return <FinancesPage />;
      default:
        return <StatsPage />;
    }
  };

  const drawer = (
    <div>
      <Toolbar />
      <List>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.text}
            onClick={() => setActivePage(item.page)}
            selected={activePage === item.page}
          >
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Панель администратора - {
              activePage === 'overview' ? 'Обзор' :
              activePage === 'stats' ? 'Статистика' :
              activePage === 'purchase' ? 'Заявки' :
              activePage === 'users' ? 'Пользователи' :
              activePage === 'meals' ? 'Блюда' :      // Добавьте
              activePage === 'orders' ? 'Заказы' :    // Добавьте
              activePage === 'finances' ? 'Финансы' : // Добавьте
              'Панель администратора'
            }
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Typography variant="body1">
            {user?.fullName}
          </Typography>
          <IconButton
            color="inherit" 
            onClick={() => { logout(); window.location.href = '/login'; }}
            title="Выйти"
          >
            <ExitToApp />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        {renderPage()}
      </Box>
    </Box>
  );
};

export default AdminDashboard;