import React, { createContext, useState, useContext, useEffect } from 'react';

interface User {
  login: string;
  role: string;
  fullName: string;
}

interface AuthContextType {
  user: User | null;
  login: (loginData: string, password: string) => Promise<{ 
    success: boolean; 
    user?: User; 
    error?: string 
  }>;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void; // Добавьте эту строку
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Проверяем, есть ли сохраненный пользователь
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (loginData: string, password: string) => {
    try {
      console.log('🔄 Отправка запроса на:', 'http://localhost:3000/api/auth/login');
      
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login: loginData, password }),
      });

      // Проверяем статус ответа
      if (!response.ok) {
        console.log('⚠️ Бэкенд вернул ошибку, переключаюсь на заглушку...');
        // НЕМЕДЛЕННО переходим к заглушке
        throw new Error('API недоступен');
      }

      const data = await response.json();
      console.log('📦 Ответ сервера:', data);
      
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        return { success: true, user: data.user };
      } else {
        throw new Error(data.error || 'Ошибка авторизации');
      }
    } catch (error: any) {
      console.error('🔥 Ошибка входа:', error);
      
      // ЗАГЛУШКА для тестирования
      console.log('⚠️ Использую тестовые данные...');
      
      const mockUsers: Record<string, any> = {
        'student1': { 
          id: 1,
          login: 'student1', 
          role: 'student', 
          fullName: 'Иван Учеников',
          class: '8А',
          balance: 1500
        },
        'cook1': { 
          id: 2,
          login: 'cook1', 
          role: 'cook', 
          fullName: 'Петр Поваров',
          class: '',
          balance: 0
        },
        'admin1': { 
          id: 3,
          login: 'admin1', 
          role: 'admin', 
          fullName: 'Сидор Админов',
          class: '',
          balance: 0
        }
      };
      
      const user = mockUsers[loginData];
      
      if (user) {
        const mockToken = 'mock-jwt-token-for-testing';
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        return { success: true, user };
      }
      
      return { 
        success: false, 
        error: 'Используйте: student1, cook1 или admin1 (пароль любой)' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };


  const updateUser = (updatedUser: Partial<User>) => {
    const newUser = { ...user, ...updatedUser } as User;
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};