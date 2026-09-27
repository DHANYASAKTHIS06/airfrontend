import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Wind, 
  Sparkles, 
  Share2, 
  RefreshCw, 
  ChevronRight, 
  Sliders, 
  Clock, 
  AlertTriangle, 
  BarChart3,
  Calendar,
  Layers,
  ArrowLeft
} from 'lucide-react';
import { AirQualityService } from '../services/airQualityService';
import AQICard from '../components/AQICard';
import RecommendationCard from '../components/RecommendationCard';
import PollutionCard from '../components/PollutionCard';
import LoadingScreen from '../components/LoadingScreen';
import SearchBar from '../components/SearchBar';
import AdvancedAnalysisModal from '../components/AdvancedAnalysisModal';
import './AirQualityAnalysisPage.css';

export default function AirQualityAnalysisPage() {
  const { location: locationParam } = useParams();
  const navigate = useNavigate();

  const currentLocation = locationParam || "Coimbatore";
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [showAdvancedModal, setShowAdvancedModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    AirQualityService.getAirQuality(currentLocation)
      .then((res) => {
        if (isMounted) {
          setData(res);
        }
      })
      .catch((err) => {
        console.error(err);
      });

    return () => {
      isMounted = false;
    };
  }, [currentLocation]);

  const handleSearchNew = (newLoc) => {
    navigate(`/analyze/${encodeURIComponent(newLoc)}`);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <LoadingScreen
        location={currentLocation}
        onComplete={() => setLoading(false)}
      />
    );
  }

  return (
    <div className="analysis-page-root container">
      {/* Top Navigation & Search Bar Header */}
      <div className="analysis-top-bar">
        <button className="btn-back" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <div className="analysis-search-box">
          <SearchBar
            initialValue={data?.name || currentLocation}
            onSearch={handleSearchNew}
            variant="compact"
            placeholder="Search another city..."
          />
        </div>

        <div className="top-action-buttons">
          <button className="btn-secondary btn-icon-only" onClick={handleShare} title="Share link">
            <Share2 size={16} />
            <span>{copied ? "Copied Link!" : "Share"}</span>
          </button>
        </div>
      </div>

      {/* Main Analysis Results Header */}
      <div className="analysis-hero-strip">
        <div className="station-meta">
          <span className="live-pulse-badge">
            <span className="pulse-dot"></span> LIVE SENSOR TELEMETRY
          </span>
          <span className="timestamp-info">
            <Clock size={14} /> Updated {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {/* The Advanced Analysis CTA Trigger */}
        <button
          className="btn-primary btn-advanced-trigger"
          onClick={() => setShowAdvancedModal(true)}
        >
          <Sliders size={18} />
          <span>Open Advanced ML Mining</span>
          <span className="btn-sub-tag">Random Forest • K-Means • Apriori • PCA</span>
        </button>
      </div>

      {/* Primary Abstracted Hierarchy: Location -> Category -> AQI -> Concern -> Recommendation */}
      <div className="analysis-main-grid">
        {/* Left Col: Main AQI & Category Gauge */}
        <div className="grid-col-left">
          <AQICard data={data} />
        </div>

        {/* Right Col: Recommendation & Action Guidance */}
        <div className="grid-col-right">
          <RecommendationCard data={data} />
        </div>
      </div>

      {/* 24-Hour Trend Visualizer */}
      <div className="glass-card trend-section-card">
        <div className="trend-card-header">
          <div className="trend-title-group">
            <BarChart3 size={20} className="trend-icon" />
            <div>
              <h3 className="trend-title">24-Hour Atmospheric Trajectory</h3>
              <p className="trend-subtitle">Diurnal AQI progression and particulate accumulation pattern</p>
            </div>
          </div>
          <span className="badge badge-cyan">Station Feed</span>
        </div>

        {/* Responsive CSS Bar Chart */}
        <div className="trend-chart-container">
          {data?.historicalTrend?.map((pt, idx) => {
            const heightPct = Math.min(Math.max((pt.aqi / 350) * 100, 15), 100);
            const isNow = pt.time === "Now";
            return (
              <div key={idx} className={`trend-bar-col ${isNow ? 'current-time' : ''}`}>
                <span className="bar-aqi-num">{pt.aqi}</span>
                <div className="trend-bar-track">
                  <div
                    className="trend-bar-fill"
                    style={{
                      height: `${heightPct}%`,
                      backgroundColor:
                        pt.aqi > 200 ? '#EF4444' :
                        pt.aqi > 100 ? '#F59E0B' :
                        pt.aqi > 50 ? '#14B8A6' : '#10B981'
                    }}
                  ></div>
                </div>
                <span className="bar-time-label">{pt.time}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Monitored Pollutant Detailed Grid */}
      <div className="pollutants-section-wrapper">
        <PollutionCard pollutants={data?.pollutants} />
      </div>

      {/* Bottom Technical Banner Prompt */}
      <div className="bottom-ml-cta-glass">
        <div className="bottom-cta-left">
          <Sparkles size={24} className="sparkle-cyan" />
          <div>
            <h4 className="cta-h4">Want to inspect model feature weights and association rules?</h4>
            <p className="cta-p">
              Access the Random Forest multi-tree vote distribution, K-Means centroid vectors, Apriori temporal rules, and PCA projections.
            </p>
          </div>
        </div>
        <button
          className="btn-primary"
          onClick={() => setShowAdvancedModal(true)}
        >
          <span>View Model Insights</span>
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Advanced Analysis Modal */}
      <AdvancedAnalysisModal
        isOpen={showAdvancedModal}
        onClose={() => setShowAdvancedModal(false)}
        data={data}
      />
    </div>
  );
}
