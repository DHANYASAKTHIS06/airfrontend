import React from 'react';
import { Link } from 'react-router-dom';
import { Wind, ShieldCheck, Cpu, Database, Network, GitBranch, Heart } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer-root">
      <div className="container footer-container">
        {/* Brand & Purpose column */}
        <div className="footer-col-brand">
          <div className="footer-logo">
            <div className="footer-logo-icon">
              <Wind size={22} />
            </div>
            <div>
              <span className="footer-logo-text">AERO-DETECTIVE</span>
              <p className="footer-tagline">"See What the Air Hides."</p>
            </div>
          </div>
          <p className="footer-description">
            Advanced Air Pollution Pattern Mining and Air Quality Classification System.
            Bridging raw sensor metrics into actionable environmental intelligence using
            Random Forest, K-Means Clustering, Apriori Pattern Mining, and PCA.
          </p>
          <div className="footer-model-pills">
            <span className="model-tag"><Cpu size={12} /> Random Forest</span>
            <span className="model-tag"><Database size={12} /> K-Means</span>
            <span className="model-tag"><Network size={12} /> Apriori Miner</span>
            <span className="model-tag"><GitBranch size={12} /> PCA</span>
          </div>
        </div>

        {/* Quick links */}
        <div className="footer-col">
          <h4 className="footer-heading">Platform</h4>
          <ul className="footer-links">
            <li><Link to="/">Home Exploration</Link></li>
            <li><Link to="/dashboard">Analytical Dashboard</Link></li>
            <li><Link to="/analyze/Coimbatore">Air Quality Classification</Link></li>
            <li><Link to="/history">Search History</Link></li>
            <li><Link to="/profile">User Settings</Link></li>
          </ul>
        </div>

        {/* Monitored Hubs */}
        <div className="footer-col">
          <h4 className="footer-heading">Monitored Zones</h4>
          <ul className="footer-links">
            <li><Link to="/analyze/Coimbatore">Coimbatore (Industrial)</Link></li>
            <li><Link to="/analyze/Delhi">Delhi NCR (Smog Basin)</Link></li>
            <li><Link to="/analyze/Bengaluru">Bengaluru (Plateau Zone)</Link></li>
            <li><Link to="/analyze/Shimla">Shimla (Alpine Baseline)</Link></li>
            <li><Link to="/analyze/Mumbai">Mumbai (Coastal Transit)</Link></li>
          </ul>
        </div>

        {/* Core Methodology */}
        <div className="footer-col">
          <h4 className="footer-heading">Mining Logic</h4>
          <div className="mining-flow-badge">
            <div className="step-badge">
              <span className="step-num">1</span>
              <span>Location Query</span>
            </div>
            <div className="step-arrow">↓</div>
            <div className="step-badge">
              <span className="step-num">2</span>
              <span>Classification & Concern</span>
            </div>
            <div className="step-arrow">↓</div>
            <div className="step-badge">
              <span className="step-num">3</span>
              <span>Clear Recommendation</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-content">
          <p>© {new Date().getFullYear()} AERO-DETECTIVE Environmental Systems. All rights reserved.</p>
          <p className="footer-tagline-sub">Air Quality Classification & Pollution Pattern Mining Framework</p>
        </div>
      </div>
    </footer>
  );
}
