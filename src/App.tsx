import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { theme } from './theme/antdConfig';
import './styles/App.css';
import { LoginPage } from './pages/LoginPage/LoginPage.tsx';
import { RegisterPage } from './pages/RegisterPage/RegisterPage.tsx';
import { HomePage } from '@/pages/HomePage';
import { CreatePetPage } from './pages/CreatePetPage';
import { EncyclopediaPage } from './pages/EncyclopediaPage';
import { SpeciesDetailPage } from './pages/SpeciesDetailPage';
import { BreedDetailPage } from './pages/BreedDetailPage';
import { ViewPetPage } from './pages/ViewPetPage';
import { MyPetsPage } from './pages/MyPetsPage';
import { EditPetPage } from './pages/EditPetPage';

function LoginRouteWrapper() {
  const navigate = useNavigate();
  return (
    <LoginPage
      onSwitchToRegister={() => navigate('/register')}
      onLoginSuccess={() => navigate('/')}
    />
  );
}

function RegisterRouteWrapper() {
  const navigate = useNavigate();
  return (
    <RegisterPage
      onSwitchToLogin={() => navigate('/login')}
      onRegisterSuccess={() => navigate('/')}
    />
  );
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
          <Route path="/users/:username/pets" element={<ViewPetPage />} />
          <Route path="/my-pets" element={<MyPetsPage />} />
          <Route path="/edit-pet/:id" element={<EditPetPage />} />
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
