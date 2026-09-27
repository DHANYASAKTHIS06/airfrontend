import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Wind, 
  ShieldCheck, 
  Cpu, 
  Database, 
  Network, 
  GitCompare, 
  Sparkles, 
  ArrowRight, 
  Activity, 
  CheckCircle2, 
  BarChart3, 
  FileText,
  Bell,
  Search,
  MapPin,
  AlertTriangle
} from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import { useLocationContext } from '../context/LocationContext';
import { findSupportedLocation } from '../data/supportedLocations';
import './Landing.css';

export default function Landing() {
  const [searchInput, setSearchInput] = useState('');
  const [searchError, setSearchError] = useState('');
  const { selectLocation } = useLocationContext();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e?.preventDefault();
    const query = searchInput.trim();
    if (!query) {
      setSearchError('Please enter a location name.');
      return;
    }

    const match = findSupportedLocation(query);
    if (!match) {
      setSearchError('Location Not Found.');
      return;
    }

    setSearchError('');
    selectLocation(match.name);
    navigate(`/air-quality/${encodeURIComponent(match.name)}`);
  };

  const handleQuickPick = (locName) => {
    selectLocation(locName);
    navigate(`/air-quality/${encodeURIComponent(locName)}`);
  };

  const features = [
    {
      icon: <Cpu size={24} className="feature-icon" />,
      title: "ML Air Quality Classification",
      desc: "Evaluates atmospheric matrices using the trained Random Forest classifier deployed on Render."
    },
    {
      icon: <Network size={24} className="feature-icon" />,
      title: "Pattern Mining & Associations",
      desc: "Identifies recurring pollution patterns and environmental trigger rules from sensory telemetry."
    },
    {
      icon: <Database size={24} className="feature-icon" />,
      title: "Spatial Clustering & PCA",
      desc: "Categorizes national monitoring stations into archetypes using principal variance components."
    },
    {
      icon: <GitCompare size={24} className="feature-icon" />,
      title: "Multi-Zone Comparison",
      desc: "Side-by-side comparative diagnostics between different regional monitoring stations."
    },
    {
      icon: <Bell size={24} className="feature-icon" />,
      title: "Automated Alerts & Notifications",
      desc: "Real-time warning dispatches triggered by particulate thresholds and inversion signatures."
    },
    {
      icon: <FileText size={24} className="feature-icon" />,
      title: "Executive Report Generation",
      desc: "Compiles downloadable analytical audit summaries and actionable health recommendations."
    }
  ];

  return (
    <div className="landing-root">
      <AnimatedBackground />

      {/* 1. HERO SECTION */}
      <section className="landing-hero-section">
        <div className="container hero-layout-flex">
          {/* Left Hero Text Block */}
          <motion.div 
            className="hero-left-content"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="hero-kicker-pill">
              <span className="pulsing-radar-dot"></span>
              <span>Air Pollution Pattern Mining & Classification System</span>
            </div>

            <h1 className="hero-title-main">
              Intelligent Air Quality <br />
              <span className="gradient-text-teal">Analytics & Insights</span>
            </h1>

            <p className="hero-description-main">
              A comprehensive atmospheric intelligence system translating multi-sensor telemetry into trained machine learning classifications, spatial clusters, and actionable environmental recommendations.
            </p>

            {/* Interactive Location Search Box */}
            <form onSubmit={handleSearch} className="hero-search-bar-frame">
              <div className="hero-search-input-wrap">
                <Search size={20} className="search-lead-icon" />
                <input
                  type="text"
                  className="hero-search-input"
                  placeholder="Search supported monitoring station (e.g. Coimbatore, Delhi, Bengaluru, Mumbai)..."
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    if (searchError) setSearchError('');
                  }}
                />
              </div>
              <button type="submit" className="btn-primary hero-analyze-btn">
                <span>Analyze Station</span>
                <ArrowRight size={18} />
              </button>
            </form>

            {searchError && (
              <div className="hero-search-error-msg">
                <AlertTriangle size={16} />
                <span>{searchError}</span>
              </div>
            )}

            {/* Quick Location Chips */}
            <div className="hero-quick-chips">
              <span className="quick-chip-label">Popular Stations:</span>
              {['Coimbatore', 'Delhi', 'Bengaluru', 'Mumbai', 'Chennai', 'Shimla'].map((city) => (
                <button
                  key={city}
                  type="button"
                  className="quick-pick-chip"
                  onClick={() => handleQuickPick(city)}
                >
                  <MapPin size={13} />
                  <span>{city}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Right Hero Graphic Card */}
          <motion.div 
            className="hero-graphic-card glass-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="hero-card-header">
              <div className="live-status-pill">
                <span className="pulsing-radar-dot"></span>
                <span>Render Backend ML Online</span>
              </div>
              <span className="hero-timestamp">Telemetry Grid</span>
            </div>

            <div className="hero-preview-body">
              <div className="hero-stat-box">
                <span className="stat-label">Model Pipeline</span>
                <span className="stat-val text-cyan">Random Forest + PCA</span>
              </div>
              <div className="hero-stat-box">
                <span className="stat-label">Supported Network</span>
                <span className="stat-val text-teal">National Sensors</span>
              </div>
              <div className="hero-stat-box">
                <span className="stat-label">Pattern Extraction</span>
                <span className="stat-val text-green">Association Mining</span>
              </div>
            </div>

            <div className="hero-card-cta">
              <Link to="/dashboard" className="btn-primary w-full text-center">
                <span>Open Analyst Dashboard</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. MAIN FEATURES MODULE SECTION */}
      <section className="landing-features-section">
        <div className="container">
          <div className="section-header-center">
            <span className="section-kicker">APPLICATION CAPABILITIES</span>
            <h2 className="section-title">Core System Modules</h2>
            <p className="section-desc">
              Engineered according to the system architecture specification for air quality pattern mining and classification.
            </p>
          </div>

          <div className="features-grid-3x2">
            {features.map((feat, i) => (
              <div key={i} className="feature-card glass-card">
                <div className="feat-icon-box">{feat.icon}</div>
                <h3 className="feat-title">{feat.title}</h3>
                <p className="feat-desc">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. QUICK NAVIGATION CTA */}
      <section className="landing-cta-strip">
        <div className="container cta-flex-box glass-card">
          <div>
            <h3 className="cta-headline">Ready to Explore Atmospheric Patterns?</h3>
            <p className="cta-sub">Query real station data and machine learning predictions across monitored locations.</p>
          </div>
          <div className="cta-action-buttons">
            <Link to="/dashboard" className="btn-primary">
              <span>Go to Dashboard</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/compare" className="btn-secondary">
              <span>Compare Stations</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
