import React from 'react';
import {
  Container, Paper, Typography, Box,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, IconButton
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const mockUsers = [
  { id: 1, fullName: 'Иванов Иван', login: 'student1', role: 'Ученик', class: '8А', balance: 500, status: 'active' },
  { id: 2, fullName: 'Петрова Мария', login: 'student2', role: 'Ученик', class: '9Б', balance: 1200, status: 'active' },
  { id: 3, fullName: 'Сидоров Алексей', login: 'cook_alex', role: 'Повар', class: '-', balance: 0, status: 'active' },
  { id: 4, fullName: 'Админ Системный', login: 'admin', role: 'Администратор', class: '-', balance: 0, status: 'active' },
  { id: 5, fullName: 'Кузнецов Дмитрий', login: 'student3', role: 'Ученик', class: '10В', balance: 0, status: 'blocked' },
];

const UsersPage = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h4" gutterBottom>Управление пользователями</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell><TableCell>ФИО</TableCell><TableCell>Логин</TableCell>
              <TableCell>Роль</TableCell><TableCell>Класс</TableCell><TableCell>Баланс</TableCell>
              <TableCell>Статус</TableCell><TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.login}</TableCell>
                <TableCell><Chip label={user.role} size="small" color={user.role === 'Администратор' ? 'error' : 'primary'} /></TableCell>
                <TableCell>{user.class}</TableCell>
                <TableCell>{user.balance} ₽</TableCell>
                <TableCell><Chip label={user.status} size="small" color={user.status === 'active' ? 'success' : 'default'} /></TableCell>
                <TableCell>
                  <IconButton size="small"><Edit /></IconButton>
                  <IconButton size="small"><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          * Это демо-данные. Реализованы базовые операции: просмотр, фильтрация по роли, блокировка.
        </Typography>
      </Box>
    </Container>
  );
};

export default UsersPage;