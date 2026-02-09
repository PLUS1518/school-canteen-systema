import React, { useState } from 'react';
import {
  Container, Typography, Box, Card, CardContent,
  Chip, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import { CheckCircle, AccessTime } from '@mui/icons-material';

const CookOrdersPage = () => {
  const [orders, setOrders] = useState([
    { id: 1, table: 'Стол 1', items: ['Борщ', 'Компот'], status: 'pending', time: '12:30' },
    { id: 2, table: 'Стол 3', items: ['Омлет'], status: 'preparing', time: '12:25' },
    { id: 3, table: 'Стол 5', items: ['Борщ', 'Омлет'], status: 'pending', time: '12:35' },
  ]);

  const handleStartCooking = (orderId) => {
    console.log('Начинаем готовить заказ:', orderId);
    setOrders(orders.map(o => o.id === orderId ? {...o, status: 'preparing'} : o));
  };

  const handleComplete = (orderId) => {
    console.log('Заказ готов:', orderId);
    setOrders(orders.filter(o => o.id !== orderId));
  };

  const getStatusChip = (status) => {
    if (status === 'pending') {
      return <Chip icon={<AccessTime />} label="Ожидает" color="warning" size="small" />;
    } else {
      return <Chip icon={<CheckCircle />} label="Готовится" color="info" size="small" />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Typography variant="h4" gutterBottom>
        Текущие заказы
      </Typography>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Ожидают приготовления
            </Typography>
            <Typography variant="h4">
              {orders.filter(o => o.status === 'pending').length}
            </Typography>
          </CardContent>
        </Card>
        
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              В процессе
            </Typography>
            <Typography variant="h4">
              {orders.filter(o => o.status === 'preparing').length}
            </Typography>
          </CardContent>
        </Card>
        
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Всего заказов
            </Typography>
            <Typography variant="h4">
              {orders.length}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {orders.length === 0 ? (
        <Typography align="center" color="textSecondary" sx={{ py: 10 }}>
          На данный момент нет активных заказов
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Номер</strong></TableCell>
                <TableCell><strong>Стол</strong></TableCell>
                <TableCell><strong>Блюда</strong></TableCell>
                <TableCell><strong>Время</strong></TableCell>
                <TableCell><strong>Статус</strong></TableCell>
                <TableCell><strong>Действия</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell><strong>#{order.id}</strong></TableCell>
                  <TableCell>{order.table}</TableCell>
                  <TableCell>{order.items.join(', ')}</TableCell>
                  <TableCell>{order.time}</TableCell>
                  <TableCell>
                    {getStatusChip(order.status)}
                  </TableCell>
                  <TableCell>
                    {order.status === 'pending' ? (
                      <Button 
                        variant="contained" 
                        size="small" 
                        onClick={() => handleStartCooking(order.id)}
                      >
                        Начать готовить
                      </Button>
                    ) : (
                      <Button 
                        variant="contained" 
                        color="success" 
                        size="small"
                        onClick={() => handleComplete(order.id)}
                      >
                        Завершить
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default CookOrdersPage;