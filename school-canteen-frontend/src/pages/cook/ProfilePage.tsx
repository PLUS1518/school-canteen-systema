import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Avatar,
  TextField,
  Button,
  Grid,
  Divider,
  Alert,
  Chip,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Restaurant as RestaurantIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/auth';

interface CookProfile {
  fullName: string;
  login: string;
  role: string;
  email?: string;
  phone?: string;
  specialization?: string;
  workExperience?: number; // в годах
  joinedDate?: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const CookProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState<CookProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [passwordEditing, setPasswordEditing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // Формы
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    specialization: '',
  });
  
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Загрузка профиля
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      // Здесь должен быть запрос к API для получения полного профиля повара
      // Пока используем данные из AuthContext + заглушки
      const mockProfile: CookProfile = {
        fullName: user?.fullName || 'Повар',
        login: user?.login || 'cook1',
        role: user?.role || 'cook',
        email: 'cook@school-canteen.ru',
        phone: '+7 (999) 123-45-67',
        specialization: 'Школьное питание',
        workExperience: 5,
        joinedDate: '2023-09-01',
      };
      
      setProfile(mockProfile);
      setFormData({
        fullName: mockProfile.fullName,
        email: mockProfile.email || '',
        phone: mockProfile.phone || '',
        specialization: mockProfile.specialization || '',
      });
    } catch (error) {
      console.error('Ошибка загрузки профиля:', error);
      setMessage({ type: 'error', text: 'Не удалось загрузить профиль' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      // Отправка данных на сервер
      const updatedData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
      };
      
      // Здесь должен быть реальный API запрос
      // const response = await authService.updateProfile(updatedData);
      
      // Имитация успешного обновления
      setTimeout(() => {
        if (profile) {
          const updatedProfile = {
            ...profile,
            ...updatedData,
          };
          setProfile(updatedProfile);
          
          // Обновляем данные в контексте
          if (updateUser) {
            updateUser({
              ...user!,
              fullName: formData.fullName,
            });
          }
        }
        
        setEditing(false);
        setMessage({ type: 'success', text: 'Профиль успешно обновлен!' });
      }, 500);
      
    } catch (error) {
      console.error('Ошибка обновления профиля:', error);
      setMessage({ type: 'error', text: 'Ошибка при обновлении профиля' });
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'Пароли не совпадают' });
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Пароль должен быть не менее 6 символов' });
      return;
    }
    
    try {
      // Здесь должен быть API запрос для смены пароля
      // const response = await authService.changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      
      // Имитация успешной смены пароля
      setTimeout(() => {
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setPasswordEditing(false);
        setMessage({ type: 'success', text: 'Пароль успешно изменен!' });
      }, 500);
      
    } catch (error) {
      console.error('Ошибка смены пароля:', error);
      setMessage({ type: 'error', text: 'Неверный текущий пароль' });
    }
  };

  const handleCancelEdit = () => {
    if (profile) {
      setFormData({
        fullName: profile.fullName,
        email: profile.email || '',
        phone: profile.phone || '',
        specialization: profile.specialization || '',
      });
    }
    setEditing(false);
  };

  if (loading) {
    return (
      <Container sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Заголовок и сообщения */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Профиль повара
        </Typography>
        {message && (
          <Alert severity={message.type} sx={{ mb: 2 }} onClose={() => setMessage(null)}>
            {message.text}
          </Alert>
        )}
      </Box>

      <Grid container spacing={3}>
        {/* Левая колонка - информация о поваре */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Avatar
                sx={{ width: 120, height: 120, mb: 2, bgcolor: 'secondary.main', fontSize: '3rem' }}
              >
                {profile?.fullName?.charAt(0) || 'П'}
              </Avatar>
              <Typography variant="h5">{profile?.fullName}</Typography>
              <Chip
                label="Повар"
                color="secondary"
                icon={<RestaurantIcon />}
                sx={{ mt: 1 }}
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Контактная информация
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography>{profile?.email || 'Не указан'}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography>{profile?.phone || 'Не указан'}</Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Статистика
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Card variant="outlined">
                    <CardContent sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h6">{profile?.workExperience || '0'}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        лет опыта
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card variant="outlined">
                    <CardContent sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h6">156</Typography>
                      <Typography variant="caption" color="text.secondary">
                        блюд сегодня
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>

        {/* Правая колонка - редактирование профиля */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Личная информация</Typography>
              {!editing ? (
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => setEditing(true)}
                >
                  Редактировать
                </Button>
              ) : (
                <Box>
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={handleCancelEdit}
                    sx={{ mr: 1 }}
                  >
                    Отмена
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveProfile}
                  >
                    Сохранить
                  </Button>
                </Box>
              )}
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="ФИО"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  disabled={!editing}
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!editing}
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Телефон"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!editing}
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Специализация"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  disabled={!editing}
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Логин"
                  value={profile?.login || ''}
                  disabled
                  margin="normal"
                  helperText="Логин нельзя изменить"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Дата начала работы"
                  value={profile?.joinedDate ? new Date(profile.joinedDate).toLocaleDateString('ru-RU') : ''}
                  disabled
                  margin="normal"
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Смена пароля */}
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Смена пароля</Typography>
              {!passwordEditing ? (
                <Button
                  variant="outlined"
                  startIcon={<LockIcon />}
                  onClick={() => setPasswordEditing(true)}
                >
                  Сменить пароль
                </Button>
              ) : (
                <Box>
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={() => setPasswordEditing(false)}
                    sx={{ mr: 1 }}
                  >
                    Отмена
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleChangePassword}
                  >
                    Сохранить пароль
                  </Button>
                </Box>
              )}
            </Box>

            {passwordEditing && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Текущий пароль"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    margin="normal"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Новый пароль"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    margin="normal"
                    helperText="Минимум 6 символов"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Подтвердите пароль"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    margin="normal"
                  />
                </Grid>
              </Grid>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CookProfilePage;