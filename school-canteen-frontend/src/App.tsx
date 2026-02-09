import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import StudentDashboard from './pages/student/Dashboard';
import CookDashboard from './pages/cook/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/student/*" element={<StudentDashboard />} />
          <Route path="/cook/*" element={<CookDashboard />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;