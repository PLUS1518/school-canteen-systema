import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Rating,
  Alert,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Paper,
} from '@mui/material';
import { 
  Close, 
  Send, 
  Person,
  Star,
  StarBorder,
} from '@mui/icons-material';
import { mealsService } from '../../services/meals';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  maxHeight: '80vh',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 3,
  borderRadius: 2,
  display: 'flex',
  flexDirection: 'column',
};

const FeedbackModal = ({ open, onClose, meal }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbacksLoading, setFeedbacksLoading] = useState(true);

  useEffect(() => {
    if (open && meal) {
      fetchFeedbacks();
    }
  }, [open, meal]);

  const fetchFeedbacks = async () => {
    if (!meal) return;
    
    try {
      setFeedbacksLoading(true);
      const response = await mealsService.getMealFeedback(meal.id);
      if (response.success) {
        setFeedbacks(response.data || []);
      }
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
    } finally {
      setFeedbacksLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!meal || !rating) {
      setError('Пожалуйста, поставьте оценку');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      const response = await mealsService.addFeedback(meal.id, rating, comment);
      
      if (response.success) {
        setSuccess(true);
        setRating(5);
        setComment('');
        fetchFeedbacks();
        
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        throw new Error(response.error || 'Ошибка при отправке отзыва');
      }
    } catch (err) {
      setError(err.message || 'Не удалось отправить отзыв');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setRating(5);
    setComment('');
    setError(null);
    setSuccess(false);
    setFeedbacks([]);
  };

  if (!meal) return null;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="feedback-modal-title"
    >
      <Box sx={style}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography id="feedback-modal-title" variant="h6">
            Отзыв о "{meal.name}"
          </Typography>
          <Button size="small" onClick={handleClose}>
            <Close />
          </Button>
        </Box>
        
        <Divider sx={{ mb: 3 }} />

        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Ваш отзыв:
          </Typography>
          
          <Box display="flex" alignItems="center" mb={2}>
            <Typography component="legend" sx={{ mr: 2 }}>
              Оценка:
            </Typography>
            <Rating
              value={rating}
              onChange={(event, newValue) => {
                setRating(newValue);
              }}
              icon={<Star fontSize="inherit" />}
              emptyIcon={<StarBorder fontSize="inherit" />}
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
              {rating}/5
            </Typography>
          </Box>

          <TextField
            fullWidth
            label="Комментарий (необязательно)"
            multiline
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            margin="normal"
            variant="outlined"
          />

          {error && (
            <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mt: 2, mb: 2 }}>
              Спасибо за ваш отзыв!
            </Alert>
          )}

          <Button
            fullWidth
            variant="contained"
            startIcon={submitting ? <CircularProgress size={20} /> : <Send />}
            onClick={handleSubmit}
            disabled={submitting || success}
            sx={{ mt: 2 }}
          >
            {submitting ? 'Отправка...' : 'Отправить отзыв'}
          </Button>
        </Paper>

        <Typography variant="subtitle1" gutterBottom>
          Отзывы других учеников:
        </Typography>

        {feedbacksLoading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : feedbacks.length > 0 ? (
          <List sx={{ 
            width: '100%', 
            maxHeight: 300, 
            overflow: 'auto',
            bgcolor: 'background.paper',
            borderRadius: 1,
          }}>
            {feedbacks.map((feedback) => (
              <ListItem key={feedback.id} alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar>
                    <Person />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="subtitle2">
                        {feedback.studentName}
                      </Typography>
                      <Rating value={feedback.rating} readOnly size="small" />
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                        sx={{ display: 'block', mb: 0.5 }}
                      >
                        {feedback.comment}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(feedback.date).toLocaleDateString('ru-RU')}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Alert severity="info">
            Пока нет отзывов. Будьте первым!
          </Alert>
        )}
      </Box>
    </Modal>
  );
};

export default FeedbackModal;