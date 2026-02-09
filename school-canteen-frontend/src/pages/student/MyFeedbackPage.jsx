import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Rating,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Avatar,
} from '@mui/material';
import { RateReview, Restaurant } from '@mui/icons-material';
import { mealsService } from '../../services/meals';

const MyFeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMyFeedback();
  }, []);

  const fetchMyFeedback = async () => {
    try {
      setLoading(true);
      // TODO: Заменить на реальный API endpoint когда будет готов
      // const response = await mealsService.getMyFeedback();
      
      // Временные тестовые данные
      setTimeout(() => {
        setFeedbacks([
          {
            id: 1,
            mealName: 'Куриный суп с лапшой',
            rating: 5,
            comment: 'Очень вкусный суп, курица нежная, лапша отличная!',
            date: '2024-01-26',
            mealType: 'Обед'
          },
          {
            id: 2,
            mealName: 'Гречневая каша с котлетой',
            rating: 4,
            comment: 'Котлета немного суховата, но каша отличная',
            date: '2024-01-25',
            mealType: 'Обед'
          },
          {
            id: 3,
            mealName: 'Омлет с сыром',
            rating: 5,
            comment: 'Пышный и сытный, идеальный завтрак!',
            date: '2024-01-24',
            mealType: 'Завтрак'
          }
        ]);
        setLoading(false);
      }, 500);
    } catch (err) {
      console.error('Ошибка загрузки отзывов:', err);
      setError('Не удалось загрузить ваши отзывы');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Загрузка ваших отзывов...
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <RateReview sx={{ mr: 2, fontSize: 40, color: 'primary.main' }} />
        <Typography variant="h4">
          Мои отзывы
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {feedbacks.length === 0 ? (
        <Alert severity="info">
          Вы еще не оставили ни одного отзыва. Оставьте свой первый отзыв в меню!
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {feedbacks.map((feedback) => (
            <Grid item xs={12} key={feedback.id}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {feedback.mealName}
                      </Typography>
                      <Chip 
                        icon={<Restaurant fontSize="small" />}
                        label={feedback.mealType}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <Chip 
                        label={feedback.date}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                    <Rating value={feedback.rating} readOnly size="large" />
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="body1" color="text.secondary">
                    {feedback.comment}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default MyFeedbackPage;