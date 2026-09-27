import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Wind, Home, BarChart3, GitCompare, Bell, History, FileText, User, ShieldCheck, LogIn, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand" onClick={closeMobileMenu}>
          <div className="brand-icon-wrapper">
            <Wind className="brand-icon" size={24} />
            <div className="radar-ping"></div>
          </div>
          <div className="brand-text-block">
            <span className="brand-name">AERO-DETECTIVE</span>
            <span className="brand-tagline">Air Quality Classification & Mining</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            Home
          </Link>
          <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
            Dashboard
          </Link>
          <Link to="/compare" className={`nav-link ${isActive('/compare') ? 'active' : ''}`}>
            Search & Compare
          </Link>
          <Link to="/notifications" className={`nav-link ${isActive('/notifications') ? 'active' : ''}`}>
            Alerts
          </Link>
          <Link to="/history" className={`nav-link ${isActive('/history') ? 'active' : ''}`}>
            History
          </Link>
          <Link to="/reports" className={`nav-link ${isActive('/reports') ? 'active' : ''}`}>
            Reports
          </Link>
          <Link to="/admin-support" className={`nav-link ${isActive('/admin-support') ? 'active' : ''}`}>
            Admin & Support
          </Link>
        </nav>

        {/* User / CTA actions */}
        <div className="navbar-actions">
          {user ? (
            <div className="navbar-user-group">
              <Link to="/profile" className={`profile-pill ${isActive('/profile') ? 'active' : ''}`}>
                <div className="user-avatar">
                  {user.name ? user.name.charAt(0) : 'U'}
                </div>
                <span className="user-name-label">{user.name.split(' ')[0]}</span>
              </Link>
              <button className="btn-nav-logout" onClick={logout} title="Sign Out">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-login">
                <LogIn size={16} />
                <span>Log In</span>
              </Link>
              <Link to="/register" className="btn-register">
                Register
              </Link>
            </div>
          )}

          {/* Mobile hamburger toggle */}
          <button
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="mobile-nav-dropdown">
          <Link to="/" className={`mobile-nav-link ${isActive('/') ? 'active' : ''}`} onClick={closeMobileMenu}>
            Home
          </Link>
          <Link to="/dashboard" className={`mobile-nav-link ${isActive('/dashboard') ? 'active' : ''}`} onClick={closeMobileMenu}>
            Dashboard
          </Link>
          <Link to="/compare" className={`mobile-nav-link ${isActive('/compare') ? 'active' : ''}`} onClick={closeMobileMenu}>
            Search & Compare
          </Link>
          <Link to="/notifications" className={`mobile-nav-link ${isActive('/notifications') ? 'active' : ''}`} onClick={closeMobileMenu}>
            Alerts
          </Link>
          <Link to="/history" className={`mobile-nav-link ${isActive('/history') ? 'active' : ''}`} onClick={closeMobileMenu}>
            History & Favorites
          </Link>
          <Link to="/reports" className={`mobile-nav-link ${isActive('/reports') ? 'active' : ''}`} onClick={closeMobileMenu}>
            Report Generation
          </Link>
          <Link to="/admin-support" className={`mobile-nav-link ${isActive('/admin-support') ? 'active' : ''}`} onClick={closeMobileMenu}>
            Admin & Support
          </Link>
          {user ? (
            <Link to="/profile" className={`mobile-nav-link ${isActive('/profile') ? 'active' : ''}`} onClick={closeMobileMenu}>
              Profile ({user.name})
            </Link>
          ) : (
            <Link to="/login" className="mobile-nav-link" onClick={closeMobileMenu}>
              Log In / Register
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
