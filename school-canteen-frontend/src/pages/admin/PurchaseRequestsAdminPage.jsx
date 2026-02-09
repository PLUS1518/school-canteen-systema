import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Pending,
  Comment,
  Visibility,
  Assignment,
  Person,
} from '@mui/icons-material';

const PurchaseRequestsAdminPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [decision, setDecision] = useState('');
  const [comment, setComment] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = () => {
    setLoading(true);
    
    // Заглушка данных
    const mockRequests = [
      {
        id: 1,
        title: 'Овощи на неделю',
        cookName: 'Петр Поваров',
        date: '2024-01-20',
        status: 'pending',
        urgency: 'high',
        items: [
          { name: 'Картофель', quantity: 10, unit: 'кг' },
          { name: 'Морковь', quantity: 5, unit: 'кг' },
          { name: 'Лук', quantity: 3, unit: 'кг' },
        ],
        notes: 'Для супов и гарниров',
      },
      {
        id: 2,
        title: 'Мясные продукты',
        cookName: 'Петр Поваров',
        date: '2024-01-19',
        status: 'approved',
        urgency: 'normal',
        items: [
          { name: 'Курица', quantity: 15, unit: 'кг' },
          { name: 'Говядина', quantity: 8, unit: 'кг' },
        ],
        notes: 'На котлеты и рагу',
        adminComment: 'Закупка согласована, бюджет выделен',
      },
      {
        id: 3,
        title: 'Молочные продукты',
        cookName: 'Иван Поваров',
        date: '2024-01-18',
        status: 'rejected',
        urgency: 'low',
        items: [
          { name: 'Молоко', quantity: 20, unit: 'л' },
          { name: 'Сыр', quantity: 5, unit: 'кг' },
          { name: 'Творог', quantity: 10, unit: 'кг' },
        ],
        notes: 'Для завтраков',
        adminComment: 'Превышение бюджета на молочную продукцию',
      },
      {
        id: 4,
        title: 'Хлебобулочные изделия',
        cookName: 'Мария Поварова',
        date: '2024-01-17',
        status: 'pending',
        urgency: 'normal',
        items: [
          { name: 'Хлеб', quantity: 30, unit: 'шт' },
          { name: 'Булочки', quantity: 50, unit: 'шт' },
        ],
        notes: 'На неделю',
      },
    ];

    setTimeout(() => {
      setRequests(mockRequests);
      setLoading(false);
    }, 1000);
  };

  const handleFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setFilter(newFilter);
    }
  };

  const handleOpenDecisionDialog = (request, decisionType) => {
    setSelectedRequest(request);
    setDecision(decisionType);
    setComment('');
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedRequest(null);
    setDecision('');
    setComment('');
  };

  const handleSubmitDecision = () => {
    if (!selectedRequest) return;
    
    setProcessing(true);
    
    // Имитация обработки
    setTimeout(() => {
      setRequests(requests.map(req => 
        req.id === selectedRequest.id 
          ? { 
              ...req, 
              status: decision,
              adminComment: comment || (decision === 'approved' ? 'Заявка одобрена' : 'Заявка отклонена'),
            } 
          : req
      ));
      
      setProcessing(false);
      handleCloseDialog();
    }, 1000);
  };

  const filteredRequests = filter === 'all' 
    ? requests 
    : requests.filter(req => req.status === filter);

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
      <Typography variant="h4" gutterBottom>
        <Assignment sx={{ mr: 2, verticalAlign: 'middle' }} />
        Управление заявками на закупку
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={handleFilterChange}
          aria-label="фильтр заявок"
        >
          <ToggleButton value="all">Все</ToggleButton>
          <ToggleButton value="pending">На рассмотрении</ToggleButton>
          <ToggleButton value="approved">Одобренные</ToggleButton>
          <ToggleButton value="rejected">Отклоненные</ToggleButton>
        </ToggleButtonGroup>

        <Chip 
          label={`Всего: ${requests.length}`} 
          color="primary" 
          variant="outlined" 
        />
      </Box>

      {filteredRequests.length === 0 ? (
        <Alert severity="info">
          Нет заявок, соответствующих выбранному фильтру
        </Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Заявка</TableCell>
                <TableCell>Повар</TableCell>
                <TableCell>Товары</TableCell>
                <TableCell>Срочность</TableCell>
                <TableCell>Дата</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell align="right">Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <Typography variant="subtitle1">{request.title}</Typography>
                    {request.notes && (
                      <Typography variant="body2" color="textSecondary">
                        {request.notes}
                      </Typography>
                    )}
                    {request.adminComment && (
                      <Typography variant="body2" color="primary" sx={{ mt: 0.5 }}>
                        <Comment fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                        {request.adminComment}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Person sx={{ mr: 1, color: 'text.secondary' }} />
                      {request.cookName}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {request.items.slice(0, 2).map((item, idx) => (
                      <Typography key={idx} variant="body2">
                        {item.name} - {item.quantity} {item.unit}
                      </Typography>
                    ))}
                    {request.items.length > 2 && (
                      <Typography variant="body2" color="textSecondary">
                        и еще {request.items.length - 2}...
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={request.urgency === 'high' ? 'Высокая' : 
                             request.urgency === 'normal' ? 'Средняя' : 'Низкая'} 
                      color={getUrgencyColor(request.urgency)} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>{request.date}</TableCell>
                  <TableCell>
                    {getStatusChip(request.status)}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Просмотреть детали">
                      <IconButton 
                        size="small"
                        onClick={() => setSelectedRequest(request)}
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    
                    {request.status === 'pending' && (
                      <>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<CheckCircle />}
                          onClick={() => handleOpenDecisionDialog(request, 'approved')}
                          sx={{ ml: 1 }}
                          color="success"
                        >
                          Одобрить
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Cancel />}
                          onClick={() => handleOpenDecisionDialog(request, 'rejected')}
                          sx={{ ml: 1 }}
                          color="error"
                        >
                          Отклонить
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Диалог принятия решения */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {decision === 'approved' ? 'Одобрить заявку?' : 'Отклонить заявку?'}
        </DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Box sx={{ mt: 2 }}>
              <Typography><strong>Заявка:</strong> {selectedRequest.title}</Typography>
              <Typography><strong>Повар:</strong> {selectedRequest.cookName}</Typography>
              <Typography><strong>Срочность:</strong> {selectedRequest.urgency === 'high' ? 'Высокая' : 
                                  selectedRequest.urgency === 'normal' ? 'Средняя' : 'Низкая'}</Typography>
              <Typography><strong>Примечание повара:</strong> {selectedRequest.notes || 'нет'}</Typography>
              
              <TextField
                fullWidth
                label="Комментарий к решению"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                margin="normal"
                multiline
                rows={3}
                placeholder="Укажите причину решения..."
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={processing}>
            Отмена
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmitDecision}
            disabled={processing}
            color={decision === 'approved' ? 'success' : 'error'}
            startIcon={processing ? <CircularProgress size={20} /> : null}
          >
            {processing ? 'Обработка...' : (decision === 'approved' ? 'Одобрить' : 'Отклонить')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог просмотра деталей */}
      {selectedRequest && !dialogOpen && (
        <Dialog open={!!selectedRequest} onClose={() => setSelectedRequest(null)} maxWidth="md" fullWidth>
          <DialogTitle>Детали заявки #{selectedRequest.id}</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>{selectedRequest.title}</Typography>
              
              <Typography><strong>Повар:</strong> {selectedRequest.cookName}</Typography>
              <Typography><strong>Дата создания:</strong> {selectedRequest.date}</Typography>
              <Typography><strong>Статус:</strong> {getStatusChip(selectedRequest.status)}</Typography>
              <Typography><strong>Срочность:</strong> 
                <Chip 
                  label={selectedRequest.urgency === 'high' ? 'Высокая' : 
                         selectedRequest.urgency === 'normal' ? 'Средняя' : 'Низкая'} 
                  color={getUrgencyColor(selectedRequest.urgency)} 
                  size="small" 
                  sx={{ ml: 1 }}
                />
              </Typography>
              
              {selectedRequest.notes && (
                <Typography paragraph sx={{ mt: 2 }}>
                  <strong>Примечание:</strong> {selectedRequest.notes}
                </Typography>
              )}
              
              {selectedRequest.adminComment && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  <strong>Комментарий администратора:</strong> {selectedRequest.adminComment}
                </Alert>
              )}

              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Список товаров:</Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Товар</TableCell>
                      <TableCell align="right">Количество</TableCell>
                      <TableCell>Единица измерения</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedRequest.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell>{item.unit}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedRequest(null)}>Закрыть</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default PurchaseRequestsAdminPage;