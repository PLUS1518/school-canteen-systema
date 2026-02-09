import React, { useState } from 'react';
import {
  Container, Typography, Box, Card, CardContent,
  Button, Switch, FormControlLabel, TextField,
  Grid, IconButton, Chip
} from '@mui/material';
import { Add, Edit, Delete, Restaurant, LocalFireDepartment } from '@mui/icons-material';

const CookMenuPage = () => {
  const [meals, setMeals] = useState([
    { id: 1, name: 'Борщ', price: 180, category: 'lunch', type: 'soup', available: true, calories: 250 },
    { id: 2, name: 'Омлет', price: 120, category: 'breakfast', type: 'main', available: true, calories: 200 },
    { id: 3, name: 'Компот', price: 50, category: 'lunch', type: 'drink', available: false, calories: 120 },
    { id: 4, name: 'Каша гречневая', price: 100, category: 'breakfast', type: 'main', available: true, calories: 180 },
  ]);

  const [newMeal, setNewMeal] = useState({ name: '', price: '', category: 'lunch' });

  const toggleAvailability = (id) => {
    setMeals(meals.map(meal => 
      meal.id === id ? {...meal, available: !meal.available} : meal
    ));
  };

  const handleDelete = (id) => {
    if (window.confirm('Удалить это блюдо из меню?')) {
      setMeals(meals.filter(meal => meal.id !== id));
    }
  };

  const handleAddMeal = () => {
    if (!newMeal.name || !newMeal.price) {
      alert('Заполните название и цену');
      return;
    }

    const newId = Math.max(...meals.map(m => m.id)) + 1;
    setMeals([
      ...meals,
      {
        id: newId,
        name: newMeal.name,
        price: parseInt(newMeal.price),
        category: newMeal.category,
        type: 'main',
        available: true,
        calories: 0
      }
    ]);

    setNewMeal({ name: '', price: '', category: 'lunch' });
  };

  const getCategoryLabel = (category) => {
    return category === 'breakfast' ? 'Завтрак' : 'Обед';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Управление меню</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => document.getElementById('add-meal-dialog').showModal()}>
          Добавить блюдо
        </Button>
      </Box>

      <Grid container spacing={3}>
        {meals.map((meal) => (
          <Grid item xs={12} md={6} lg={4} key={meal.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="start">
                  <Box>
                    <Typography variant="h6" gutterBottom>{meal.name}</Typography>
                    <Box display="flex" gap={1} mb={1}>
                      <Chip label={getCategoryLabel(meal.category)} size="small" color="primary" />
                      <Chip label={meal.type === 'soup' ? 'Суп' : meal.type === 'drink' ? 'Напиток' : 'Основное'} size="small" variant="outlined" />
                    </Box>
                    <Typography variant="h5" color="primary" sx={{ mt: 1 }}>{meal.price} ₽</Typography>
                    {meal.calories > 0 && (
                      <Box display="flex" alignItems="center" mt={1}>
                        <LocalFireDepartment fontSize="small" color="action" sx={{ mr: 0.5 }} />
                        <Typography variant="body2" color="text.secondary">{meal.calories} ккал</Typography>
                      </Box>
                    )}
                  </Box>
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={meal.available} 
                        onChange={() => toggleAvailability(meal.id)}
                        color={meal.available ? "success" : "default"}
                      />
                    }
                    label={meal.available ? "Вкл" : "Выкл"}
                    labelPlacement="start"
                  />
                </Box>
              </CardContent>
              
              <Box display="flex" gap={1} p={2} pt={0}>
                <IconButton size="small" color="primary" title="Редактировать">
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton size="small" color="error" onClick={() => handleDelete(meal.id)} title="Удалить">
                  <Delete fontSize="small" />
                </IconButton>
                <Button size="small" variant="outlined" sx={{ ml: 'auto' }}>
                  Изменить цену
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Диалог добавления нового блюда */}
      <dialog id="add-meal-dialog" style={{ 
        border: 'none', 
        borderRadius: '8px', 
        padding: '20px', 
        width: '400px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
      }}>
        <Box>
          <Typography variant="h6" gutterBottom>Добавить новое блюдо</Typography>
          
          <TextField
            fullWidth
            label="Название блюда"
            value={newMeal.name}
            onChange={(e) => setNewMeal({...newMeal, name: e.target.value})}
            margin="normal"
          />
          
          <TextField
            fullWidth
            label="Цена (₽)"
            type="number"
            value={newMeal.price}
            onChange={(e) => setNewMeal({...newMeal, price: e.target.value})}
            margin="normal"
          />
          
          <Box mt={2}>
            <Typography variant="body2" color="text.secondary" gutterBottom>Категория</Typography>
            <Box display="flex" gap={1}>
              <Button 
                variant={newMeal.category === 'breakfast' ? 'contained' : 'outlined'}
                onClick={() => setNewMeal({...newMeal, category: 'breakfast'})}
                size="small"
              >
                Завтрак
              </Button>
              <Button 
                variant={newMeal.category === 'lunch' ? 'contained' : 'outlined'}
                onClick={() => setNewMeal({...newMeal, category: 'lunch'})}
                size="small"
              >
                Обед
              </Button>
            </Box>
          </Box>
          
          <Box display="flex" justifyContent="flex-end" gap={1} mt={3}>
            <Button onClick={() => document.getElementById('add-meal-dialog').close()}>
              Отмена
            </Button>
            <Button variant="contained" onClick={handleAddMeal}>
              Добавить
            </Button>
          </Box>
        </Box>
      </dialog>
    </Container>
  );
};

export default CookMenuPage;