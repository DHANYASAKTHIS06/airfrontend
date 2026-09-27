import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  Eye,
  Sliders,
  ChevronRight,
  TrendingUp,
  MapPin,
  Search
} from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import { useLocationContext } from '../context/LocationContext';
import './Landing.css';

export default function Landing() {
  const [searchInput, setSearchInput] = useState('');
  const { selectLocation } = useLocationContext();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e?.preventDefault();
    const loc = searchInput.trim() || 'Coimbatore';
    selectLocation(loc);
    navigate(`/air-quality/${encodeURIComponent(loc)}`);
  };

  const handleQuickPick = (loc) => {
    selectLocation(loc);
    navigate(`/air-quality/${encodeURIComponent(loc)}`);
  };

  const howItWorksSteps = [
    { num: "01", title: "ENTER LOCATION", desc: "User specifies any city, urban zone, or monitoring station." },
    { num: "02", title: "FETCH DATA", desc: "Acquires real-time multi-sensor telemetry (PM2.5, NO2, SPM, SO2, weather)." },
    { num: "03", title: "PROCESS DATA", desc: "Cleans sensor noise and calibrates relative humidity and wind dispersion factors." },
    { num: "04", title: "AI ANALYSIS", desc: "Random Forest classification & Apriori association pattern mining execution." },
    { num: "05", title: "SMART INSIGHT", desc: "Identifies primary pollution driver and boundary-layer thermal inversion risks." },
    { num: "06", title: "RECOMMENDATION", desc: "Generates clear, actionable public health and physical exposure guidelines." }
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
              <span>Next-Gen Environmental Intelligence</span>
            </div>

            <h1 className="hero-title-main">
              See What <br />
              <span className="gradient-text-teal">the Air Hides.</span>
            </h1>

            <p className="hero-description-main">
              Intelligent air-quality analysis powered by machine learning, data mining and environmental intelligence.
              Translating complex sensory matrices into immediate human understanding.
            </p>

            {/* Interactive Location Search Box */}
            <form onSubmit={handleSearch} className="hero-search-bar-frame">
              <div className="hero-search-input-wrap">
                <Search size={20} className="search-lead-icon" />
                <input
                  type="text"
                  className="hero-search-input"
                  placeholder="Where do you want to breathe better? (e.g. Coimbatore, Delhi...)"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-primary hero-analyze-btn">
                <span>Analyze Air</span>
                <ArrowRight size={18} />
              </button>
            </form>

            {/* Quick Suggestions */}
            <div className="hero-quick-chips">
              <span className="quick-lead"><Sparkles size={14} /> Quick Zones:</span>
              {['Coimbatore', 'Delhi', 'Bengaluru', 'Shimla', 'Mumbai'].map((city) => (
                <button
                  key={city}
                  type="button"
                  className="quick-chip-btn"
                  onClick={() => handleQuickPick(city)}
                >
                  {city}
                </button>
              ))}
            </div>

            {/* Secondary CTA row */}
            <div className="hero-cta-links">
              <button className="btn-secondary" onClick={() => navigate('/dashboard')}>
                <BarChart3 size={17} />
                <span>Open Dashboard</span>
              </button>
              <a href="#how-it-works" className="link-how-it-works">
                <span>Explore How It Works</span>
                <ChevronRight size={16} />
              </a>
            </div>
          </motion.div>

          {/* Right Floating Atmospheric Visualization */}
          <motion.div
            className="hero-right-visual"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className="radar-orbit-core">
              <div className="orbit-ring ring-1"></div>
              <div className="orbit-ring ring-2"></div>
              <div className="orbit-ring ring-3"></div>

              {/* Central AI Sensor Hub */}
              <div className="orbit-center-node">
                <Wind size={36} className="center-node-icon" />
                <span className="node-text">AERO AI</span>
              </div>

              {/* Floating Environmental Mini-Cards */}
              <motion.div
                className="floating-mini-card card-pm25"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="mini-lbl">PM2.5 Sensor</span>
                <span className="mini-val text-amber">Elevated (68 µg/m³)</span>
              </motion.div>

              <motion.div
                className="floating-mini-card card-humidity"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <span className="mini-lbl">Atmospheric Humidity</span>
                <span className="mini-val text-cyan">64% • Trapping Inversion</span>
              </motion.div>

              <motion.div
                className="floating-mini-card card-aqi-result"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              >
                <span className="mini-lbl">Classified Status</span>
                <strong className="mini-val text-amber">POOR (156 AQI)</strong>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. DATA ABSTRACTION SECTION: FROM COMPLEX DATA TO CLEAR DECISIONS */}
      <section className="data-abstraction-section">
        <div className="container">
          <div className="section-title-center">
            <span className="section-badge-kicker">CORE PHILOSOPHY</span>
            <h2 className="section-main-heading">
              From Complex Data <br />
              <span className="gradient-text">to Clear Decisions.</span>
            </h2>
            <p className="section-main-subtext">
              Raw sensor arrays are cluttered and confusing. AERO-DETECTIVE mines high-dimensional environmental telemetry
              and delivers simple, actionable human health guidance.
            </p>
          </div>

          {/* 3-Stage Abstraction Transformer Visualizer */}
          <div className="abstraction-transformer-container glass-card">
            {/* Left: Raw Data Streams */}
            <div className="ab-side-block raw-data-col">
              <span className="ab-col-tag">RAW ENVIRONMENTAL DATA</span>
              <div className="raw-sensor-tags-list">
                <span className="sensor-tag">PM2.5: 68.4 µg/m³</span>
                <span className="sensor-tag">RSPM / PM10: 124.2 µg/m³</span>
                <span className="sensor-tag">NO₂: 38.6 ppb</span>
                <span className="sensor-tag">SO₂: 12.1 ppb</span>
                <span className="sensor-tag">Wind: 8.5 km/h WSW</span>
                <span className="sensor-tag">Relative Humidity: 64%</span>
                <span className="sensor-tag">Ambient Temp: 29°C</span>
                <span className="sensor-tag">Thermal Inversion Index</span>
              </div>
            </div>

            {/* Center: AERO AI Core Engine */}
            <div className="ab-center-engine">
              <div className="engine-pulse-frame">
                <Cpu size={32} className="engine-pulse-icon" />
                <div className="pulse-wave-ring"></div>
              </div>
              <span className="engine-name-lbl">AERO-DETECTIVE AI</span>
              <span className="engine-sub-lbl">Random Forest + Apriori + K-Means</span>
            </div>

            {/* Right: Clean Abstracted Output */}
            <div className="ab-side-block clean-insight-col">
              <span className="ab-col-tag text-cyan">CLEAR HUMAN INSIGHT</span>
              <div className="clean-insight-card">
                <div className="ci-row">
                  <span className="ci-lbl">AIR QUALITY</span>
                  <span className="ci-badge badge-poor">POOR</span>
                </div>
                <div className="ci-row">
                  <span className="ci-lbl">MAIN CONCERN</span>
                  <strong className="ci-val">Particulate Pollution</strong>
                </div>
                <div className="ci-row">
                  <span className="ci-lbl">RECOMMENDATION</span>
                  <p className="ci-rec-text">Reduce prolonged outdoor exposure and avoid evening strenuous exertion.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS PROGRESSION */}
      <section id="how-it-works" className="how-it-works-section">
        <div className="container">
          <div className="section-title-center">
            <span className="section-badge-kicker">WORKFLOW PIPELINE</span>
            <h2 className="section-main-heading">How AERO-DETECTIVE Works</h2>
            <p className="section-main-subtext">A 6-step intelligent data mining and classification pipeline.</p>
          </div>

          <div className="how-steps-grid">
            {howItWorksSteps.map((step, idx) => (
              <motion.div
                key={step.num}
                className="step-tile-card glass-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <span className="step-big-num">{step.num}</span>
                <h3 className="step-tile-title">{step.title}</h3>
                <p className="step-tile-desc">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. INTEGRATED ML ENGINES */}
      <section className="ml-engines-section">
        <div className="container">
          <div className="section-title-center">
            <span className="section-badge-kicker">UNDER THE HOOD</span>
            <h2 className="section-main-heading">4 Integrated Machine Learning Architectures</h2>
          </div>

          <div className="engines-quad-grid">
            <div className="engine-quad-card glass-card">
              <Cpu size={26} className="text-cyan mb-sm" />
              <h3 className="quad-title">Random Forest</h3>
              <span className="quad-sub">Air Quality Classification</span>
              <p className="quad-desc">Ensemble multi-tree voting preventing baseline noise from skewing air hazard thresholds.</p>
            </div>

            <div className="engine-quad-card glass-card">
              <Database size={26} className="text-teal mb-sm" />
              <h3 className="quad-title">K-Means</h3>
              <span className="quad-sub">Spatial Pollution Grouping</span>
              <p className="quad-desc">Unsupervised clustering grouping geographic sensor stations into clean, moderate, and high-pollution zones.</p>
            </div>

            <div className="engine-quad-card glass-card">
              <Network size={26} className="text-green mb-sm" />
              <h3 className="quad-title">Apriori Miner</h3>
              <span className="quad-sub">Pollution Pattern Mining</span>
              <p className="quad-desc">Mines association rules connecting meteorological conditions with sudden pollutant spikes.</p>
            </div>

            <div className="engine-quad-card glass-card">
              <GitBranch size={26} className="text-blue mb-sm" />
              <h3 className="quad-title">PCA</h3>
              <span className="quad-sub">Feature Reduction</span>
              <p className="quad-desc">Reduces 12 multi-dimensional chemical sensor parameters into clear 2D principal variance axes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FINAL CTA BANNER */}
      <section className="landing-cta-banner">
        <div className="container">
          <div className="cta-banner-box glass-card">
            <h2 className="cta-h2">Experience Environmental Clarity Today</h2>
            <p className="cta-sub">Query your location or explore the full analytical dashboard.</p>
            <div className="cta-btns">
              <button className="btn-primary" onClick={() => handleQuickPick('Coimbatore')}>
                <span>Analyze Coimbatore Sample</span>
                <ArrowRight size={18} />
              </button>
              <button className="btn-secondary" onClick={() => navigate('/dashboard')}>
                <span>Open Dashboard Workspace</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
