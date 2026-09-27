import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wind, Mail, Lock, LogIn, Shield, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AnimatedBackground from '../components/AnimatedBackground';
import './AuthPages.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotModal, setForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide your email and password.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSent(true);
    setTimeout(() => {
      setForgotSent(false);
      setForgotModal(false);
      setForgotEmail('');
    }, 2500);
  };

  return (
    <div className="auth-split-root">
      <AnimatedBackground />

      <div className="auth-card-glass glass-card">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-icon-wrap">
            <Wind size={26} className="auth-brand-icn" />
          </div>
          <h1 className="auth-title">Account Login</h1>
          <p className="auth-subtitle">
            Sign in to access environmental telemetry & ML air quality insights
          </p>
        </div>

        {error && (
          <div className="auth-error-alert">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-field-icon" />
              <input
                type="email"
                className="form-input"
                placeholder="analyst@aerodetective.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="label-flex-row">
              <label className="form-label">Password</label>
              <button
                type="button"
                className="forgot-pass-btn"
                onClick={() => setForgotModal(true)}
              >
                Forgot Password?
              </button>
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
                <span>Sign In to Platform</span>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="auth-card-footer">
          <span>Don't have an analyst account?</span>
          <Link to="/register" className="auth-switch-link">
            <span>Register Account</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModal && (
        <div className="modal-backdrop">
          <div className="modal-card glass-card">
            <h3 className="modal-title">Reset Password</h3>
            <p className="modal-desc">
              Enter your registered email address to receive password recovery instructions.
            </p>

            {forgotSent ? (
              <div className="success-alert">
                <CheckCircle2 size={18} />
                <span>Password reset link sent to your email.</span>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit}>
                <div className="form-group mb-1">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="Enter your email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="modal-actions-row">
                  <button type="button" className="btn-secondary" onClick={() => setForgotModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
