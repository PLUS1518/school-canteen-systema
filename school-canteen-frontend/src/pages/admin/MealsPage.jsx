import React from 'react';
import { Container, Typography, Paper, Box, Button } from '@mui/material';
import { Restaurant, Add } from '@mui/icons-material';

const MealsPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          <Restaurant sx={{ mr: 1, verticalAlign: 'middle' }} />
          Управление блюдами
        </Typography>
        <Button variant="contained" startIcon={<Add />}>
          Добавить блюдо
        </Button>
      </Box>
      
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="textSecondary" paragraph>
          Здесь будет таблица с блюдами, их категориями, ценами и статусом
        </Typography>
        <Typography variant="body2">
          Функционал в разработке. Скоро здесь можно будет:
        </Typography>
        <ul style={{ textAlign: 'left', display: 'inline-block', marginTop: '16px' }}>
          <li>Добавлять/редактировать блюда</li>
          <li>Управлять категориями (завтрак, обед, ужин)</li>
          <li>Устанавливать цены и скидки</li>
          <li>Контролировать остатки ингредиентов</li>
        </ul>
      </Paper>
    </Container>
  );
};

export default MealsPage;