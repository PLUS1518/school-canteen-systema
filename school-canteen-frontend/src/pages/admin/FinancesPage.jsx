import React from 'react';
import {
  Container, Paper, Typography, Box, Grid, Card, CardContent,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, Chip // Добавьте Chip сюда
} from '@mui/material';
import { TrendingUp, Download } from '@mui/icons-material'; // Убрать TrendingDown

const mockTransactions = [
  { id: 1, date: '15.01.2024', student: 'Иванов И.', type: 'Пополнение', amount: 500, status: 'Успешно' },
  { id: 2, date: '15.01.2024', student: 'Петрова М.', type: 'Оплата заказа', amount: -120, status: 'Успешно' },
  { id: 3, date: '14.01.2024', student: 'Сидоров А.', type: 'Возврат', amount: 180, status: 'Успешно' },
  { id: 4, date: '14.01.2024', student: 'Кузнецов Д.', type: 'Оплата заказа', amount: -80, status: 'Ошибка' },
];

const FinancesPage = () => {
  const totalRevenue = 125600; // Примерная сумма

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h4" gutterBottom>Финансовый отчёт</Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card><CardContent><Typography color="textSecondary">Общая выручка</Typography><Typography variant="h4">{totalRevenue.toLocaleString()} ₽</Typography></CardContent></Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card><CardContent><Typography color="textSecondary">Прибыль за месяц</Typography><Typography variant="h4" sx={{ color: 'success.main' }}>+42,580 ₽ <TrendingUp /></Typography></CardContent></Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card><CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box><Typography color="textSecondary">Отчёт</Typography><Typography variant="body2">Январь 2024</Typography></Box>
            <Button variant="outlined" startIcon={<Download />}>Скачать</Button>
          </CardContent></Card>
        </Grid>
      </Grid>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Последние транзакции</Typography>
        <TableContainer>
          <Table>
            <TableHead><TableRow><TableCell>Дата</TableCell><TableCell>Ученик</TableCell><TableCell>Тип</TableCell><TableCell>Сумма</TableCell><TableCell>Статус</TableCell></TableRow></TableHead>
            <TableBody>
              {mockTransactions.map((t) => (
                <TableRow key={t.id}><TableCell>{t.date}</TableCell><TableCell>{t.student}</TableCell><TableCell>{t.type}</TableCell>
                  <TableCell sx={{ color: t.amount > 0 ? 'success.main' : 'error.main' }}>{t.amount > 0 ? '+' : ''}{t.amount} ₽</TableCell>
                  <TableCell><Chip label={t.status} size="small" color={t.status === 'Успешно' ? 'success' : 'error'} /></TableCell></TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Модуль финансов готов к интеграции с платёжным шлюзом и системой бухгалтерии.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default FinancesPage;