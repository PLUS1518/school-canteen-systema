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
  Avatar,
  Divider,
} from '@mui/material';
import { 
  Menu as MenuIcon,
  Restaurant,
  History,
  Person,
  RateReview,
  ExitToApp,
  Home,
  AccountBalanceWallet,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import MenuPage from './MenuPage';
import OrdersHistoryPage from './OrdersHistoryPage';
import MyFeedbackPage from './MyFeedbackPage';
import ProfilePage from './ProfilePage';

const drawerWidth = 280;

// Определяем интерфейс для пользователя
interface User {
  id?: number;
  fullName?: string;
  username?: string;
  role?: string;
  class?: string;
  balance?: number;
  email?: string;
  phone?: string;
  allergies?: string[];
  preferences?: string[];
  [key: string]: any; // Для других возможных свойств
}

const StudentDashboard = () => {
  const { user: authUser, logout } = useAuth();
  const user = authUser as User; // Приводим к нашему типу
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activePage, setActivePage] = useState('menu');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { text: 'Главная', icon: <Home />, page: 'home' },
    { text: 'Меню на сегодня', icon: <Restaurant />, page: 'menu' },
    { text: 'Мои заказы', icon: <History />, page: 'orders' },
    { text: 'Мои отзывы', icon: <RateReview />, page: 'feedback' },
    { text: 'Мой профиль', icon: <Person />, page: 'profile' },
  ];

  const getPageTitle = () => {
    switch (activePage) {
      case 'home': return 'Главная';
      case 'menu': return 'Меню на сегодня';
      case 'orders': return 'Мои заказы';
      case 'feedback': return 'Мои отзывы';
      case 'profile': return 'Мой профиль';
      default: return 'Панель ученика';
    }
  };

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <StudentDashboardHome />;
      case 'menu':
        return <MenuPage />;
      case 'orders':
        return <OrdersHistoryPage />;
      case 'feedback':
        return <MyFeedbackPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <StudentDashboardHome />;
    }
  };

  // Компонент главной страницы дашборда
  const StudentDashboardHome = () => {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Добро пожаловать, {user?.fullName || 'Ученик'}!
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
          <Box 
            sx={{ 
              p: 3, 
              borderRadius: 2, 
              bgcolor: 'primary.light', 
              color: 'white',
              flex: 1,
              minWidth: 250
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AccountBalanceWallet sx={{ mr: 2, fontSize: 40 }} />
              <Box>
                <Typography variant="h6">Баланс</Typography>
                <Typography variant="h4">
                  {user?.balance || 0} ₽
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2">
              Доступно для заказов
            </Typography>
          </Box>

          <Box 
            sx={{ 
              p: 3, 
              borderRadius: 2, 
              bgcolor: 'secondary.light', 
              color: 'white',
              flex: 1,
              minWidth: 250
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Restaurant sx={{ mr: 2, fontSize: 40 }} />
              <Box>
                <Typography variant="h6">Сегодня в меню</Typography>
                <Typography variant="h4">
                  12 блюд
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2">
              Завтраки, обеды и перекусы
            </Typography>
          </Box>
        </Box>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Быстрые действия
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Box 
            sx={{ 
              p: 3, 
              borderRadius: 2, 
              border: 1, 
              borderColor: 'divider',
              flex: 1,
              minWidth: 200,
              cursor: 'pointer',
              '&:hover': { bgcolor: 'action.hover' }
            }}
            onClick={() => setActivePage('menu')}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Restaurant color="primary" sx={{ mr: 2 }} />
              <Typography variant="h6">Посмотреть меню</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Выберите блюда на сегодня
            </Typography>
          </Box>

          <Box 
            sx={{ 
              p: 3, 
              borderRadius: 2, 
              border: 1, 
              borderColor: 'divider',
              flex: 1,
              minWidth: 200,
              cursor: 'pointer',
              '&:hover': { bgcolor: 'action.hover' }
            }}
            onClick={() => setActivePage('orders')}
          >
            <Box sx={{ display: '-flex', alignItems: 'center', mb: 2 }}>
              <History color="primary" sx={{ mr: 2 }} />
              <Typography variant="h6">Мои заказы</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              История и статусы заказов
            </Typography>
          </Box>

          <Box 
            sx={{ 
              p: 3, 
              borderRadius: 2, 
              border: 1, 
              borderColor: 'divider',
              flex: 1,
              minWidth: 200,
              cursor: 'pointer',
              '&:hover': { bgcolor: 'action.hover' }
            }}
            onClick={() => setActivePage('feedback')}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <RateReview color="primary" sx={{ mr: 2 }} />
              <Typography variant="h6">Мои отзывы</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Оставить отзыв о блюдах
            </Typography>
          </Box>
        </Box>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Последние действия
        </Typography>
        
        <Box sx={{ 
          p: 2, 
          borderRadius: 2, 
          border: 1, 
          borderColor: 'divider',
          bgcolor: 'background.paper'
        }}>
          <Typography variant="body2" color="text.secondary">
            Здесь будет отображаться история ваших действий...
          </Typography>
        </Box>
      </Box>
    );
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar />
      
      {/* Информация о пользователе */}
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}>
        <Avatar 
          sx={{ 
            width: 56, 
            height: 56, 
            mr: 2,
            bgcolor: 'primary.main',
            fontSize: '1.5rem'
          }}
        >
          {user?.fullName?.charAt(0) || 'У'}
        </Avatar>
        <Box>
          <Typography variant="subtitle1" fontWeight="bold" noWrap>
            {user?.fullName || 'Ученик'}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            Ученик • {user?.class || 'Класс не указан'}
          </Typography>
          <Typography variant="body2" color="primary.main" sx={{ mt: 0.5 }}>
            Баланс: {user?.balance || 0} ₽
          </Typography>
        </Box>
      </Box>

      {/* Основное меню */}
      <List sx={{ flexGrow: 1, px: 2, py: 3 }}>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.text}
            onClick={() => setActivePage(item.page)}
            selected={activePage === item.page}
            sx={{ 
              borderRadius: 2,
              mb: 1,
              '&.Mui-selected': {
                bgcolor: 'primary.light',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'primary.light',
                }
              }
            }}
          >
            <ListItemIcon sx={{ 
              color: activePage === item.page ? 'primary.main' : 'inherit',
              minWidth: 40
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{ 
                fontWeight: activePage === item.page ? 'bold' : 'normal'
              }}
            />
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* Выход */}
      <List sx={{ px: 2, py: 2 }}>
        <ListItem 
          button 
          onClick={handleLogout}
          sx={{ 
            borderRadius: 2,
            color: 'error.main'
          }}
        >
          <ListItemIcon sx={{ color: 'error.main', minWidth: 40 }}>
            <ExitToApp />
          </ListItemIcon>
          <ListItemText 
            primary="Выйти" 
            primaryTypographyProps={{ fontWeight: 'bold' }}
          />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      
      {/* AppBar для мобильных устройств */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          zIndex: (theme) => theme.zIndex.drawer + 1,
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
          
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              {getPageTitle()}
            </Typography>
            
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 2 }}>
              <Avatar 
                sx={{ 
                  width: 40, 
                  height: 40,
                  bgcolor: 'primary.main',
                  fontSize: '1rem'
                }}
              >
                {user?.fullName?.charAt(0) || 'У'}
              </Avatar>
              <Box>
                <Typography variant="body2" sx={{ lineHeight: 1.2 }}>
                  {user?.fullName || 'Ученик'}
                </Typography>
                <Typography variant="caption" sx={{ lineHeight: 1.2 }}>
                  Баланс: {user?.balance || 0} ₽
                </Typography>
              </Box>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Боковая панель */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* Мобильная версия */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              borderRight: 'none',
            },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Десктопная версия */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              borderRight: 'none',
              boxShadow: 2,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      {/* Основной контент */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: 'grey.50',
          minHeight: '100vh'
        }}
      >
        <Toolbar /> {/* Отступ под AppBar */}
        <Box sx={{ 
          maxWidth: 'lg', 
          mx: 'auto',
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: 1,
          overflow: 'hidden'
        }}>
          {renderPage()}
        </Box>
      </Box>
    </Box>
  );
};

export default StudentDashboard;