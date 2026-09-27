import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// System Module Pages
import Landing from './pages/Landing';              // Module 3: Home
import Login from './pages/Login';                  // Module 1: Login & Authentication
import Register from './pages/Register';            // Module 2: Registration
import Dashboard from './pages/Dashboard';          // Module 5: Dashboard
import Comparison from './pages/Comparison';        // Module 6: Search & Comparison
import Notifications from './pages/Notifications';  // Module 7: Notification & Alert
import History from './pages/History';              // Module 8: History & Favorites
import Reports from './pages/Reports';              // Module 9: Report Generation
import Profile from './pages/Profile';              // Module 4: User Profile
import AdminSupport from './pages/AdminSupport';    // Module 10: Admin & Support
import AirQuality from './pages/AirQuality';        // Dedicated Air Quality Analysis

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

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="app-layout">
      {!isAuthPage && <Navbar currentUser={user} />}

      <Routes>
        {/* Module 3: Home */}
        <Route path="/" element={<Landing />} />

        {/* Module 1: Login & Authentication */}
        <Route path="/login" element={<Login />} />

        {/* Module 2: Registration */}
        <Route path="/register" element={<Register />} />

        {/* Module 5: Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Module 6: Search & Comparison */}
        <Route path="/compare" element={<Comparison />} />
        <Route path="/search" element={<Comparison />} />

        {/* Module 7: Notification & Alert */}
        <Route path="/notifications" element={<Notifications />} />

        {/* Module 8: History & Favorites */}
        <Route path="/history" element={<History />} />
        <Route path="/favorites" element={<History />} />

        {/* Module 9: Report Generation */}
        <Route path="/reports" element={<Reports />} />

        {/* Module 4: User Profile */}
        <Route path="/profile" element={<Profile />} />

        {/* Module 10: Admin & Support */}
        <Route path="/admin-support" element={<AdminSupport />} />
        <Route path="/admin" element={<AdminSupport />} />
        <Route path="/help" element={<AdminSupport />} />
        <Route path="/support" element={<AdminSupport />} />

        {/* Station Telemetry Analysis Deep-Dive */}
        <Route path="/air-quality" element={<AirQuality />} />
        <Route path="/air-quality/:location" element={<AirQuality />} />
        <Route path="/analyze/:location" element={<AirQuality />} />

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
