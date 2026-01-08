import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { ConfigProvider, App as AntdApp } from 'antd';
import { theme } from './theme/antdConfig';
import './styles/App.css';
import { LoginPage } from './pages/LoginPage/LoginPage.tsx';
import { RegisterPage } from './pages/RegisterPage/RegisterPage.tsx';
import { HomePage } from '@/pages/HomePage';
import { ProfilePage } from '@/pages/ProfilePage';
import { MainLayout } from '@/components/MainLayout';
import MainFeedPage from './pages/MainFeedPage';
import { CreatePetPage } from './pages/CreatePetPage';
import { EncyclopediaPage } from './pages/EncyclopediaPage';
import { SpeciesDetailPage } from './pages/SpeciesDetailPage';
import { BreedDetailPage } from './pages/BreedDetailPage';
import { ViewPetPage } from './pages/ViewPetPage';
import { MyPetsPage } from './pages/MyPetsPage';
import { EditPetPage } from './pages/EditPetPage';
import { AuthProvider } from '@/context/AuthContext';
import { EncyclopediaClassPage } from './pages/EncyclopediaClassPage';

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
    <AuthProvider>
      <ConfigProvider theme={theme}>
        <AntdApp>
          <BrowserRouter>
            <Routes>
              {/* Auth pages without layout */}
              <Route path="/login" element={<LoginRouteWrapper />} />
              <Route path="/register" element={<RegisterRouteWrapper />} />

              {/* Main app pages with unified layout */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="feed" element={<MainFeedPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="create-pet" element={<CreatePetPage />} />
                <Route path="users/:username/pets" element={<ViewPetPage />} />
                <Route path="my-pets" element={<MyPetsPage />} />
                <Route path="edit-pet/:id" element={<EditPetPage />} />
                <Route path="encyclopedia" element={<EncyclopediaPage />} />
                <Route path="encyclopedia/species/:speciesId" element={<SpeciesDetailPage />} />
                <Route path="encyclopedia/breed/:breedId" element={<BreedDetailPage />} />
                <Route path="encyclopedia/class/:classId" element={<EncyclopediaClassPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AntdApp>
      </ConfigProvider>
    </AuthProvider>
  );
}

export default App;
