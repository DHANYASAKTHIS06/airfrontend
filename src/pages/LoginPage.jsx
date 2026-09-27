import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wind, Mail, Lock, LogIn, ArrowRight, CheckCircle2, Shield } from 'lucide-react';
import { AuthService } from '../services/authService';
import './AuthPages.css';

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await AuthService.login(email, password);
      if (res.success) {
        onLoginSuccess(res.user);
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = () => {
    setEmail('alex.mitchell@aerodetective.org');
    setPassword('sentinel-2026');
  };

  return (
    <div className="auth-page-root container">
      <div className="auth-card-glass glass-card">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-icon-wrap">
            <Wind size={26} className="auth-brand-icn" />
          </div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">
            Sign in to access your custom environmental mining dashboards
          </p>
        </div>

        {error && <div className="auth-error-alert">{error}</div>}

        {/* Form */}
        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-field-icon" />
              <input
                type="email"
                className="form-input"
                placeholder="analyst@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="label-flex-row">
              <label className="form-label">Password</label>
              <a href="#forgot" className="forgot-pass-link" onClick={(e) => { e.preventDefault(); alert("Password reset link sent to demo email."); }}>
                Forgot Password?
              </a>
            </div>
            <div className="input-with-icon">
              <Lock size={18} className="input-field-icon" />
              <input
                type="password"
                className="form-input"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary w-full btn-auth-submit"
            disabled={loading}
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <LogIn size={18} />
                <span>Sign In to System</span>
              </>
            )}
          </button>
        </form>

        {/* Demo credentials quick fill */}
        <div className="demo-credentials-box">
          <div className="demo-top">
            <Shield size={14} className="demo-shield" />
            <span>Quick Demo Credentials</span>
          </div>
          <button type="button" className="btn-demo-fill" onClick={handleDemoFill}>
            Auto-fill Analyst Credentials
          </button>
        </div>

        {/* Register Footer Link */}
        <div className="auth-footer-link">
          <span>Don't have an account?</span>
          <Link to="/register" className="auth-switch-link">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}
