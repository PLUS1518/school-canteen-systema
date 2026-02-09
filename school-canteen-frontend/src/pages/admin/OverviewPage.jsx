import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Chip,
  LinearProgress,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  People as PeopleIcon,
  Restaurant as RestaurantIcon,
  ShoppingCart as CartIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccessTime as TimeIcon,
  MoreVert as MoreIcon,
  Person as PersonIcon,
  RateReview as ReviewIcon,
  AccountBalanceWallet as WalletIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'; // Нужно установить: npm install recharts
import { statsService } from '../../services/stats';
import { useAuth } from '../../context/AuthContext';

// Цвета для графиков
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const OverviewPage = () => {
  const { user } = useAuth();
  const [overviewData, setOverviewData] = useState(null);
  const [dailyStats, setDailyStats] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [userDistribution, setUserDistribution] = useState([]);
  const [timeRange, setTimeRange] = useState('week');
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [overviewRes, dailyRes, activityRes, distributionRes] = await Promise.all([
        statsService.getOverview(),
        statsService.getDailyStats(timeRange === 'week' ? 7 : 30),
        statsService.getRecentActivity(),
        statsService.getUserDistribution(),
      ]);

      setOverviewData(overviewRes.data);
      setDailyStats(dailyRes.data);
      setRecentActivity(activityRes.data);
      
      // Преобразуем распределение пользователей для PieChart
      const distributionData = Object.entries(distributionRes.data).map(([name, value]) => ({
        name: name === 'students' ? 'Ученики' : 
              name === 'cooks' ? 'Повара' : 
              name === 'admins' ? 'Админы' : 'Родители',
        value,
      }));
      setUserDistribution(distributionData);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    setAnchorEl(null);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getChangeColor = (change) => {
    return change >= 0 ? '#4caf50' : '#f44336';
  };

  const getChangeIcon = (change) => {
    return change >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />;
  };

  if (loading) {
    return (
      <Container sx={{ py: 4 }}>
        <LinearProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Заголовок и фильтры */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Обзор системы
          </Typography>
          <Typography color="textSecondary">
            Добро пожаловать, {user?.fullName || 'Администратор'}
          </Typography>
        </Box>
        
        <Box>
          <Chip
            label={timeRange === 'week' ? 'За 7 дней' : 'За 30 дней'}
            onClick={handleMenuOpen}
            deleteIcon={<MoreIcon />}
            onDelete={handleMenuOpen}
            variant="outlined"
          />
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => handleTimeRangeChange('week')}>За 7 дней</MenuItem>
            <MenuItem onClick={() => handleTimeRangeChange('month')}>За 30 дней</MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Карточки с ключевыми метриками */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Всего пользователей
                  </Typography>
                  <Typography variant="h4">{overviewData?.totalUsers || 0}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Typography variant="body2" sx={{ color: getChangeColor(12) }}>
                      +12 за месяц
                    </Typography>
                    {getChangeIcon(12)}
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <PeopleIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Активных заказов
                  </Typography>
                  <Typography variant="h4">{overviewData?.activeOrders || 0}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Typography variant="body2" sx={{ color: getChangeColor(-2) }}>
                      -2 за день
                    </Typography>
                    {getChangeIcon(-2)}
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <CartIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Доход сегодня
                  </Typography>
                  <Typography variant="h4">{formatCurrency(overviewData?.todayRevenue || 0)}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Typography variant="body2" sx={{ color: getChangeColor(8.5) }}>
                      +8.5% за неделю
                    </Typography>
                    {getChangeIcon(8.5)}
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <MoneyIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Доступных блюд
                  </Typography>
                  <Typography variant="h4">{overviewData?.availableMeals || 0}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Typography variant="body2" sx={{ color: getChangeColor(3) }}>
                      +3 новых
                    </Typography>
                    {getChangeIcon(3)}
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: 'info.main' }}>
                  <RestaurantIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Графики */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* График доходов */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Динамика доходов и заказов
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                  />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'revenue' ? formatCurrency(value) : value,
                      name === 'revenue' ? 'Доход' : name === 'orders' ? 'Заказы' : 'Пользователи'
                    ]}
                    labelFormatter={(label) => new Date(label).toLocaleDateString('ru-RU')}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="orders"
                    stroke="#8884d8"
                    name="Заказы"
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#82ca9d"
                    name="Доход"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Распределение пользователей */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Распределение пользователей
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {userDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Количество']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Последние действия и дополнительные метрики */}
      <Grid container spacing={3}>
        {/* Последние действия */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Последние действия в системе
            </Typography>
            <List>
              {recentActivity.map((activity, index) => (
                <React.Fragment key={activity.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body1">
                          <strong>{activity.user}</strong> {activity.action} "{activity.target}"
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                          <TimeIcon sx={{ fontSize: 14, mr: 0.5 }} />
                          <Typography variant="caption" color="textSecondary">
                            {activity.time}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < recentActivity.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Дополнительные метрики */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Дополнительная статистика
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography>Общий доход:</Typography>
                <Typography variant="h6">{formatCurrency(overviewData?.weeklyRevenue || 0)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography>Всего заказов:</Typography>
                <Typography variant="h6">{overviewData?.totalOrders || 0}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography>Активных учеников:</Typography>
                <Typography variant="h6">{overviewData?.activeStudents || 0}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography>Средний чек:</Typography>
                <Typography variant="h6">{formatCurrency(overviewData?.averageOrderValue || 0)}</Typography>
              </Box>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle2" gutterBottom>
              Быстрые действия
            </Typography>
            <Grid container spacing={1} sx={{ mt: 1 }}>
              <Grid item xs={6}>
                <Card variant="outlined" sx={{ textAlign: 'center', p: 1, cursor: 'pointer' }}>
                  <PersonIcon color="primary" />
                  <Typography variant="caption">Добавить пользователя</Typography>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card variant="outlined" sx={{ textAlign: 'center', p: 1, cursor: 'pointer' }}>
                  <RestaurantIcon color="primary" />
                  <Typography variant="caption">Добавить блюдо</Typography>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card variant="outlined" sx={{ textAlign: 'center', p: 1, cursor: 'pointer' }}>
                  <WalletIcon color="primary" />
                  <Typography variant="caption">Финансовый отчет</Typography>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card variant="outlined" sx={{ textAlign: 'center', p: 1, cursor: 'pointer' }}>
                  <ReviewIcon color="primary" />
                  <Typography variant="caption">Отчет по отзывам</Typography>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default OverviewPage;