import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  TrendingUp,
  People,
  AttachMoney,
  Restaurant,
  Refresh,
  CalendarToday,
} from '@mui/icons-material';

const StatsPage = () => {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('week');
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    activeUsers: 0,
    popularMeals: [],
    dailyStats: [],
  });

  useEffect(() => {
    fetchStats();
  }, [period]);

  const fetchStats = () => {
    setLoading(true);
    
    // Заглушка данных
    setTimeout(() => {
      setStats({
        totalOrders: 847,
        totalRevenue: 127050,
        activeUsers: 156,
        popularMeals: [
          { name: 'Куриный суп с лапшой', orders: 124, revenue: 14880 },
          { name: 'Гречневая каша с котлетой', orders: 98, revenue: 14700 },
          { name: 'Омлет с сыром', orders: 87, revenue: 6960 },
          { name: 'Творожная запеканка', orders: 76, revenue: 6840 },
          { name: 'Плов с курицей', orders: 65, revenue: 9750 },
        ],
        dailyStats: [
          { date: 'Пн', orders: 45, revenue: 6750 },
          { date: 'Вт', orders: 52, revenue: 7800 },
          { date: 'Ср', orders: 48, revenue: 7200 },
          { date: 'Чт', orders: 61, revenue: 9150 },
          { date: 'Пт', orders: 59, revenue: 8850 },
          { date: 'Сб', orders: 32, revenue: 4800 },
          { date: 'Вс', orders: 28, revenue: 4200 },
        ],
      });
      setLoading(false);
    }, 1000);
  };

  const statCards = [
    {
      title: 'Всего заказов',
      value: stats.totalOrders,
      icon: <Restaurant />,
      color: '#4CAF50',
      change: '+12%',
      subtext: 'За текущий период',
    },
    {
      title: 'Общая выручка',
      value: `${stats.totalRevenue.toLocaleString()} ₽`,
      icon: <AttachMoney />,
      color: '#2196F3',
      change: '+8%',
      subtext: 'Чистая прибыль: 89,400 ₽',
    },
    {
      title: 'Активные пользователи',
      value: stats.activeUsers,
      icon: <People />,
      color: '#FF9800',
      change: '+5%',
      subtext: 'Из 200 зарегистрированных',
    },
    {
      title: 'Средний чек',
      value: `${Math.round(stats.totalRevenue / stats.totalOrders)} ₽`,
      icon: <TrendingUp />,
      color: '#9C27B0',
      change: '+3%',
      subtext: 'Увеличение на 40 ₽',
    },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Статистика системы
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Период</InputLabel>
            <Select
              value={period}
              label="Период"
              onChange={(e) => setPeriod(e.target.value)}
            >
              <MenuItem value="day">День</MenuItem>
              <MenuItem value="week">Неделя</MenuItem>
              <MenuItem value="month">Месяц</MenuItem>
              <MenuItem value="year">Год</MenuItem>
            </Select>
          </FormControl>
          <IconButton onClick={fetchStats} color="primary">
            <Refresh />
          </IconButton>
        </Box>
      </Box>

      {/* Карточки статистики */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography color="textSecondary" variant="body2" gutterBottom>
                      {card.title}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {card.value}
                    </Typography>
                    <Chip 
                      label={card.change} 
                      size="small" 
                      sx={{ 
                        backgroundColor: card.change.startsWith('+') ? '#e8f5e9' : '#ffebee',
                        color: card.change.startsWith('+') ? '#2e7d32' : '#c62828',
                        mb: 1,
                      }}
                    />
                    <Typography variant="caption" color="textSecondary">
                      {card.subtext}
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    p: 1, 
                    borderRadius: 2, 
                    backgroundColor: `${card.color}15`,
                    color: card.color,
                  }}>
                    {card.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Популярные блюда и график */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              <Restaurant sx={{ mr: 1, verticalAlign: 'middle' }} />
              Популярные блюда
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Блюдо</TableCell>
                    <TableCell align="right">Заказы</TableCell>
                    <TableCell align="right">Выручка</TableCell>
                    <TableCell align="right">Доля</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.popularMeals.map((meal, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Typography variant="body2">{meal.name}</Typography>
                      </TableCell>
                      <TableCell align="right">{meal.orders}</TableCell>
                      <TableCell align="right">{meal.revenue.toLocaleString()} ₽</TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={(meal.orders / stats.popularMeals[0].orders) * 100} 
                            sx={{ width: '60px', height: 8, borderRadius: 4 }}
                          />
                          <Typography variant="body2">
                            {Math.round((meal.orders / stats.totalOrders) * 100)}%
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              <CalendarToday sx={{ mr: 1, verticalAlign: 'middle' }} />
              Активность по дням
            </Typography>
            <Box sx={{ mt: 3 }}>
              {stats.dailyStats.map((day, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{day.date}</Typography>
                    <Typography variant="body2">
                      {day.orders} заказов / {day.revenue.toLocaleString()} ₽
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(day.orders / Math.max(...stats.dailyStats.map(d => d.orders))) * 100} 
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Дополнительная информация */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Типы оплаты
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Абонемент</Typography>
                <Typography variant="body2">68%</Typography>
              </Box>
              <LinearProgress variant="determinate" value={68} sx={{ height: 10, borderRadius: 5, mb: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Разовая оплата</Typography>
                <Typography variant="body2">32%</Typography>
              </Box>
              <LinearProgress variant="determinate" value={32} sx={{ height: 10, borderRadius: 5 }} />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Эффективность системы
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Заполняемость столовой</Typography>
                <Typography variant="body2">82%</Typography>
              </Box>
              <LinearProgress variant="determinate" value={82} color="success" sx={{ height: 10, borderRadius: 5, mb: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Среднее время приготовления</Typography>
                <Typography variant="body2">15 мин</Typography>
              </Box>
              <LinearProgress variant="determinate" value={75} color="info" sx={{ height: 10, borderRadius: 5 }} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StatsPage;