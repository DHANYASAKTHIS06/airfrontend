import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wind, Mail, Lock, LogIn, Shield, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AnimatedBackground from '../components/AnimatedBackground';
import './AuthPages.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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

  const handleDemoFill = () => {
    setEmail('alex.mitchell@aerodetective.org');
    setPassword('sentinel-2026');
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
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">
            Continue your analytical journey with AERO-DETECTIVE
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
              <a href="#forgot" className="forgot-pass-link" onClick={(e) => { e.preventDefault(); alert("Demo password recovery link sent."); }}>
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
