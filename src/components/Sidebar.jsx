import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Activity, 
  Cpu, 
  Network, 
  Database, 
  GitCompare, 
  MapPin, 
  Bell, 
  Star, 
  History, 
  FileText, 
  User, 
  HelpCircle, 
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
    { to: '/dashboard', label: 'Overview', icon: <BarChart3 size={18} /> },
    { to: '/air-quality', label: 'Air Quality', icon: <Activity size={18} /> },
    { to: '/prediction', label: 'Prediction', icon: <Cpu size={18} /> },
    { to: '/pattern-mining', label: 'Pattern Mining', icon: <Network size={18} /> },
    { to: '/clustering', label: 'Pollution Clusters', icon: <Database size={18} /> },
    { to: '/compare', label: 'Compare', icon: <GitCompare size={18} /> },
    { to: '/map', label: 'Spatial Map', icon: <MapPin size={18} /> },
    { to: '/notifications', label: 'Notifications', icon: <Bell size={18} />, badge: 2 },
    { to: '/favorites', label: 'Favorites', icon: <Star size={18} /> },
    { to: '/history', label: 'History', icon: <History size={18} /> },
    { to: '/reports', label: 'Reports', icon: <FileText size={18} /> },
    { to: '/profile', label: 'Profile', icon: <User size={18} /> },
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
        <span className="sidebar-category-tag">{!collapsed ? 'PLATFORM INTELLIGENCE' : '•'}</span>
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

      {/* Footer Support & Profile */}
      <div className="sidebar-footer-group">
        <NavLink
          to="/help"
          className={({ isActive }) => `side-nav-link ${isActive ? 'active' : ''}`}
          title={collapsed ? 'Help & Support' : ''}
        >
          <span className="nav-item-icon"><HelpCircle size={18} /></span>
          {!collapsed && <span className="nav-item-label">Help & Support</span>}
        </NavLink>

        <button
          className="side-nav-link btn-sidebar-logout"
          onClick={handleLogout}
          title={collapsed ? 'Logout' : ''}
        >
          <span className="nav-item-icon"><LogOut size={18} /></span>
          {!collapsed && <span className="nav-item-label">Logout</span>}
        </button>

        {!collapsed && user && (
          <div className="sidebar-user-pill">
            <div className="user-avatar-tiny">{user.name ? user.name.charAt(0) : 'A'}</div>
            <div className="user-pill-text">
              <span className="user-pill-name">{user.name}</span>
              <span className="user-pill-email">{user.email}</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
