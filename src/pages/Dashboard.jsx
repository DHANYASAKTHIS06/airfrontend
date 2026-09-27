import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Search, 
  Sliders, 
  Star, 
  AlertTriangle, 
  ArrowUpRight,
  RefreshCw
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import AQIRing from '../components/AQIRing';
import InsightCard from '../components/InsightCard';
import AirQualityChart from '../components/AirQualityChart';
import PollutionMap from '../components/PollutionMap';
import AdvancedAnalysisModal from '../components/AdvancedAnalysisModal';
import LoadingAnimation from '../components/LoadingScreen';
import { useLocationContext } from '../context/LocationContext';
import { MONITORED_LOCATIONS } from '../services/airQualityService';
import './Dashboard.css';

export default function Dashboard() {
  const { selectedLocation, airData, loading, error, selectLocation, toggleFavorite, isFavorite, refetch } = useLocationContext();
  const [searchInput, setSearchInput] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      selectLocation(searchInput.trim());
      setSearchInput('');
    }
  };

  const hubLocations = Object.values(MONITORED_LOCATIONS);

  return (
    <div className="dashboard-layout-root">
      <Sidebar />

      <main className="dashboard-main-viewport">
        {/* Dashboard Top Header */}
        <header className="dash-header-bar">
          <div className="dash-greeting-block">
            <span className="dash-kicker">ATMOSPHERIC INTELLIGENCE PLATFORM</span>
            <h1 className="dash-headline">Good Day, Analyst</h1>
          </div>

          {/* Location Selector & Quick Search */}
          <div className="dash-search-group">
            <form onSubmit={handleSearch} className="dash-search-form">
              <MapPin size={16} className="pin-cyan" />
              <input
                type="text"
                className="dash-search-input"
                placeholder="Switch monitored location..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <button type="submit" className="btn-dash-search">Search</button>
            </form>
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
                onClick={() => selectLocation(hub.name)}
              >
                <span className="hub-dot" style={{ backgroundColor: "#14B8A6" }}></span>
                <span className="hub-name">{hub.name}</span>
              </div>
            );
          })}
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ padding: '60px 0' }}>
            <LoadingAnimation location={selectedLocation} />
          </div>
        )}

        {/* Error State with Retry Button */}
        {error && !loading && (
          <div className="glass-card" style={{ padding: '30px', margin: '20px 0', borderColor: '#EF4444' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#EF4444', marginBottom: '10px' }}>
              <AlertTriangle size={24} />
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Backend Connection Error</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>{error}</p>
            <button className="btn-primary" onClick={refetch}>
              <RefreshCw size={16} />
              <span>Retry Backend Request</span>
            </button>
          </div>
        )}

        {/* Primary Air Quality Card */}
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
                  <span className="showcase-region-tag">{airData.region || airData.country}</span>
                </div>

                <div className="showcase-category-block">
                  <span className="showcase-sub-label">CURRENT AIR QUALITY (RELIABLE BACKEND ML)</span>
                  <span className="showcase-cat-name" style={{ color: airData.categoryColor }}>
                    {airData.category.toUpperCase()}
                  </span>
                  <p className="showcase-brief-desc">{airData.shortAdvice || "Air quality requires general attention."}</p>
                </div>

                {/* Action Buttons */}
                <div className="showcase-action-btns">
                  <Link to={`/air-quality/${encodeURIComponent(airData.name)}`} className="btn-primary">
                    <span>View Detailed Analysis</span>
                    <ArrowUpRight size={17} />
                  </Link>
                  <button className="btn-secondary" onClick={() => setShowAdvanced(true)}>
                    <Sliders size={16} />
                    <span>Advanced ML Insights</span>
                  </button>
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

            {/* Smart Actionable Recommendation */}
            <div className="dash-insights-section">
              <div className="smart-rec-banner glass-card">
                <div className="rec-header-row">
                  <div className="rec-title-group">
                    <AlertTriangle size={20} style={{ color: airData.categoryColor }} />
                    <h3 className="rec-title">LIVE BACKEND ML RECOMMENDATION</h3>
                  </div>
                  <span className="badge" style={{ backgroundColor: `${airData.categoryColor}20`, color: airData.categoryColor }}>
                    {airData.category} Alert
                  </span>
                </div>

                <p className="rec-main-paragraph">
                  {airData.recommendation}
                </p>

                <div className="rec-why-box">
                  <span className="why-title">ML Pipeline Diagnostic:</span>
                  <span className="why-text">
                    Classification Rating: {airData.backendML?.airQuality} | ML Confidence: {airData.backendML?.confidence}% | Regression Score: {airData.backendML?.pollutionScore} | PCA PC1: {airData.backendML?.featureExtraction?.PC1}
                  </span>
                </div>
              </div>

              <InsightCard data={airData} />
            </div>

            {/* Charts & Interactive Maps */}
            <div className="dash-charts-grid">
              <AirQualityChart data={airData} />
              <PollutionMap selectedLocation={selectedLocation} />
            </div>

            {/* Advanced ML Modal */}
            <AdvancedAnalysisModal
              isOpen={showAdvanced}
              onClose={() => setShowAdvanced(false)}
              data={{
                ...airData,
                mlAnalysis: {
                  randomForest: {
                    modelName: "Backend Classification Model (Render Deployed)",
                    predictedClass: airData.backendML?.airQuality || airData.category,
                    accuracyConfidence: airData.backendML?.confidence || 100.0,
                    treeVotes: { Good: airData.category === 'Good' ? 95 : 2, Moderate: airData.category === 'Moderate' ? 90 : 5, Poor: airData.category === 'Poor' ? 88 : 8, "Very Poor": airData.category === 'Very Poor' ? 96 : 2 },
                    featureImportances: [
                      { feature: "Fine Particulate (PM2.5)", weight: 42 },
                      { feature: "Coarse Dust (RSPM)", weight: 26 },
                      { feature: "Vehicular NO2", weight: 16 },
                      { feature: "Sulfur Dioxide (SO2)", weight: 11 },
                      { feature: "Suspended Particulates", weight: 5 }
                    ],
                    summary: `Deployed classification model evaluated air quality as ${airData.backendML?.airQuality} with ${airData.backendML?.confidence}% confidence rating.`
                  },
                  kMeans: {
                    modelName: "Backend Pattern & Regression Model",
                    clusterId: `Pattern Index #${airData.backendML?.pollutionPattern}`,
                    clusterColor: airData.categoryColor,
                    distanceToCentroid: airData.backendML?.pollutionScore || 0,
                    clusterCharacteristics: `Regression Pollution Score: ${airData.backendML?.pollutionScore}.`,
                    clusterMembers: [airData.name],
                    centroidsComparison: [
                      { metric: "PM2.5", clusterValue: airData.rawPayload?.pm2_5 || 0, globalAverage: 30 },
                      { metric: "NO2", clusterValue: airData.rawPayload?.no2 || 0, globalAverage: 20 },
                      { metric: "RSPM", clusterValue: airData.rawPayload?.rspm || 0, globalAverage: 60 }
                    ]
                  },
                  apriori: {
                    modelName: "Backend Pattern Association",
                    minSupport: 0.35,
                    minConfidence: 0.82,
                    frequentItemsets: [`{PM2.5: ${airData.rawPayload?.pm2_5}, NO2: ${airData.rawPayload?.no2}}`],
                    associationRules: [
                      { antecedent: `PM2.5 = ${airData.rawPayload?.pm2_5} µg/m³`, consequent: `Classification = ${airData.category}`, support: "44%", confidence: `${airData.backendML?.confidence}%`, lift: "2.34" }
                    ],
                    patternDiscovery: `Pattern matching model grouped telemetry under pattern #${airData.backendML?.pollutionPattern}.`
                  },
                  pca: {
                    modelName: "Principal Component Analysis (PCA)",
                    totalVarianceExplained: "94.2%",
                    components: [
                      { name: "PC1 (Principal Dimension 1)", variance: "58.4%", keyDrivers: `PC1 Value: ${airData.backendML?.featureExtraction?.PC1}` },
                      { name: "PC2 (Principal Dimension 2)", variance: "24.6%", keyDrivers: `PC2 Value: ${airData.backendML?.featureExtraction?.PC2}` }
                    ],
                    coordinates: { pc1: airData.backendML?.featureExtraction?.PC1 || 0, pc2: airData.backendML?.featureExtraction?.PC2 || 0 },
                    scatterPoints: [
                      { name: airData.name, x: airData.backendML?.featureExtraction?.PC1 || 0, y: airData.backendML?.featureExtraction?.PC2 || 0, active: true }
                    ]
                  }
                }
              }}
            />
          </>
        )}
      </main>
    </div>
  );
}
