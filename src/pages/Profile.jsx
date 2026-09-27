import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Building2, 
  ShieldCheck, 
  Sliders, 
  Lock,
  Save, 
  Check, 
  LogOut,
  AlertCircle
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

export default function Profile() {
  const { user, updateProfile, changePassword, logout } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || 'Environmental Analyst',
    email: user?.email || 'analyst@aerodetective.org',
    role: user?.role || 'Environmental Analyst',
    organization: user?.organization || 'Atmospheric Pattern Lab',
    alertThreshold: user?.preferences?.alertThreshold || 150,
    enableRealtimeAlerts: user?.preferences?.enableRealtimeAlerts ?? true,
    detailedMLMode: user?.preferences?.detailedMLMode ?? true,
    units: user?.preferences?.units || 'standard'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateProfile({
      name: formData.name,
      email: formData.email,
      role: formData.role,
      organization: formData.organization,
      preferences: {
        alertThreshold: parseInt(formData.alertThreshold) || 150,
        enableRealtimeAlerts: formData.enableRealtimeAlerts,
        detailedMLMode: formData.detailedMLMode,
        units: formData.units
      }
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (!passwordData.newPassword || passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      setPasswordSuccess(true);
      setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      setTimeout(() => setPasswordSuccess(false), 2500);
    } catch (err) {
      setPasswordError(err.message || 'Failed to update password.');
    }
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
            <span>Profile and analytical preferences saved successfully.</span>
          </div>
        )}

        {/* Settings Grid */}
        <div className="profile-grid-layout">
          {/* View / Edit Profile Form */}
          <form onSubmit={handleProfileSubmit} className="profile-left-col glass-card">
            <div className="card-sub-header">
              <User size={18} className="text-cyan" />
              <h3 className="sub-title">User Profile Details</h3>
            </div>

            <div className="form-group mb-1">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group mb-1">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={formData.email}
                disabled
              />
              <span className="field-hint">Email address is permanently linked to your authentication ID.</span>
            </div>

            <div className="form-group mb-1">
              <label className="form-label">Role Designation</label>
              <input
                type="text"
                className="form-input"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              />
            </div>

            <div className="form-group mb-1">
              <label className="form-label">Organization / Station</label>
              <input
                type="text"
                className="form-input"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              />
            </div>

            <div className="card-sub-header mt-2">
              <Sliders size={18} className="text-cyan" />
              <h3 className="sub-title">Profile Settings & Thresholds</h3>
            </div>

            <div className="form-group mb-1">
              <label className="form-label">Alert AQI Threshold</label>
              <input
                type="number"
                min="50"
                max="400"
                className="form-input"
                value={formData.alertThreshold}
                onChange={(e) => setFormData({ ...formData, alertThreshold: e.target.value })}
              />
              <span className="field-hint">System will fire warning alerts when AQI exceeds this index.</span>
            </div>

            <div className="toggle-group-row">
              <div>
                <strong className="toggle-title">Real-Time Alert Notifications</strong>
                <p className="toggle-desc">Receive instant notifications on particulate threshold spikes.</p>
              </div>
              <input
                type="checkbox"
                checked={formData.enableRealtimeAlerts}
                onChange={(e) => setFormData({ ...formData, enableRealtimeAlerts: e.target.checked })}
              />
            </div>

            <button type="submit" className="btn-primary mt-2">
              <Save size={16} />
              <span>Save Profile Changes</span>
            </button>
          </form>

          {/* Change Password Form */}
          <form onSubmit={handlePasswordSubmit} className="profile-right-col glass-card">
            <div className="card-sub-header">
              <Lock size={18} className="text-cyan" />
              <h3 className="sub-title">Change Password</h3>
            </div>

            {passwordError && (
              <div className="auth-error-alert mb-1">
                <AlertCircle size={16} />
                <span>{passwordError}</span>
              </div>
            )}

            {passwordSuccess && (
              <div className="profile-save-alert mb-1">
                <Check size={18} />
                <span>Password updated successfully.</span>
              </div>
            )}

            <div className="form-group mb-1">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Enter current password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                required
              />
            </div>

            <div className="form-group mb-1">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Minimum 6 characters"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                required
              />
            </div>

            <div className="form-group mb-1">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Repeat new password"
                value={passwordData.confirmNewPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn-primary mt-2">
              <Lock size={16} />
              <span>Update Password</span>
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
