import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { theme } from './theme/antdConfig';
import './styles/App.css';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { HomePage } from './pages/HomePage';

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
    <ConfigProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginRouteWrapper />} />
          <Route path="/register" element={<RegisterRouteWrapper />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
