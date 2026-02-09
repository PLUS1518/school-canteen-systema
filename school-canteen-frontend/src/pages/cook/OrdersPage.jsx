import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  CheckCircle,
  Pending,
  Restaurant,
  Visibility,
} from '@mui/icons-material';

const CookOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, issued
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [issuing, setIssuing] = useState(false);

  useEffect(() => {
    // Заглушка данных - заменим на API
    const mockOrders = [
      {
        id: 1,
        studentName: 'Иван Учеников',
        mealName: 'Куриный суп с лапшой',
        mealType: 'lunch',
        orderTime: '12:00',
        status: 'pending',
        paymentType: 'subscription',
        specialNotes: 'Без лука',
        tableNumber: 5,
      },
      {
        id: 2,
        studentName: 'Мария Сидорова',
        mealName: 'Гречневая каша с котлетой',
        mealType: 'lunch',
        orderTime: '12:15',
        status: 'pending',
        paymentType: 'single',
        specialNotes: '',
        tableNumber: 3,
      },
      {
        id: 3,
        studentName: 'Алексей Петров',
        mealName: 'Омлет с сыром',
        mealType: 'breakfast',
        orderTime: '08:30',
        status: 'issued',
        paymentType: 'subscription',
        specialNotes: 'Дополнительный сыр',
        tableNumber: 2,
      },
      {
        id: 4,
        studentName: 'Елена Иванова',
        mealName: 'Творожная запеканка',
        mealType: 'breakfast',
        orderTime: '08:45',
        status: 'issued',
        paymentType: 'single',
        specialNotes: 'Без изюма',
        tableNumber: 7,
      },
    ];

    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

  const handleFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setFilter(newFilter);
    }
  };

  const handleIssueOrder = async (orderId) => {
    setIssuing(true);
    // Имитация API запроса
    setTimeout(() => {
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: 'issued' } : order
      ));
      setIssuing(false);
    }, 500);
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setDetailOpen(true);
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  const groupByMealType = (ordersList) => {
    const groups = {
      breakfast: [],
      lunch: [],
    };
    
    ordersList.forEach(order => {
      if (groups[order.mealType]) {
        groups[order.mealType].push(order);
      }
    });
    
    return groups;
  };

  const groupedOrders = groupByMealType(filteredOrders);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        <Restaurant sx={{ mr: 2, verticalAlign: 'middle' }} />
        Заказы на сегодня
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={handleFilterChange}
          aria-label="фильтр заказов"
        >
          <ToggleButton value="all" aria-label="все">
            Все
          </ToggleButton>
          <ToggleButton value="pending" aria-label="ожидают">
            <Pending sx={{ mr: 1 }} />
            Ожидают выдачи
          </ToggleButton>
          <ToggleButton value="issued" aria-label="выданы">
            <CheckCircle sx={{ mr: 1 }} />
            Выданы
          </ToggleButton>
        </ToggleButtonGroup>

        <Chip 
          label={`Всего: ${orders.length}`} 
          color="primary" 
          variant="outlined" 
        />
      </Box>

      {['breakfast', 'lunch'].map(mealType => (
        <Box key={mealType} sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ color: mealType === 'breakfast' ? 'primary.main' : 'secondary.main' }}>
            {mealType === 'breakfast' ? '🍳 Завтраки' : '🍲 Обеды'}
            <Chip 
              label={`${groupedOrders[mealType]?.length || 0} заказов`}
              size="small"
              sx={{ ml: 2 }}
            />
          </Typography>

          {groupedOrders[mealType]?.length > 0 ? (
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Ученик</TableCell>
                    <TableCell>Блюдо</TableCell>
                    <TableCell>Стол</TableCell>
                    <TableCell>Время</TableCell>
                    <TableCell>Статус</TableCell>
                    <TableCell align="right">Действия</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {groupedOrders[mealType].map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.studentName}</TableCell>
                      <TableCell>{order.mealName}</TableCell>
                      <TableCell>№{order.tableNumber}</TableCell>
                      <TableCell>{order.orderTime}</TableCell>
                      <TableCell>
                        {order.status === 'pending' ? (
                          <Chip icon={<Pending />} label="Ожидает" color="warning" size="small" />
                        ) : (
                          <Chip icon={<CheckCircle />} label="Выдан" color="success" size="small" />
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton 
                          size="small" 
                          onClick={() => handleViewDetails(order)}
                          color="info"
                        >
                          <Visibility />
                        </IconButton>
                        {order.status === 'pending' && (
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<CheckCircle />}
                            onClick={() => handleIssueOrder(order.id)}
                            disabled={issuing}
                            sx={{ ml: 1 }}
                          >
                            Выдать
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Alert severity="info">
              Нет заказов на {mealType === 'breakfast' ? 'завтрак' : 'обед'}
            </Alert>
          )}
        </Box>
      ))}

      {/* Диалог с деталями заказа */}
      <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} maxWidth="sm" fullWidth>
        {selectedOrder && (
          <>
            <DialogTitle>Детали заказа #{selectedOrder.id}</DialogTitle>
            <DialogContent>
              <Box sx={{ mt: 2 }}>
                <Typography><strong>Ученик:</strong> {selectedOrder.studentName}</Typography>
                <Typography><strong>Блюдо:</strong> {selectedOrder.mealName}</Typography>
                <Typography><strong>Тип питания:</strong> {selectedOrder.mealType === 'breakfast' ? 'Завтрак' : 'Обед'}</Typography>
                <Typography><strong>Стол:</strong> №{selectedOrder.tableNumber}</Typography>
                <Typography><strong>Время заказа:</strong> {selectedOrder.orderTime}</Typography>
                <Typography><strong>Оплата:</strong> {selectedOrder.paymentType === 'subscription' ? 'Абонемент' : 'Разовая'}</Typography>
                {selectedOrder.specialNotes && (
                  <Typography><strong>Особые пожелания:</strong> {selectedOrder.specialNotes}</Typography>
                )}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailOpen(false)}>Закрыть</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default CookOrdersPage;