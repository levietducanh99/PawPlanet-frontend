import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { ConfigProvider, App as AntdApp } from 'antd';
import { theme } from './theme/antdConfig';
import './styles/App.css';
import { LoginPage } from './pages/LoginPage/LoginPage.tsx';
import { RegisterPage } from './pages/RegisterPage/RegisterPage.tsx';
import { HomePage } from '@/pages/HomePage';
import { ProfilePage } from '@/pages/ProfilePage';
import { EditProfilePage } from '@/pages/EditProfilePage';
import { PostDetailPage } from '@/pages/PostDetailPage';
import { MainLayout } from '@/components/MainLayout';
import MainFeedPage from './pages/MainFeedPage';
import { CreatePetPage } from './pages/CreatePetPage';
import { EncyclopediaPage } from './pages/EncyclopediaPage';
import { SpeciesDetailPage } from './pages/SpeciesDetailPage';
import { BreedDetailPage } from './pages/BreedDetailPage';
import { ViewPetPage } from './pages/ViewPetPage';
import { EditPetPage } from './pages/EditPetPage';
import { ViewUserPage } from './pages/ViewUserPage';
import { AuthProvider, useAuthContext } from '@/context/AuthContext';
import { BackgroundProvider } from '@/context/BackgroundContext';
import { EncyclopediaClassPage } from './pages/EncyclopediaClassPage';
import { LandingPage } from '@/pages/LandingPage';
import { ExplorePage } from '@/features/explore';
import { CareSupportPage } from '@/pages/CareSupportPage';
import { TimezoneDebug } from '@/components/TimezoneDebug';

// Wrapper component for timezone debug page
function TimezoneDebugPage() {
  return <TimezoneDebug />;
}

function LoginRouteWrapper() {
  const navigate = useNavigate();
  return (
    <LoginPage
      onSwitchToRegister={() => navigate('/register')}
      onLoginSuccess={() => navigate('/home')}
    />
  );
}

function RegisterRouteWrapper() {
  const navigate = useNavigate();
  return (
    <RegisterPage
      onSwitchToLogin={() => navigate('/login')}
      onRegisterSuccess={() => navigate('/home')}
    />
  );
}

function LandingPageWrapper() {
  const navigate = useNavigate();
  return (
    <LandingPage
      onGetStarted={() => navigate('/login')}
    />
  );
}

// RootIndexWrapper: landing for unauthenticated users, redirect authenticated users into main app
function RootIndexWrapper() {
  const { isAuthenticated, loading } = useAuthContext();
  const navigate = useNavigate();

  if (loading) return null; // or render a spinner

  if (isAuthenticated) {
    // Redirect authenticated users into the app home (inside MainLayout)
    navigate('/home', { replace: true });
    return null;
  }

  return <LandingPageWrapper />;
}

function App() {
  return (
    <AuthProvider>
      <BackgroundProvider>
        <ConfigProvider theme={theme}>
          <AntdApp>
            <BrowserRouter>
            <Routes>
              {/* Root: landing or redirect to app */}
              <Route path="/" element={<RootIndexWrapper />} />

              {/* Landing explicit path (optional) */}
              <Route path="/landing" element={<LandingPageWrapper />} />

              {/* Auth pages without layout */}
              <Route path="/login" element={<LoginRouteWrapper />} />
              <Route path="/register" element={<RegisterRouteWrapper />} />

              {/* Main app pages with unified layout (Header + Sidebar) */}
              <Route element={<MainLayout />}>
                <Route path="home" element={<HomePage />} />
                <Route path="feed" element={<MainFeedPage />} />
                <Route path="explore" element={<ExplorePage />} />
                <Route path="care-support" element={<CareSupportPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="profile/edit" element={<EditProfilePage />} />
                <Route path="user/:userId" element={<ViewUserPage />} />
                <Route path="post/:postId" element={<PostDetailPage />} />
                <Route path="create-pet" element={<CreatePetPage />} />
                <Route path="pet/:petId" element={<ViewPetPage />} />
                <Route path="edit-pet/:id" element={<EditPetPage />} />
                <Route path="encyclopedia" element={<EncyclopediaPage />} />
                <Route path="encyclopedia/species/:speciesId" element={<SpeciesDetailPage />} />
                <Route path="encyclopedia/breed/:breedId" element={<BreedDetailPage />} />
                <Route path="encyclopedia/class/:classId" element={<EncyclopediaClassPage />} />
                {/* Debug route */}
                <Route path="debug/timezone" element={<TimezoneDebugPage />} />
              </Route>

              {/* Fallback could be added here */}
            </Routes>
          </BrowserRouter>
        </AntdApp>
      </ConfigProvider>
      </BackgroundProvider>
    </AuthProvider>
  );
}

export default App;
