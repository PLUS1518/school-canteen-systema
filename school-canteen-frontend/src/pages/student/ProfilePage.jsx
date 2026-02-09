import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Chip,
  Alert,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { Person, AttachMoney, MedicalServices, Save } from '@mui/icons-material';

const ProfilePage = () => {
  const [allergies, setAllergies] = useState('');
  const [preferences, setPreferences] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const userAllergies = ['Лактоза', 'Глютен']; // Пример аллергий
  const userBalance = 1200; // Пример баланса

  const handleSave = () => {
    setLoading(true);
    
    // Имитация сохранения
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        <Person sx={{ mr: 2, verticalAlign: 'middle' }} />
        Мой профиль
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <AttachMoney sx={{ mr: 1, color: 'green' }} />
          <Typography variant="h6">
            Баланс абонемента: <strong>{userBalance} ₽</strong>
          </Typography>
        </Box>
        
        <Typography variant="body2" color="text.secondary">
          Баланс пополняется администратором. Используется для оплаты обедов по абонементу.
        </Typography>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          <MedicalServices sx={{ mr: 1, verticalAlign: 'middle' }} />
          Пищевые ограничения
        </Typography>

        <Box mb={3}>
          <Typography variant="subtitle2" gutterBottom>
            Текущие аллергии:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            {userAllergies.map((allergy, index) => (
              <Chip key={index} label={allergy} color="warning" />
            ))}
            {userAllergies.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                Аллергии не указаны
              </Typography>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box component="form" noValidate autoComplete="off">
          <TextField
            fullWidth
            label="Новые аллергии (через запятую)"
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
            margin="normal"
            helperText="Например: Лактоза, Орехи, Рыба"
          />
          
          <TextField
            fullWidth
            label="Предпочтения в питании"
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            margin="normal"
            multiline
            rows={3}
            helperText="Например: Вегетарианские блюда, Без свинины"
          />

          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Данные успешно сохранены!
            </Alert>
          )}

          <Button
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} /> : <Save />}
            onClick={handleSave}
            disabled={loading}
            sx={{ mt: 3 }}
          >
            {loading ? 'Сохранение...' : 'Сохранить изменения'}
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Статистика питания
        </Typography>
        <List>
          <ListItem>
            <ListItemText 
              primary="Обедов за этот месяц" 
              secondary="12" 
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Средняя стоимость заказа" 
              secondary="135 ₽" 
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Предпочитаемый тип питания" 
              secondary="Обеды" 
            />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
};

export default ProfilePage;