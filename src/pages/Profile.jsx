import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Building2, 
  ShieldCheck, 
  Sliders, 
  MapPin, 
  Save, 
  Check, 
  LogOut,
  Sparkles
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { useLocationContext } from '../context/LocationContext';
import './Profile.css';

export default function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const { favorites } = useLocationContext();

  const [formData, setFormData] = useState({
    name: user?.name || 'Dr. Alex Mitchell',
    email: user?.email || 'alex.mitchell@aerodetective.org',
    role: user?.role || 'Environmental Analyst',
    organization: user?.organization || 'Atmospheric Pattern Lab',
    alertThreshold: user?.preferences?.alertThreshold || 150,
    enableRealtimeAlerts: user?.preferences?.enableRealtimeAlerts ?? true,
    detailedMLMode: user?.preferences?.detailedMLMode ?? true
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile({
      name: formData.name,
      email: formData.email,
      role: formData.role,
      organization: formData.organization,
      preferences: {
        alertThreshold: parseInt(formData.alertThreshold),
        enableRealtimeAlerts: formData.enableRealtimeAlerts,
        detailedMLMode: formData.detailedMLMode
      }
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="dashboard-layout-root">
      <Sidebar />

      <main className="dashboard-main-viewport">
        {/* Header banner */}
        <div className="profile-header-banner glass-card">
          <div className="profile-avatar-large">
            {formData.name.charAt(0)}
          </div>
          <div className="profile-banner-info">
            <div className="profile-role-pill">
              <ShieldCheck size={14} />
              <span>{formData.role}</span>
            </div>
            <h1 className="profile-user-name">{formData.name}</h1>
            <p className="profile-org-line">
              <Building2 size={15} /> {formData.organization} • Member since {user?.joinedDate || 'September 2026'}
            </p>
          </div>

          <button className="btn-secondary btn-logout" onClick={logout}>
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>

        {savedSuccess && (
          <div className="profile-save-alert">
            <Check size={18} />
            <span>Profile & environmental settings updated successfully.</span>
          </div>
        )}

        {/* Settings Grid */}
        <form onSubmit={handleSubmit} className="profile-grid-layout">
          {/* Account Details */}
          <div className="profile-left-col glass-card">
            <div className="card-sub-header">
              <User size={18} className="text-cyan" />
              <h3 className="sub-title">Analyst Identity</h3>
            </div>

            <div className="form-group mb-1">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>

            <div className="form-group mb-1">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
            </div>

            <div className="form-group mb-1">
              <label className="form-label">Specialization Role</label>
              <input
                type="text"
                className="form-input"
                value={formData.role}
                onChange={(e) => handleChange('role', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Organization / Lab</label>
              <input
                type="text"
                className="form-input"
                value={formData.organization}
                onChange={(e) => handleChange('organization', e.target.value)}
              />
            </div>
          </div>

          {/* Preferences */}
          <div className="profile-right-col glass-card">
            <div className="card-sub-header">
              <Sliders size={18} className="text-teal" />
              <h3 className="sub-title">Environmental Mining Preferences</h3>
            </div>

            <div className="pref-row">
              <div className="pref-info">
                <span className="pref-title">AQI Hazard Alert Threshold</span>
                <p className="pref-desc">Trigger notification alerts when city AQI crosses this level.</p>
              </div>
              <div className="threshold-input-wrap">
                <input
                  type="number"
                  min="30"
                  max="400"
                  className="threshold-input"
                  value={formData.alertThreshold}
                  onChange={(e) => handleChange('alertThreshold', e.target.value)}
                />
                <span className="thresh-unit">AQI</span>
              </div>
            </div>

            <div className="pref-row">
              <div className="pref-info">
                <span className="pref-title">Auto-Expand Advanced ML Mining</span>
                <p className="pref-desc">Enable deep technical inspection tabs for Random Forest & Apriori by default.</p>
              </div>
              <label className="switch-toggle">
                <input
                  type="checkbox"
                  checked={formData.detailedMLMode}
                  onChange={(e) => handleChange('detailedMLMode', e.target.checked)}
                />
                <span className="slider-round"></span>
              </label>
            </div>

            <div className="pref-row">
              <div className="pref-info">
                <span className="pref-title">Thermal Inversion Notifications</span>
                <p className="pref-desc">Receive real-time warnings when night-time boundary layer traps particulates.</p>
              </div>
              <label className="switch-toggle">
                <input
                  type="checkbox"
                  checked={formData.enableRealtimeAlerts}
                  onChange={(e) => handleChange('enableRealtimeAlerts', e.target.checked)}
                />
                <span className="slider-round"></span>
              </label>
            </div>

            <div className="monitored-zones-box">
              <span className="pref-title mb-sm">Saved Monitoring Hubs ({favorites.length})</span>
              <div className="saved-chips-flex">
                {favorites.map((hub, i) => (
                  <div key={i} className="saved-hub-chip">
                    <MapPin size={13} className="hub-pin" />
                    <span>{hub}</span>
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" className="btn-primary btn-save-profile">
              <Save size={18} />
              <span>Save Profile Preferences</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
