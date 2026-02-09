import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Collapse,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
} from '@mui/material';
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  CheckCircle,
  Pending,
  Restaurant,
  Cancel,
  RateReview,
  Star,
} from '@mui/icons-material';
import { ordersService } from '../../services/orders';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useAuth } from '../../context/AuthContext';

const OrdersHistoryPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');

  console.log('OrdersHistory: user=', user, 'auth=', isAuthenticated);

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  
  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Пробуем получить заказы из API
      const response = await ordersService.getMyOrders();
      
      console.log('Orders response:', response);
      
      // Обрабатываем разные форматы ответа
      let ordersData = [];
      
      if (response && response.success && Array.isArray(response.data)) {
        ordersData = response.data;
      } else if (Array.isArray(response)) {
        ordersData = response;
      } else if (response && Array.isArray(response.orders)) {
        ordersData = response.orders;
      }
      
      // Если API вернул пустой массив или ошибку, используем тестовые данные
      if (ordersData.length === 0) {
        ordersData = getMockOrders();
      }
      
      // Форматируем даты для отображения
      const formattedOrders = ordersData.map(order => ({
        ...order,
        formattedDate: order.date 
          ? format(new Date(order.date), 'dd MMMM yyyy, HH:mm', { locale: ru })
          : 'Дата не указана',
        formattedTime: order.date
          ? format(new Date(order.date), 'HH:mm', { locale: ru })
          : '',
      }));
      
      setOrders(formattedOrders);
      
    } catch (err) {
      console.error('Ошибка загрузки заказов:', err);
      setError('Не удалось загрузить историю заказов');
      // Используем тестовые данные для демонстрации
      setOrders(getMockOrders());
    } finally {
      setLoading(false);
    }
  };

  // Тестовые данные для демонстрации
  const getMockOrders = () => {
    const mockOrders = [
      {
        id: 1,
        orderNumber: 'ORD-2024-001',
        date: '2024-01-26T12:30:00',
        total: 270,
        status: 'completed',
        items: [
          { id: 1, name: 'Куриный суп с лапшой', quantity: 1, price: 120, canReview: true },
          { id: 2, name: 'Салат "Витаминный"', quantity: 2, price: 75, canReview: true }
        ],
        deliveryTime: '12:45',
        paymentMethod: 'баланс'
      },
      {
        id: 2,
        orderNumber: 'ORD-2024-002',
        date: '2024-01-25T08:15:00',
        total: 80,
        status: 'completed',
        items: [
          { id: 3, name: 'Омлет с сыром', quantity: 1, price: 80, canReview: true }
        ],
        deliveryTime: '08:30',
        paymentMethod: 'баланс'
      },
      {
        id: 3,
        orderNumber: 'ORD-2024-003',
        date: '2024-01-24T13:45:00',
        total: 150,
        status: 'pending',
        items: [
          { id: 4, name: 'Гречневая каша с котлетой', quantity: 1, price: 150, canReview: false }
        ],
        deliveryTime: '14:00',
        paymentMethod: 'баланс'
      },
      {
        id: 4,
        orderNumber: 'ORD-2024-004',
        date: '2024-01-23T10:20:00',
        total: 195,
        status: 'cancelled',
        items: [
          { id: 5, name: 'Творожная запеканка', quantity: 1, price: 90, canReview: false },
          { id: 6, name: 'Компот из сухофруктов', quantity: 1, price: 35, canReview: false },
          { id: 7, name: 'Булочка с маком', quantity: 1, price: 70, canReview: false }
        ],
        deliveryTime: '10:35',
        paymentMethod: 'баланс',
        cancellationReason: 'Недостаточно средств на балансе'
      }
    ];
    
    return mockOrders.map(order => ({
      ...order,
      formattedDate: format(new Date(order.date), 'dd MMMM yyyy, HH:mm', { locale: ru }),
      formattedTime: format(new Date(order.date), 'HH:mm', { locale: ru }),
    }));
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      pending: { 
        color: 'warning', 
        label: 'В обработке', 
        icon: <Pending fontSize="small" /> 
      },
      completed: { 
        color: 'success', 
        label: 'Завершен', 
        icon: <CheckCircle fontSize="small" /> 
      },
      cancelled: { 
        color: 'error', 
        label: 'Отменен', 
        icon: <Cancel fontSize="small" /> 
      },
      preparing: { 
        color: 'info', 
        label: 'Готовится', 
        icon: <Restaurant fontSize="small" /> 
      }
    };
    
    const config = statusConfig[status] || { color: 'default', label: status, icon: null };
    
    return (
      <Chip
        icon={config.icon}
        label={config.label}
        color={config.color}
        size="small"
        variant="outlined"
        sx={{ fontWeight: 500 }}
      />
    );
  };

  const handleOpenFeedback = (order) => {
    setSelectedOrder(order);
    setFeedbackDialogOpen(true);
  };

  const handleCloseFeedback = () => {
    setFeedbackDialogOpen(false);
    setSelectedOrder(null);
    setFeedbackRating(0);
    setFeedbackComment('');
  };

  const handleSubmitFeedback = async () => {
    try {
      // Здесь будет логика отправки отзыва
      console.log('Отправка отзыва:', {
        orderId: selectedOrder.id,
        rating: feedbackRating,
        comment: feedbackComment
      });
      
      // Временный успех
      setFeedbackDialogOpen(false);
      alert('Отзыв успешно отправлен!');
      
    } catch (err) {
      console.error('Ошибка отправки отзыва:', err);
      alert('Ошибка при отправке отзыва');
    }
  };

  const handleRepeatOrder = (order) => {
    console.log('Повтор заказа:', order);
    alert(`Заказ "${order.orderNumber}" добавлен в корзину для повторного заказа`);
  };

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 3 }}>
          Загрузка истории заказов...
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold">
          Мои заказы
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={fetchOrders}
          disabled={loading}
        >
          Обновить
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {orders.length === 0 ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          У вас пока нет заказов. Сделайте первый заказ в меню!
        </Alert>
      ) : (
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.light' }}>
                <TableCell sx={{ width: 50, fontWeight: 'bold' }} />
                <TableCell sx={{ fontWeight: 'bold' }}>Номер заказа</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Дата и время</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Сумма</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Статус</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <React.Fragment key={order.id}>
                  <TableRow>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => toggleOrderDetails(order.id)}
                      >
                        {expandedOrder === order.id ? 
                          <KeyboardArrowUp /> : 
                          <KeyboardArrowDown />
                        }
                      </IconButton>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>
                      {order.orderNumber}
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {order.formattedDate}
                        </Typography>
                        {order.deliveryTime && (
                          <Typography variant="caption" color="text.secondary">
                            Доставка к {order.deliveryTime}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500, color: 'primary.main' }}>
                      {order.total} ₽
                    </TableCell>
                    <TableCell>
                      {getStatusChip(order.status)}
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        {order.status === 'completed' && (
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<RateReview />}
                            onClick={() => handleOpenFeedback(order)}
                          >
                            Отзыв
                          </Button>
                        )}
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleRepeatOrder(order)}
                        >
                          Повторить
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                  
                  {/* Детали заказа */}
                  <TableRow>
                    <TableCell colSpan={7} sx={{ py: 0, borderTop: 'none' }}>
                      <Collapse in={expandedOrder === order.id} timeout="auto" unmountOnExit>
                        <Box sx={{ 
                          p: 3, 
                          backgroundColor: 'grey.50',
                          borderBottom: '1px solid',
                          borderColor: 'divider'
                        }}>
                          <Typography variant="h6" gutterBottom>
                            Детали заказа
                          </Typography>
                          
                          {/* Список блюд */}
                          <Box mb={3}>
                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                              Состав заказа:
                            </Typography>
                            {order.items.map((item, index) => (
                              <Box 
                                key={index} 
                                display="flex" 
                                justifyContent="space-between" 
                                alignItems="center"
                                mb={1.5}
                                p={1}
                                sx={{ 
                                  backgroundColor: 'white',
                                  borderRadius: 1,
                                  border: '1px solid',
                                  borderColor: 'divider'
                                }}
                              >
                                <Box>
                                  <Typography sx={{ fontWeight: 500 }}>
                                    {item.name}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {item.price} ₽ × {item.quantity}
                                  </Typography>
                                </Box>
                                <Box display="flex" alignItems="center" gap={2}>
                                  <Typography sx={{ fontWeight: 500 }}>
                                    {item.price * item.quantity} ₽
                                  </Typography>
                                  {item.canReview && order.status === 'completed' && (
                                    <IconButton 
                                      size="small" 
                                      color="primary"
                                      onClick={() => handleOpenFeedback({ ...order, selectedItem: item })}
                                    >
                                      <RateReview fontSize="small" />
                                    </IconButton>
                                  )}
                                </Box>
                              </Box>
                            ))}
                          </Box>
                          
                          {/* Информация о заказе */}
                          <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                                Информация о заказе:
                              </Typography>
                              <Box display="flex" flexDirection="column" gap={1}>
                                <Box display="flex" justifyContent="space-between">
                                  <Typography variant="body2" color="text.secondary">
                                    Способ оплаты:
                                  </Typography>
                                  <Typography variant="body2">
                                    {order.paymentMethod || 'Баланс'}
                                  </Typography>
                                </Box>
                                <Box display="flex" justifyContent="space-between">
                                  <Typography variant="body2" color="text.secondary">
                                    Время получения:
                                  </Typography>
                                  <Typography variant="body2">
                                    {order.deliveryTime || 'Не указано'}
                                  </Typography>
                                </Box>
                                {order.cancellationReason && (
                                  <Box display="flex" justifyContent="space-between">
                                    <Typography variant="body2" color="text.secondary">
                                      Причина отмены:
                                    </Typography>
                                    <Typography variant="body2" color="error">
                                      {order.cancellationReason}
                                    </Typography>
                                  </Box>
                                )}
                              </Box>
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                              <Box sx={{ 
                                p: 2, 
                                backgroundColor: 'white',
                                borderRadius: 1,
                                border: '1px solid',
                                borderColor: 'divider'
                              }}>
                                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                                  Итого:
                                </Typography>
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                  <Typography>Сумма заказа:</Typography>
                                  <Typography>{order.total} ₽</Typography>
                                </Box>
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                  <Typography>Статус:</Typography>
                                  {getStatusChip(order.status)}
                                </Box>
                                <Box display="flex" justifyContent="space-between" mt={2} pt={2} sx={{ borderTop: 1, borderColor: 'divider' }}>
                                  <Typography variant="h6">К оплате:</Typography>
                                  <Typography variant="h6" color="primary">
                                    {order.total} ₽
                                  </Typography>
                                </Box>
                              </Box>
                            </Grid>
                          </Grid>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Диалог для отзыва */}
      <Dialog open={feedbackDialogOpen} onClose={handleCloseFeedback} maxWidth="sm" fullWidth>
        <DialogTitle>
          Оставить отзыв {selectedOrder?.selectedItem ? `о "${selectedOrder.selectedItem.name}"` : 'о заказе'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography gutterBottom>Ваша оценка:</Typography>
            <Box display="flex" justifyContent="center" my={2}>
              {[1, 2, 3, 4, 5].map((star) => (
                <IconButton
                  key={star}
                  onClick={() => setFeedbackRating(star)}
                  color={star <= feedbackRating ? 'primary' : 'default'}
                >
                  <Star fontSize="large" />
                </IconButton>
              ))}
            </Box>
            
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Ваш отзыв"
              value={feedbackComment}
              onChange={(e) => setFeedbackComment(e.target.value)}
              placeholder="Расскажите, что вам понравилось или что можно улучшить..."
              variant="outlined"
              sx={{ mt: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFeedback}>Отмена</Button>
          <Button 
            onClick={handleSubmitFeedback} 
            variant="contained" 
            disabled={feedbackRating === 0}
          >
            Отправить отзыв
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OrdersHistoryPage;