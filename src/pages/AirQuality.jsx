import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Share2, 
  ArrowLeft,
  AlertTriangle,
  RefreshCw,
  GitCompare,
  FileText
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import AQIRing from '../components/AQIRing';
import InsightCard from '../components/InsightCard';
import PollutionCard from '../components/PollutionCard';
import RecommendationCard from '../components/RecommendationCard';
import LoadingAnimation from '../components/LoadingScreen';
import { useLocationContext } from '../context/LocationContext';
import { airQualityService } from '../services/airQualityService';
import { findSupportedLocation } from '../data/supportedLocations';
import './AirQuality.css';

export default function AirQuality() {
  const { location: urlLocation } = useParams();
  const { selectedLocation, selectLocation } = useLocationContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const activeLocName = urlLocation || selectedLocation || 'Coimbatore';

  const loadData = () => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const match = findSupportedLocation(activeLocName);
    if (!match) {
      setError('Location Not Found.');
      setLoading(false);
      return;
    }

    airQualityService.getAirQuality(match.name)
      .then((res) => {
        if (isMounted) {
          setData(res);
          selectLocation(res.name);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (isMounted) {
          setError(e.isNotFound ? 'Location Not Found.' : 'Unable to fetch data');
          setLoading(false);
        }
      });

    return () => { isMounted = false; };
  };

  useEffect(() => {
    loadData();
  }, [activeLocName]);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return <LoadingAnimation location={activeLocName} onComplete={() => setLoading(false)} />;
  }

  return (
    <div className="dashboard-layout-root">
      <Sidebar />

      <main className="dashboard-main-viewport">
        {/* Top Action Bar */}
        <div className="aq-top-nav-bar">
          <button className="btn-secondary" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={16} />
            <span>Dashboard</span>
          </button>

          <div className="aq-top-actions">
            <button className="btn-secondary" onClick={() => navigate(`/compare?cityA=${encodeURIComponent(activeLocName)}`)}>
              <GitCompare size={16} />
              <span>Compare Station</span>
            </button>
            <button className="btn-secondary" onClick={handleShare}>
              <Share2 size={16} />
              <span>{copied ? "Link Copied!" : "Share Analysis"}</span>
            </button>
          </div>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="glass-card" style={{ padding: '30px', margin: '20px 0', borderColor: '#EF4444' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#EF4444', marginBottom: '10px' }}>
              <AlertTriangle size={24} />
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>
                {error === 'Location Not Found.' ? 'Location Not Found.' : 'Unable to fetch data'}
              </h3>
            </div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
              {error === 'Location Not Found.'
                ? `"${activeLocName}" is not a supported station in the monitoring dataset.`
                : 'Unable to communicate with the deployed Render ML model.'}
            </p>
            <button className="btn-primary" onClick={loadData}>
              <RefreshCw size={16} />
              <span>Retry Request</span>
            </button>
          </div>
        )}

        {/* Primary Data Display */}
        {data && !error && (
          <>
            <div className="aq-hero-banner glass-card">
              <div className="aq-hero-left">
                <div className="aq-loc-badge">
                  <MapPin size={18} className="pin-cyan" />
                  <span className="aq-loc-text">{data.name.toUpperCase()}</span>
                  <span className="aq-country-tag">{data.region}, {data.country}</span>
                </div>

                <div className="aq-status-headline">
                  <span className="aq-status-label">BACKEND ML CLASSIFICATION</span>
                  <h1 className="aq-status-val" style={{ color: data.categoryColor }}>
                    {data.category.toUpperCase()}
                  </h1>
                </div>

                <div className="aq-concern-row">
                  <span className="concern-lbl">ML Diagnostics:</span>
                  <strong className="concern-val">
                    Confidence: {data.backendML?.confidence}% | Pattern: #{data.backendML?.pollutionPattern} | Score: {data.backendML?.pollutionScore}
                  </strong>
                </div>

                <div className="aq-rec-box">
                  <span className="rec-badge-title">RECOMMENDATION</span>
                  <p className="rec-text-body">{data.recommendation}</p>
                </div>
              </div>

              <div className="aq-hero-right">
                <AQIRing
                  aqi={data.aqi}
                  category={data.category}
                  color={data.categoryColor}
                  size={190}
                />
              </div>
            </div>

            {/* Key Factor Insights */}
            <div className="mb-2">
              <InsightCard data={data} />
            </div>

            {/* Pollutant Matrix */}
            <div className="mb-2">
              <PollutionCard pollutants={data.pollutants} />
            </div>

            {/* Recommendation Card */}
            <div className="mb-2">
              <RecommendationCard data={data} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
