import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import { AttachMoney, CreditCard, Close } from '@mui/icons-material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const OrderModal = ({ open, onClose, meal }) => {
  const [paymentType, setPaymentType] = useState('single');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!meal) return;
    
    setLoading(true);
    setError(null);
    
    // Имитация отправки заказа
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      
      // Закрываем модалку через 2 секунды
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setPaymentType('single');
      }, 2000);
    }, 1500);
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      setError(null);
      setSuccess(false);
      setPaymentType('single');
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="order-modal-title"
      aria-describedby="order-modal-description"
    >
      <Box sx={style}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography id="order-modal-title" variant="h6" component="h2">
            Оформление заказа
          </Typography>
          <Button size="small" onClick={handleClose} disabled={loading}>
            <Close />
          </Button>
        </Box>
        
        <Divider sx={{ mb: 3 }} />

        {meal && (
          <>
            <Box mb={3}>
              <Typography variant="subtitle1" gutterBottom>
                {meal.name}
              </Typography>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  {meal.description}
                </Typography>
                <Typography variant="h6" color="primary">
                  {meal.price} ₽
                </Typography>
              </Box>
            </Box>

            <FormControl component="fieldset" fullWidth sx={{ mb: 3 }}>
              <FormLabel component="legend">Способ оплаты</FormLabel>
              <RadioGroup
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
              >
                <FormControlLabel
                  value="single"
                  control={<Radio />}
                  label={
                    <Box display="flex" alignItems="center">
                      <AttachMoney sx={{ mr: 1 }} />
                      Разовая оплата
                    </Box>
                  }
                />
                <FormControlLabel
                  value="subscription"
                  control={<Radio />}
                  label={
                    <Box display="flex" alignItems="center">
                      <CreditCard sx={{ mr: 1 }} />
                      По абонементу
                    </Box>
                  }
                />
              </RadioGroup>
            </FormControl>

            {paymentType === 'subscription' && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Будет списано с баланса абонемента. Текущий баланс: <strong>1200 ₽</strong>
              </Alert>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Заказ успешно оформлен! Блюдо будет приготовлено к указанному времени.
              </Alert>
            )}

            <Box display="flex" justifyContent="space-between" mt={3}>
              <Button onClick={handleClose} disabled={loading}>
                Отмена
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading || success}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {loading ? 'Оформление...' : 'Подтвердить заказ'}
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default OrderModal;