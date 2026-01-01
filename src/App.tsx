import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './styles/App.css';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

function LoginRouteWrapper() {
  const navigate = useNavigate();
  return <LoginPage onSwitchToRegister={() => navigate('/register')} />;
}

function RegisterRouteWrapper() {
  const navigate = useNavigate();
  return <RegisterPage onSwitchToLogin={() => navigate('/login')} />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginRouteWrapper />} />
        <Route path="/register" element={<RegisterRouteWrapper />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
