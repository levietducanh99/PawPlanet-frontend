import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { theme } from './theme/antdConfig';
import './styles/App.css';
import { LoginPage } from './pages/LoginPage/LoginPage.tsx';
import { RegisterPage } from './pages/RegisterPage/RegisterPage.tsx';
import { HomePage } from './pages/HomePage/HomePage.tsx';
import { CreatePetPage } from './pages/CreatePetPage';
import { EncyclopediaPage } from './pages/EncyclopediaPage';
import { SpeciesDetailPage } from './pages/SpeciesDetailPage';
import { BreedDetailPage } from './pages/BreedDetailPage';

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
          <Route path="/create-pet" element={<CreatePetPage />} />
          <Route path="/encyclopedia" element={<EncyclopediaPage />} />
          <Route path="/encyclopedia/species/:speciesId" element={<SpeciesDetailPage />} />
          <Route path="/encyclopedia/breed/:breedId" element={<BreedDetailPage />} />
          <Route path="/encyclopedia/class/:classId" element={<EncyclopediaPage />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
