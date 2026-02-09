import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  CardActions,
  Rating,
} from '@mui/material';
import {
  AttachMoney,
  Comment,
  Restaurant,
  LocalFireDepartment,
} from '@mui/icons-material';

// ================================================
// БАЗА ИЗОБРАЖЕНИЙ: URL и подписи для демо-блюд
// ================================================
// Рекомендую использовать Unsplash (бесплатные фото еды):
// Примеры: https://unsplash.com/s/photos/omelette, https://unsplash.com/s/photos/borscht
const MEAL_IMAGE_MAP = {
  // Подставьте СВОИ прямые ссылки на изображения вместо этих:
  'Омлет': 'https://img.povar.ru/main-micro/6d/03/96/9c/omlet_klassicheskii-868903.JPG', // Фото омлета
  'Борщ': 'https://smartpress.by/upload/medialibrary/a07/1caqxenxfa8knerekeriyihcoo200elb/borshch-v-tarelke.jpg', // Фото борща в тарелке
  'Компот': 'https://www.ecosever.ru/image/preview/article/9/0/5/44905_amp.jpeg', // Фото ягодного напитка
  'Обед': 'https://lambic.ru/storage/2022/02/image_event/3a91d1d8fe8b292590640d1d4e69fa26c6c51fef.jpg', // Фото комплексного обеда
  // ДОБАВЬТЕ сюда другие блюда по тому же принципу: 'Название блюда': 'ссылка_на_фото'
};

// Функция для получения ссылки на изображение по названию блюда
const getMealImage = (mealName) => {
  return MEAL_IMAGE_MAP[mealName] || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400'; // Заглушка (общая еда)
};

const MealCard = ({ meal, onOrder, onFeedback, typeLabel }) => {
  const [rating, setRating] = useState(meal?.averageRating || 4.5); // По умолчанию 4.5 для демо

  // Защита от отсутствия данных + значения по умолчанию
  if (!meal) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Typography>Информация о блюде недоступна</Typography>
        </CardContent>
      </Card>
    );
  }

  // Деструктуризация с надежными значениями по умолчанию
  const {
    name = 'Блюдо',
    description = 'Вкусное и полезное блюдо от наших поваров.',
    price = 120,
    available = true,
    calories = 250,
    ingredients = ['Натуральные продукты'],
    category = 'Основное',
  } = meal;

  // Получаем URL изображения по названию блюда
  const imageUrl = getMealImage(name);

  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 3
      }
    }}>
      {/* ============ ИЗОБРАЖЕНИЕ БЛЮДА ============ */}
      {/* Картинка берется из объекта MEAL_IMAGE_MAP по имени блюда */}
      <CardMedia
        component="img"
        height="180"
        image={imageUrl}
        alt={`Фотография: ${name}`}
        sx={{ objectFit: 'cover' }}
        title={`Фото блюда: ${name}`} // Всплывающая подсказка
      />

      <CardContent sx={{ flexGrow: 1 }}>
        {/* Категория блюда */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          {typeLabel && (
            <Chip
              label={typeLabel}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
          <Chip
              label={category}
              size="small"
              sx={{ ml: 1 }}
            />
        </Box>

        {/* Название блюда */}
        <Typography gutterBottom variant="h6" component="h2" noWrap>
          {name}
        </Typography>

        {/* Описание */}
        <Typography variant="body2" color="text.secondary" paragraph sx={{
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          minHeight: '60px' // Фиксированная высота для выравнивания карточек
        }}>
          {description}
        </Typography>

        {/* Дополнительная информация */}
        <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
          <Chip
              icon={<LocalFireDepartment fontSize="small" />}
              label={`${calories} ккал`}
              size="small"
              variant="outlined"
            />
          <Chip
              label={`${ingredients.length} ингр.`}
              size="small"
              variant="outlined"
            />
        </Box>

        {/* Рейтинг (демо) */}
        <Box display="flex" alignItems="center" mb={1}>
          <Rating
            value={rating}
            readOnly
            size="small"
            precision={0.5}
          />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            {rating.toFixed(1)} (12 оценок) {/* Демо-количество */}
          </Typography>
        </Box>

        {/* Цена и кнопка отзыва */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mt="auto">
          <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center' }}>
            <AttachMoney fontSize="small" sx={{ mr: 0.5 }} />
            {price} ₽
          </Typography>
          <Box>
            <IconButton
              size="small"
              color="primary"
              onClick={() => onFeedback && onFeedback(meal)}
              aria-label="оставить отзыв"
              title="Оставить отзыв"
            >
              <Comment />
            </IconButton>
          </Box>
        </Box>
      </CardContent>

      {/* Кнопка заказа */}
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={() => onOrder && onOrder(meal)}
          disabled={!available}
          startIcon={<Restaurant />}
          size="medium"
        >
          {available ? 'Заказать' : 'Недоступно'}
        </Button>
      </CardActions>
    </Card>
  );
};

export default MealCard;