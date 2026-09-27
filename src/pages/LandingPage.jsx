import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Wind, 
  ShieldCheck, 
  Cpu, 
  Database, 
  Network, 
  GitBranch, 
  Sparkles, 
  ArrowRight, 
  Activity, 
  CheckCircle2, 
  BarChart3, 
  Layers, 
  Compass, 
  Eye
} from 'lucide-react';
import SearchBar from '../components/SearchBar';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleSearch = (location) => {
    navigate(`/analyze/${encodeURIComponent(location)}`);
  };

  const featureCards = [
    {
      icon: <Cpu size={24} className="feature-icon-cyan" />,
      title: "Random Forest Classification",
      desc: "Supervised multi-tree classification accurately classifying air hazard categories without misleading baseline distortions."
    },
    {
      icon: <Database size={24} className="feature-icon-teal" />,
      title: "K-Means Spatial Clustering",
      desc: "Discovers hidden regional pollution clusters and environmental micro-climates across geographic sensor networks."
    },
    {
      icon: <Network size={24} className="feature-icon-green" />,
      title: "Apriori Pattern Mining",
      desc: "Mines temporal and weather association rules to uncover which atmospheric conditions trigger sudden pollutant spikes."
    },
    {
      icon: <GitBranch size={24} className="feature-icon-blue" />,
      title: "PCA Feature Reduction",
      desc: "Deconstructs 12 multi-dimensional chemical sensors into clean, interpretable principal axes for human understanding."
    }
  ];

  const howItWorksSteps = [
    {
      num: "01",
      title: "Atmospheric Ingestion",
      desc: "Collects multi-station telemetry: PM2.5, PM10, NO2, SO2, CO, O3, alongside real-time meteorology."
    },
    {
      num: "02",
      title: "Pattern Mining & Classification",
      desc: "Runs ensemble classifiers and association miners to detect thermal inversions and chemical precursors."
    },
    {
      num: "03",
      title: "Abstracted Intelligence",
      desc: "Translates high-dimensional data into clear categories, primary pollution concerns, and actionable health guidance."
    }
  ];

  return (
    <div className="landing-page-root">
      {/* Glow ambient background elements */}
      <div className="ambient-glow-orb orb-1"></div>
      <div className="ambient-glow-orb orb-2"></div>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-badge animate-float">
            <span className="badge-pulse-dot"></span>
            <span className="hero-badge-text">Next-Gen Environmental Pattern Intelligence</span>
          </div>

          <h1 className="hero-headline">
            <span className="gradient-text">AERO-DETECTIVE</span>
          </h1>

          <p className="hero-tagline">
            "See What the Air Hides."
          </p>

          <p className="hero-subtext">
            An advanced Air Pollution Pattern Mining and Air Quality Classification System.
            Instantly discover true air safety, underlying pollution drivers, and targeted health actions for any city.
          </p>

          {/* Location Search Bar */}
          <div className="hero-search-container">
            <SearchBar onSearch={handleSearch} variant="hero" />
          </div>

          {/* Core Abstraction Example Preview Card */}
          <div className="hero-preview-wrapper">
            <div className="preview-label-strip">
              <Eye size={14} /> Simplified Abstraction Preview
            </div>
            <div className="preview-abstraction-card">
              <div className="preview-col">
                <span className="p-lbl">LOCATION</span>
                <span className="p-val-loc">COIMBATORE</span>
              </div>
              <div className="preview-divider">➔</div>
              <div className="preview-col">
                <span className="p-lbl">AIR QUALITY</span>
                <span className="p-val-badge badge-poor">POOR (156 AQI)</span>
              </div>
              <div className="preview-divider">➔</div>
              <div className="preview-col">
                <span className="p-lbl">MAIN CONCERN</span>
                <span className="p-val-concern">Particulate Pollution</span>
              </div>
              <div className="preview-divider">➔</div>
              <div className="preview-col">
                <span className="p-lbl">RECOMMENDATION</span>
                <span className="p-val-rec">Reduce prolonged outdoor exposure</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Banner */}
      <section className="stats-strip-section">
        <div className="container stats-strip-grid">
          <div className="stat-box">
            <span className="stat-number">4</span>
            <span className="stat-caption">Integrated Data Mining Algorithms</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">98.4%</span>
            <span className="stat-caption">Ensemble Classification Accuracy</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">6+</span>
            <span className="stat-caption">Monitored Pollutant Matrices</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">Real-Time</span>
            <span className="stat-caption">Actionable Health Guidance</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-section">
        <div className="container">
          <div className="section-header-center">
            <span className="section-kicker">INTELLIGENT ARCHITECTURE</span>
            <h2 className="section-title">Powered by Modern Data Mining & Machine Learning</h2>
            <p className="section-subtitle">
              We replace confusing sensor charts with clean, explainable classification and association discovery.
            </p>
          </div>

          <div className="features-grid">
            {featureCards.map((feat, idx) => (
              <div key={idx} className="feature-card glass-card">
                <div className="feature-icon-box">{feat.icon}</div>
                <h3 className="feature-card-title">{feat.title}</h3>
                <p className="feature-card-desc">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header-center">
            <span className="section-kicker">SYSTEM WORKFLOW</span>
            <h2 className="section-title">How AERO-DETECTIVE Uncovers the Atmosphere</h2>
            <p className="section-subtitle">From raw particulates to clear, human-understandable safety answers.</p>
          </div>

          <div className="steps-container">
            {howItWorksSteps.map((stg, i) => (
              <div key={i} className="step-card">
                <div className="step-number-glow">{stg.num}</div>
                <h3 className="step-title">{stg.title}</h3>
                <p className="step-desc">{stg.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-banner-glass">
            <h2 className="cta-title">Ready to Detect Air Quality in Your City?</h2>
            <p className="cta-subtitle">
              Enter any city name or explore comprehensive dashboard analytics now.
            </p>
            <div className="cta-btn-group">
              <button
                className="btn-primary btn-glow"
                onClick={() => navigate('/analyze/Coimbatore')}
              >
                <span>Analyze Sample Zone (Coimbatore)</span>
                <ArrowRight size={18} />
              </button>
              <button
                className="btn-secondary"
                onClick={() => navigate('/dashboard')}
              >
                <span>Open Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
