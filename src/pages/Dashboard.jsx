import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Search, 
  Sliders, 
  Star, 
  AlertTriangle, 
  ArrowUpRight,
  RefreshCw,
  Cpu,
  GitCompare,
  FileText,
  Bell
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import AQIRing from '../components/AQIRing';
import InsightCard from '../components/InsightCard';
import AirQualityChart from '../components/AirQualityChart';
import PollutionMap from '../components/PollutionMap';
import PollutionCard from '../components/PollutionCard';
import LoadingAnimation from '../components/LoadingScreen';
import { useLocationContext } from '../context/LocationContext';
import { useAuth } from '../context/AuthContext';
import { findSupportedLocation, SUPPORTED_LOCATIONS } from '../data/supportedLocations';
import './Dashboard.css';

export default function Dashboard() {
  const { selectedLocation, airData, loading, error, selectLocation, toggleFavorite, isFavorite, refetch, history } = useLocationContext();
  const { user } = useAuth();
  const [searchInput, setSearchInput] = useState('');
  const [searchError, setSearchError] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchInput.trim();
    if (!query) return;

    const match = findSupportedLocation(query);
    if (!match) {
      setSearchError('Location Not Found.');
      return;
    }

    setSearchError('');
    selectLocation(match.name);
    setSearchInput('');
  };

  const hubLocations = ['Coimbatore', 'Delhi', 'Bengaluru', 'Mumbai', 'Chennai', 'Shimla', 'Jaipur', 'Kolkata']
    .map(name => findSupportedLocation(name))
    .filter(Boolean);

  return (
    <div className="dashboard-layout-root">
      <Sidebar />

      <main className="dashboard-main-viewport">
        {/* Dashboard Top Header */}
        <header className="dash-header-bar">
          <div className="dash-greeting-block">
            <span className="dash-kicker">ATMOSPHERIC INTELLIGENCE DASHBOARD</span>
            <h1 className="dash-headline">
              Welcome, {user?.name ? user.name.split(' ')[0] : 'Analyst'}
            </h1>
          </div>

          {/* Location Selector & Quick Search */}
          <div className="dash-search-group">
            <form onSubmit={handleSearch} className="dash-search-form">
              <MapPin size={16} className="pin-cyan" />
              <input
                type="text"
                className="dash-search-input"
                placeholder="Search supported location..."
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  if (searchError) setSearchError('');
                }}
              />
              <button type="submit" className="btn-dash-search">Search</button>
            </form>
            {searchError && (
              <span className="dash-search-error">{searchError}</span>
            )}
          </div>
        </header>

        {/* Quick Hubs Switcher Bar */}
        <div className="dash-hubs-strip">
          {hubLocations.map((hub) => {
            const isActive = hub.name.toLowerCase() === selectedLocation.toLowerCase();
            return (
              <div
                key={hub.name}
                className={`dash-hub-pill ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setSearchError('');
                  selectLocation(hub.name);
                }}
              >
                <span className="hub-dot" style={{ backgroundColor: "#14B8A6" }}></span>
                <span className="hub-name">{hub.name}</span>
              </div>
            );
          })}
        </div>

        {/* Quick Actions Strip */}
        <div className="dash-quick-actions-bar">
          <Link to="/compare" className="dash-quick-btn">
            <GitCompare size={16} />
            <span>Compare Stations</span>
          </Link>
          <Link to="/reports" className="dash-quick-btn">
            <FileText size={16} />
            <span>Generate Report</span>
          </Link>
          <Link to="/notifications" className="dash-quick-btn">
            <Bell size={16} />
            <span>Alerts & Notifications</span>
          </Link>
          <Link to="/history" className="dash-quick-btn">
            <Star size={16} />
            <span>History & Favorites</span>
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ padding: '60px 0' }}>
            <LoadingAnimation location={selectedLocation} />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="glass-card" style={{ padding: '30px', margin: '20px 0', borderColor: '#EF4444' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#EF4444', marginBottom: '10px' }}>
              <AlertTriangle size={24} />
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>
                {error.includes('Location Not Found') ? 'Location Not Found.' : 'Unable to fetch data'}
              </h3>
            </div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
              {error.includes('Location Not Found') 
                ? 'The requested location is not in the supported monitoring station dataset.' 
                : 'Unable to communicate with the deployed Render backend ML service.'}
            </p>
            <button className="btn-primary" onClick={refetch}>
              <RefreshCw size={16} />
              <span>Retry Request</span>
            </button>
          </div>
        )}

        {/* Primary Real ML Air Quality Showcase */}
        {airData && !loading && !error && (
          <>
            <div className="dash-primary-showcase glass-card">
              <div className="showcase-left">
                <div className="showcase-location-header">
                  <div className="loc-flex-row">
                    <MapPin size={22} className="pin-cyan" />
                    <h2 className="showcase-loc-name">{airData.name.toUpperCase()}</h2>
                    <button
                      className={`btn-fav-star ${isFavorite(airData.name) ? 'favorited' : ''}`}
                      onClick={() => toggleFavorite(airData.name)}
                      title="Toggle favorite"
                    >
                      <Star size={18} />
                    </button>
                  </div>
                  <span className="showcase-region-tag">{airData.region}, {airData.country}</span>
                </div>

                <div className="showcase-category-block">
                  <span className="showcase-sub-label">BACKEND ML CLASSIFICATION</span>
                  <span className="showcase-cat-name" style={{ color: airData.categoryColor }}>
                    {airData.category.toUpperCase()}
                  </span>
                  <p className="showcase-brief-desc">{airData.shortAdvice}</p>
                </div>

                {/* Action Buttons */}
                <div className="showcase-action-btns">
                  <Link to={`/air-quality/${encodeURIComponent(airData.name)}`} className="btn-primary">
                    <span>Deep-Dive Analysis</span>
                    <ArrowUpRight size={17} />
                  </Link>
                  <Link to={`/compare?cityA=${encodeURIComponent(airData.name)}`} className="btn-secondary">
                    <GitCompare size={16} />
                    <span>Compare Station</span>
                  </Link>
                </div>
              </div>

              {/* Right: Animated AQI Ring */}
              <div className="showcase-right-ring">
                <AQIRing
                  aqi={airData.aqi}
                  category={airData.category}
                  color={airData.categoryColor}
                  size={180}
                />
              </div>
            </div>

            {/* Smart Actionable Recommendation Banner */}
            <div className="dash-insights-section">
              <div className="smart-rec-banner glass-card">
                <div className="rec-header-row">
                  <div className="rec-title-group">
                    <AlertTriangle size={20} style={{ color: airData.categoryColor }} />
                    <h3 className="rec-title">DEPLOYED ML RECOMMENDATION & METRICS</h3>
                  </div>
                  <span className="badge" style={{ backgroundColor: `${airData.categoryColor}20`, color: airData.categoryColor }}>
                    {airData.category} Rating
                  </span>
                </div>

                <p className="rec-main-paragraph">
                  {airData.recommendation}
                </p>

                <div className="rec-why-box">
                  <span className="why-title">ML Pipeline Diagnostics:</span>
                  <span className="why-text">
                    ML Classification: {airData.backendML?.airQuality} | Confidence: {airData.backendML?.confidence}% | Regression Score: {airData.backendML?.pollutionScore} | Pattern Index: #{airData.backendML?.pollutionPattern} | PCA PC1: {airData.backendML?.featureExtraction?.PC1}
                  </span>
                </div>
              </div>

              <InsightCard data={airData} />
            </div>

            {/* Monitored Pollutant Matrix */}
            <div className="mb-2">
              <PollutionCard pollutants={airData.pollutants} />
            </div>

            {/* Geospatial Map */}
            <div className="mb-2">
              <PollutionMap selectedLocation={selectedLocation} />
            </div>

            {/* Recent Activities Ledger */}
            {history && history.length > 0 && (
              <div className="glass-card dash-recent-activities-card">
                <h3 className="section-card-title">Recent Monitored Activities</h3>
                <div className="dash-activity-list">
                  {history.slice(0, 5).map((act, i) => (
                    <div key={i} className="dash-activity-item" onClick={() => selectLocation(act.location)}>
                      <MapPin size={16} className="pin-cyan" />
                      <span className="activity-loc">{act.location}</span>
                      <span className="activity-cat" style={{ color: act.categoryColor }}>{act.category} (AQI {act.aqi})</span>
                      <span className="activity-time">{new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
