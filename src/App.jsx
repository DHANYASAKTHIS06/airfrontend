import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import AirQuality from './pages/AirQuality';
import Prediction from './pages/Prediction';
import PatternMining from './pages/PatternMining';
import Clustering from './pages/Clustering';
import Comparison from './pages/Comparison';
import SpatialMapPage from './pages/SpatialMapPage';
import Notifications from './pages/Notifications';
import Favorites from './pages/Favorites';
import History from './pages/History';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import Help from './pages/Help';
import Login from './pages/Login';
import Register from './pages/Register';

// Context Providers
import { AuthProvider, useAuth } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Layout wrapper to conditionally render Navbar & Footer
function LayoutContent() {
  const { user } = useAuth();
  const location = useLocation();

  // On auth pages and dashboard workspace, keep a sleek layout
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="app-layout">
      {!isAuthPage && <Navbar currentUser={user} />}

      <Routes>
        {/* Public Landing */}
        <Route path="/" element={<Landing />} />

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard Workspace */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Dedicated Air Quality Analysis */}
        <Route path="/air-quality" element={<AirQuality />} />
        <Route path="/air-quality/:location" element={<AirQuality />} />
        <Route path="/analyze/:location" element={<AirQuality />} />

        {/* Dedicated ML & Feature Pages */}
        <Route path="/prediction" element={<Prediction />} />
        <Route path="/pattern-mining" element={<PatternMining />} />
        <Route path="/clustering" element={<Clustering />} />
        <Route path="/compare" element={<Comparison />} />
        <Route path="/map" element={<SpatialMapPage />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/history" element={<History />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/help" element={<Help />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!isAuthPage && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LocationProvider>
        <Router>
          <ScrollToTop />
          <LayoutContent />
        </Router>
      </LocationProvider>
    </AuthProvider>
  );
}
