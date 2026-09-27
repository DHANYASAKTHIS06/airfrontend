import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GitCompare, MapPin, ArrowRight, Activity, AlertTriangle, ShieldCheck, Thermometer, Droplets, Wind, RefreshCw } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import LoadingAnimation from '../components/LoadingScreen';
import { airQualityService } from '../services/airQualityService';
import './Comparison.css';

export default function Comparison() {
  const [locA, setLocA] = useState('Coimbatore');
  const [locB, setLocB] = useState('Chennai');
  const [dataA, setDataA] = useState(null);
  const [dataB, setDataB] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchComparison = async (cityA, cityB) => {
    setLoading(true);
    setError(null);
    try {
      const [resA, resB] = await Promise.all([
        airQualityService.getAirQuality(cityA),
        airQualityService.getAirQuality(cityB)
      ]);
      setDataA(resA);
      setDataB(resB);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to compare environmental telemetry from Render backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComparison(locA, locB);
  }, []);

  const handleCompare = (e) => {
    e?.preventDefault();
    fetchComparison(locA, locB);
  };

  return (
    <div className="dashboard-layout-root">
      <Sidebar />

      <main className="dashboard-main-viewport">
        {/* Page Header */}
        <header className="page-header-block">
          <span className="page-kicker">CROSS-ZONE TELEMETRY COMPARISON</span>
          <h1 className="page-headline">Comparative Environmental Analysis</h1>
          <p className="page-subtext">
            Side-by-side air quality index and pollution driver differentiation using Render backend ML models.
          </p>
        </header>

        {/* Location Selectors Form */}
        <form onSubmit={handleCompare} className="compare-inputs-card glass-card">
          <div className="compare-select-col">
            <label className="comp-label">LOCATION A</label>
            <div className="input-loc-row">
              <MapPin size={16} className="pin-cyan" />
              <input
                type="text"
                className="comp-text-input"
                value={locA}
                onChange={(e) => setLocA(e.target.value)}
                placeholder="Enter Location A..."
              />
            </div>
          </div>

          <div className="compare-vs-badge">
            <GitCompare size={20} />
            <span>VS</span>
          </div>

          <div className="compare-select-col">
            <label className="comp-label">LOCATION B</label>
            <div className="input-loc-row">
              <MapPin size={16} className="pin-cyan" />
              <input
                type="text"
                className="comp-text-input"
                value={locB}
                onChange={(e) => setLocB(e.target.value)}
                placeholder="Enter Location B..."
              />
            </div>
          </div>

          <button type="submit" className="btn-primary btn-compare-submit" disabled={loading}>
            {loading ? "Analyzing..." : "Compare Air Profiles"}
          </button>
        </form>

        {loading && (
          <div style={{ padding: '60px 0' }}>
            <LoadingAnimation location={`${locA} vs ${locB}`} />
          </div>
        )}

        {error && !loading && (
          <div className="glass-card" style={{ padding: '30px', margin: '20px 0', borderColor: '#EF4444' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#EF4444', marginBottom: '10px' }}>
              <AlertTriangle size={24} />
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Comparison Error</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>{error}</p>
            <button className="btn-primary" onClick={() => fetchComparison(locA, locB)}>
              <RefreshCw size={16} />
              <span>Retry Comparison</span>
            </button>
          </div>
        )}

        {/* Comparison Showcase Table & Cards */}
        {dataA && dataB && !loading && !error && (
          <motion.div
            className="comparison-results-grid"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Location A Showcase */}
            <div className="comp-zone-card glass-card">
              <div className="comp-card-top">
                <span className="comp-side-tag">LOCATION A</span>
                <h2 className="comp-city-title">{dataA.name}</h2>
              </div>

              <div className="comp-aqi-badge-block">
                <span className="comp-aqi-num" style={{ color: dataA.categoryColor }}>{dataA.aqi}</span>
                <span className="comp-cat-label" style={{ color: dataA.categoryColor }}>{dataA.category}</span>
              </div>

              <div className="comp-field-box">
                <span className="cf-lbl">Primary Concern</span>
                <strong className="cf-val">{dataA.mainConcern}</strong>
              </div>

              <div className="comp-field-box">
                <span className="cf-lbl">Backend Recommendation</span>
                <p className="cf-rec">{dataA.recommendation}</p>
              </div>

              <div className="comp-weather-row">
                <span><Thermometer size={14} /> {dataA.weather?.temp}°C</span>
                <span><Droplets size={14} /> {dataA.weather?.humidity}%</span>
                <span><Wind size={14} /> {dataA.weather?.windSpeed} km/h</span>
              </div>
            </div>

            {/* Location B Showcase */}
            <div className="comp-zone-card glass-card">
              <div className="comp-card-top">
                <span className="comp-side-tag">LOCATION B</span>
                <h2 className="comp-city-title">{dataB.name}</h2>
              </div>

              <div className="comp-aqi-badge-block">
                <span className="comp-aqi-num" style={{ color: dataB.categoryColor }}>{dataB.aqi}</span>
                <span className="comp-cat-label" style={{ color: dataB.categoryColor }}>{dataB.category}</span>
              </div>

              <div className="comp-field-box">
                <span className="cf-lbl">Primary Concern</span>
                <strong className="cf-val">{dataB.mainConcern}</strong>
              </div>

              <div className="comp-field-box">
                <span className="cf-lbl">Backend Recommendation</span>
                <p className="cf-rec">{dataB.recommendation}</p>
              </div>

              <div className="comp-weather-row">
                <span><Thermometer size={14} /> {dataB.weather?.temp}°C</span>
                <span><Droplets size={14} /> {dataB.weather?.humidity}%</span>
                <span><Wind size={14} /> {dataB.weather?.windSpeed} km/h</span>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
