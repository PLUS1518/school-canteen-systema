import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
  Alert,
  Snackbar,
  Button,
} from '@mui/material';
import { BreakfastDining, LunchDining } from '@mui/icons-material';
import MealCard from '../../components/ui/MealCard';
import OrderModal from '../../components/common/OrderModal';
import { mealsService } from '../../services/meals';
import FeedbackModal from '../../components/common/FeedbackModal';

const MenuPage = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mealType, setMealType] = useState('all');
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

  // Маппинг для перевода типов блюд на русский
  const mealTypeMapping = {
    breakfast: 'Завтрак',
    lunch: 'Обед',
    dinner: 'Ужин',
    snack: 'Перекус',
    all: 'Все'
  };

  // Маппинг для русских значений в фильтре
  const filterTypeMapping = {
    'breakfast': 'breakfast',
    'lunch': 'lunch',
    'all': 'all'
  };

  useEffect(() => {
    fetchTodayMenu();
  }, []);

  const fetchTodayMenu = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Загружаю меню...');
      const response = await mealsService.getTodayMenu();
      
      console.log('📦 Ответ от mealsService:', response);
      
      // Простая проверка
      if (response && response.success && response.data) {
        console.log(`✅ Успешно! Загружено ${response.data.length} блюд`);
        setMeals(response.data);
      } else {
        const errorMsg = response?.error || 'Неизвестная ошибка';
        console.error('❌ Ошибка:', errorMsg);
        setError(errorMsg);
        setMeals([]);
      }
      
    } catch (err) {
      console.error('💥 Критическая ошибка:', err);
      setError(err.message || 'Ошибка при загрузке меню');
      setMeals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMealTypeChange = (event, newType) => {
    if (newType !== null) {
      setMealType(newType);
    }
  };

  const handleOrder = (meal) => {
    setSelectedMeal(meal);
    setOrderModalOpen(true);
  };

  const handleFeedback = (meal) => {
    setSelectedMeal(meal);
    setFeedbackModalOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage('');
    setError(null);
  };

  const filteredMeals = mealType === 'all' 
    ? meals 
    : meals.filter(meal => meal.type === mealType);

    console.log('🔍 ДЛЯ ОТЛАДКИ:');
    console.log('- Всего блюд:', meals.length);
    console.log('- Тип фильтра:', mealType);
    console.log('- Отфильтровано:', filteredMeals.length);
    console.log('- Первое блюдо:', meals[0]);
    console.log('- Все блюда:', meals);

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 3 }}>
          Загрузка меню...
        </Typography>
      </Box>
    );
  }



  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Меню на сегодня
        </Typography>
        
        <ToggleButtonGroup
          value={mealType}
          exclusive
          onChange={handleMealTypeChange}
          aria-label="тип питания"
        >
          <ToggleButton value="all" aria-label="все">
            Все
          </ToggleButton>
          <ToggleButton value="breakfast" aria-label="завтрак">
            <BreakfastDining sx={{ mr: 1 }} />
            Завтраки
          </ToggleButton>
          <ToggleButton value="lunch" aria-label="обед">
            <LunchDining sx={{ mr: 1 }} />
            Обеды
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
        <Typography variant="body2">
          Отладка: загружено {meals.length} блюд, фильтр: "{mealType}", отображается: {filteredMeals.length}
        </Typography>
      </Box>

      {/* Если есть блюда - показываем их */}
      {filteredMeals.length > 0 ? (
        <Grid container spacing={3}>
          {filteredMeals.map((meal) => (
            <Grid item key={meal.id} xs={12} sm={6} md={4} lg={3}>
              <MealCard
                meal={meal}
                onOrder={handleOrder}
                onFeedback={handleFeedback}
                typeLabel={mealTypeMapping[meal.type] || meal.type}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        /* Если блюд нет - показываем почему */
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            {meals.length === 0 ? 'Меню не загрузилось' : `Нет блюд в категории "${mealType}"`}
          </Typography>
          <Button 
            variant="outlined" 
            onClick={() => {
              console.log('Текущие данные:', { meals, filteredMeals, mealType });
              fetchTodayMenu();
            }}
          >
            Проверить данные
          </Button>
        </Box>
      )}

      {filteredMeals.length === 0 && !loading && (
        <Alert severity="info" sx={{ mt: 3 }}>
          На сегодня нет доступных блюд в выбранной категории.
        </Alert>
      )}

      <OrderModal
        open={orderModalOpen}
        onClose={() => {
          setOrderModalOpen(false);
          setSelectedMeal(null);
        }}
        meal={selectedMeal}
      />

      <FeedbackModal
        open={feedbackModalOpen}
        onClose={() => {
          setFeedbackModalOpen(false);
          setSelectedMeal(null);
        }}
        meal={selectedMeal}
      />

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={successMessage}
      />
    </Container>
  );
};

export default MenuPage;