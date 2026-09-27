import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home,
  BarChart3, 
  GitCompare, 
  Bell, 
  History, 
  FileText, 
  User, 
  ShieldCheck,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Wind
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/', label: 'Home', icon: <Home size={18} /> },
    { to: '/dashboard', label: 'Dashboard', icon: <BarChart3 size={18} /> },
    { to: '/compare', label: 'Search & Compare', icon: <GitCompare size={18} /> },
    { to: '/notifications', label: 'Notifications', icon: <Bell size={18} />, badge: 2 },
    { to: '/history', label: 'History & Favorites', icon: <History size={18} /> },
    { to: '/reports', label: 'Report Generation', icon: <FileText size={18} /> },
    { to: '/profile', label: 'User Profile', icon: <User size={18} /> },
    { to: '/admin-support', label: 'Admin & Support', icon: <ShieldCheck size={18} /> },
  ];

  return (
    <aside className={`dashboard-sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Brand & Collapse toggle */}
      <div className="sidebar-brand-row">
        {!collapsed && (
          <div className="sidebar-brand-content">
            <div className="brand-icon-sm">
              <Wind size={18} />
            </div>
            <span className="brand-name-sm">AERO-DETECTIVE</span>
          </div>
        )}
        <button
          className="sidebar-toggle-btn"
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Toggle sidebar collapse"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation items list */}
      <div className="sidebar-scrollable-nav">
        <span className="sidebar-category-tag">{!collapsed ? 'SYSTEM MODULES' : '•'}</span>
        <nav className="sidebar-nav-list">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `side-nav-link ${isActive ? 'active' : ''}`}
              title={collapsed ? item.label : ''}
            >
              <span className="nav-item-icon">{item.icon}</span>
              {!collapsed && <span className="nav-item-label">{item.label}</span>}
              {!collapsed && item.badge && (
                <span className="nav-item-badge">{item.badge}</span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer User Profile & Logout */}
      <div className="sidebar-footer-group">
        {user ? (
          <div className="sidebar-user-pill">
            <div className="user-mini-avatar">
              {user.name?.charAt(0) || 'U'}
            </div>
            {!collapsed && (
              <div className="user-mini-info">
                <span className="user-mini-name">{user.name?.split(' ')[0]}</span>
                <span className="user-mini-role">{user.role || 'Analyst'}</span>
              </div>
            )}
            <button
              className="btn-side-logout"
              onClick={handleLogout}
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <NavLink
            to="/login"
            className="side-nav-link"
            title={collapsed ? 'Sign In' : ''}
          >
            <span className="nav-item-icon"><User size={18} /></span>
            {!collapsed && <span className="nav-item-label">Sign In</span>}
          </NavLink>
        )}
      </div>
    </aside>
  );
}
