import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  IconButton,
  Grid,
} from '@mui/material';
import {
  Add,
  Pending,
  CheckCircle,
  Cancel,
  Edit,
  Delete,
  ShoppingCart,
} from '@mui/icons-material';

const PurchaseRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    items: [{ name: '', quantity: '', unit: 'кг' }],
    urgency: 'normal',
    notes: '',
  });

  useEffect(() => {
    // Заглушка данных
    const mockRequests = [
      {
        id: 1,
        title: 'Овощи на неделю',
        items: [
          { name: 'Картофель', quantity: 10, unit: 'кг' },
          { name: 'Морковь', quantity: 5, unit: 'кг' },
          { name: 'Лук', quantity: 3, unit: 'кг' },
        ],
        date: '2024-01-20',
        status: 'pending',
        urgency: 'high',
        notes: 'Для супов и гарниров',
      },
      {
        id: 2,
        title: 'Мясные продукты',
        items: [
          { name: 'Курица', quantity: 15, unit: 'кг' },
          { name: 'Говядина', quantity: 8, unit: 'кг' },
        ],
        date: '2024-01-19',
        status: 'approved',
        urgency: 'normal',
        notes: 'На котлеты и рагу',
      },
      {
        id: 3,
        title: 'Молочные продукты',
        items: [
          { name: 'Молоко', quantity: 20, unit: 'л' },
          { name: 'Сыр', quantity: 5, unit: 'кг' },
          { name: 'Творог', quantity: 10, unit: 'кг' },
        ],
        date: '2024-01-18',
        status: 'rejected',
        urgency: 'low',
        notes: 'Для завтраков',
      },
    ];

    setTimeout(() => {
      setRequests(mockRequests);
      setLoading(false);
    }, 1000);
  }, []);

  const handleOpenDialog = (request = null) => {
    if (request) {
      setEditingRequest(request);
      setFormData({
        title: request.title,
        items: request.items,
        urgency: request.urgency,
        notes: request.notes,
      });
    } else {
      setEditingRequest(null);
      setFormData({
        title: '',
        items: [{ name: '', quantity: '', unit: 'кг' }],
        urgency: 'normal',
        notes: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingRequest(null);
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { name: '', quantity: '', unit: 'кг' }],
    });
  };

  const handleRemoveItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = () => {
    // Имитация сохранения
    const newRequest = {
      id: editingRequest ? editingRequest.id : requests.length + 1,
      title: formData.title,
      items: formData.items.filter(item => item.name && item.quantity),
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      urgency: formData.urgency,
      notes: formData.notes,
    };

    if (editingRequest) {
      setRequests(requests.map(req => req.id === editingRequest.id ? newRequest : req));
    } else {
      setRequests([newRequest, ...requests]);
    }

    handleCloseDialog();
  };

  const handleDeleteRequest = (id) => {
    if (window.confirm('Удалить эту заявку?')) {
      setRequests(requests.filter(req => req.id !== id));
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'pending':
        return <Chip icon={<Pending />} label="На рассмотрении" color="warning" />;
      case 'approved':
        return <Chip icon={<CheckCircle />} label="Одобрена" color="success" />;
      case 'rejected':
        return <Chip icon={<Cancel />} label="Отклонена" color="error" />;
      default:
        return <Chip label={status} />;
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'error';
      case 'normal': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          <ShoppingCart sx={{ mr: 2, verticalAlign: 'middle' }} />
          Заявки на закупку
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Новая заявка
        </Button>
      </Box>

      {requests.length === 0 ? (
        <Alert severity="info">
          У вас нет заявок на закупку. Создайте первую!
        </Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Название</TableCell>
                <TableCell>Товары</TableCell>
                <TableCell>Дата</TableCell>
                <TableCell>Срочность</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell align="right">Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <Typography variant="subtitle1">{request.title}</Typography>
                    {request.notes && (
                      <Typography variant="body2" color="textSecondary">
                        {request.notes}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {request.items.map((item, idx) => (
                      <Typography key={idx} variant="body2">
                        {item.name} - {item.quantity} {item.unit}
                      </Typography>
                    ))}
                  </TableCell>
                  <TableCell>{request.date}</TableCell>
                  <TableCell>
                    <Chip 
                      label={request.urgency === 'high' ? 'Высокая' : 
                             request.urgency === 'normal' ? 'Средняя' : 'Низкая'} 
                      color={getUrgencyColor(request.urgency)} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>{getStatusChip(request.status)}</TableCell>
                  <TableCell align="right">
                    {request.status === 'pending' && (
                      <>
                        <IconButton 
                          size="small" 
                          onClick={() => handleOpenDialog(request)}
                          color="primary"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleDeleteRequest(request.id)}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Диалог создания/редактирования заявки */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingRequest ? 'Редактировать заявку' : 'Новая заявка на закупку'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Название заявки"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              margin="normal"
              required
            />

            <Typography variant="subtitle1" sx={{ mt: 3, mb: 2 }}>
              Товары для закупки:
            </Typography>

            {formData.items.map((item, index) => (
              <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                <Grid item xs={5}>
                  <TextField
                    fullWidth
                    label="Наименование"
                    value={item.name}
                    onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="Количество"
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="Ед. изм."
                    value={item.unit}
                    onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                    size="small"
                    select
                    SelectProps={{ native: true }}
                  >
                    <option value="кг">кг</option>
                    <option value="л">л</option>
                    <option value="шт">шт</option>
                    <option value="уп">уп</option>
                  </TextField>
                </Grid>
                <Grid item xs={1}>
                  {formData.items.length > 1 && (
                    <IconButton 
                      size="small" 
                      onClick={() => handleRemoveItem(index)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  )}
                </Grid>
              </Grid>
            ))}

            <Button
              startIcon={<Add />}
              onClick={handleAddItem}
              sx={{ mt: 1 }}
            >
              Добавить товар
            </Button>

            <TextField
              fullWidth
              label="Срочность"
              value={formData.urgency}
              onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
              margin="normal"
              select
              SelectProps={{ native: true }}
            >
              <option value="low">Низкая</option>
              <option value="normal">Средняя</option>
              <option value="high">Высокая</option>
            </TextField>

            <TextField
              fullWidth
              label="Примечания"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              margin="normal"
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            disabled={!formData.title || formData.items.every(item => !item.name)}
          >
            {editingRequest ? 'Сохранить' : 'Создать'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PurchaseRequestsPage;