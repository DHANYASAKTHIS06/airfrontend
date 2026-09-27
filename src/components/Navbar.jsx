import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Wind, Shield, BarChart3, History, User, LogIn, Menu, X, Activity } from 'lucide-react';
import './Navbar.css';

export default function Navbar({ currentUser }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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
            <span className="brand-tagline">See What the Air Hides</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            Home
          </Link>
          <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
            <BarChart3 size={17} />
            <span>Dashboard</span>
          </Link>
          <Link to="/analyze/Coimbatore" className={`nav-link ${location.pathname.startsWith('/analyze') ? 'active' : ''}`}>
            <Activity size={17} />
            <span>Analysis</span>
          </Link>
          <Link to="/history" className={`nav-link ${isActive('/history') ? 'active' : ''}`}>
            <History size={17} />
            <span>History</span>
          </Link>
        </nav>

        {/* User / CTA actions */}
        <div className="navbar-actions">
          {currentUser ? (
            <Link to="/profile" className={`profile-pill ${isActive('/profile') ? 'active' : ''}`}>
              <div className="user-avatar">
                {currentUser.name ? currentUser.name.charAt(0) : 'U'}
              </div>
              <span className="user-name-label">{currentUser.name.split(' ')[0]}</span>
            </Link>
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
            <BarChart3 size={18} />
            Dashboard
          </Link>
          <Link to="/analyze/Coimbatore" className={`mobile-nav-link ${location.pathname.startsWith('/analyze') ? 'active' : ''}`} onClick={closeMobileMenu}>
            <Activity size={18} />
            Air Analysis
          </Link>
          <Link to="/history" className={`mobile-nav-link ${isActive('/history') ? 'active' : ''}`} onClick={closeMobileMenu}>
            <History size={18} />
            History
          </Link>
          <Link to="/profile" className={`mobile-nav-link ${isActive('/profile') ? 'active' : ''}`} onClick={closeMobileMenu}>
            <User size={18} />
            Profile & Settings
          </Link>
          <div className="mobile-nav-auth">
            <Link to="/login" className="btn-secondary w-full" onClick={closeMobileMenu}>
              Log In
            </Link>
            <Link to="/register" className="btn-primary w-full" onClick={closeMobileMenu}>
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
