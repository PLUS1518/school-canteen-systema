import React from 'react';
import { Container, Typography, Paper, Box, Chip } from '@mui/material';
import { ShoppingCart, FilterList } from '@mui/icons-material';

const OrdersPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          <ShoppingCart sx={{ mr: 1, verticalAlign: 'middle' }} />
          Управление заказами
        </Typography>
        <Chip icon={<FilterList />} label="Все статусы" variant="outlined" />
      </Box>
      
      <Paper sx={{ p: 3 }}>
        <Typography color="textSecondary" paragraph>
          Здесь будет таблица всех заказов с фильтрацией и управлением
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 3 }}>
          <Paper variant="outlined" sx={{ p: 2, flex: 1, minWidth: 200 }}>
            <Typography variant="h6">23</Typography>
            <Typography variant="body2" color="textSecondary">Активных заказов</Typography>
          </Paper>
          <Paper variant="outlined" sx={{ p: 2, flex: 1, minWidth: 200 }}>
            <Typography variant="h6">156</Typography>
            <Typography variant="body2" color="textSecondary">Завершено сегодня</Typography>
          </Paper>
          <Paper variant="outlined" sx={{ p: 2, flex: 1, minWidth: 200 }}>
            <Typography variant="h6">42,580 ₽</Typography>
            <Typography variant="body2" color="textSecondary">Выручка за день</Typography>
          </Paper>
        </Box>
      </Paper>
    </Container>
  );
};

export default OrdersPage;