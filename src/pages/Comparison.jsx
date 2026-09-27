import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  GitCompare, 
  MapPin, 
  Search, 
  Filter, 
  Activity, 
  AlertTriangle, 
  ShieldCheck, 
  RefreshCw,
  Layers,
  ArrowRight,
  Sliders
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import LoadingAnimation from '../components/LoadingScreen';
import { airQualityService } from '../services/airQualityService';
import { SUPPORTED_LOCATIONS, findSupportedLocation } from '../data/supportedLocations';
import './Comparison.css';

export default function Comparison() {
  const [searchParams] = useSearchParams();
  const initialCityA = searchParams.get('cityA') || 'Coimbatore';
  const initialCityB = searchParams.get('cityB') || 'Chennai';

  const [locA, setLocA] = useState(initialCityA);
  const [locB, setLocB] = useState(initialCityB);
  const [dataA, setDataA] = useState(null);
  const [dataB, setDataB] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorA, setErrorA] = useState(null);
  const [errorB, setErrorB] = useState(null);

  // Filter state for supported locations directory
  const [filterQuery, setFilterQuery] = useState('');
  const [stateFilter, setStateFilter] = useState('ALL');

  const executeComparison = async (cityA, cityB) => {
    setLoading(true);
    setErrorA(null);
    setErrorB(null);

    const matchA = findSupportedLocation(cityA);
    const matchB = findSupportedLocation(cityB);

    if (!matchA) {
      setErrorA('Location Not Found.');
    }
    if (!matchB) {
      setErrorB('Location Not Found.');
    }

    if (!matchA || !matchB) {
      setLoading(false);
      return;
    }

    try {
      const [resA, resB] = await Promise.all([
        airQualityService.getAirQuality(matchA.name),
        airQualityService.getAirQuality(matchB.name)
      ]);
      setDataA(resA);
      setDataB(resB);
    } catch (err) {
      if (!dataA) setErrorA('Unable to fetch data');
      if (!dataB) setErrorB('Unable to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    executeComparison(locA, locB);
  }, []);

  const handleCompareSubmit = (e) => {
    e?.preventDefault();
    executeComparison(locA, locB);
  };

  const allSupported = Object.values(SUPPORTED_LOCATIONS);
  const availableStates = ['ALL', ...Array.from(new Set(allSupported.map(s => s.state)))];

  const filteredDirectory = allSupported.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
                          item.state.toLowerCase().includes(filterQuery.toLowerCase());
    const matchesState = stateFilter === 'ALL' || item.state === stateFilter;
    return matchesSearch && matchesState;
  });

  return (
    <div className="dashboard-layout-root">
      <Sidebar />

      <main className="dashboard-main-viewport">
        {/* Page Header */}
        <header className="page-header-block">
          <span className="page-kicker">MODULE 6: SEARCH & COMPARISON</span>
          <h1 className="page-headline">Search & Multi-Zone Comparison</h1>
          <p className="page-subtext">
            Search supported stations, filter by state, and perform side-by-side comparative diagnostics evaluated by the Render ML backend.
          </p>
        </header>

        {/* Location Selectors Form */}
        <form onSubmit={handleCompareSubmit} className="compare-inputs-card glass-card">
          <div className="compare-select-col">
            <label className="comp-label">LOCATION A</label>
            <div className="input-loc-row">
              <MapPin size={16} className="pin-cyan" />
              <input
                type="text"
                className="comp-text-input"
                value={locA}
                onChange={(e) => setLocA(e.target.value)}
                placeholder="Enter Station A (e.g. Coimbatore)..."
              />
            </div>
            {errorA && <span className="comp-error-tag">{errorA}</span>}
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
                placeholder="Enter Station B (e.g. Chennai)..."
              />
            </div>
            {errorB && <span className="comp-error-tag">{errorB}</span>}
          </div>

          <button type="submit" className="btn-primary btn-compare-submit" disabled={loading}>
            {loading ? "Analyzing..." : "Compare Stations"}
          </button>
        </form>

        {loading && (
          <div style={{ padding: '60px 0' }}>
            <LoadingAnimation location={`${locA} vs ${locB}`} />
          </div>
        )}

        {/* Side-by-Side Comparison Results */}
        {!loading && dataA && dataB && (
          <div className="compare-results-grid">
            {/* Station A Card */}
            <div className="compare-card glass-card">
              <div className="comp-card-top">
                <div>
                  <span className="comp-badge-region">{dataA.region}, {dataA.country}</span>
                  <h2 className="comp-station-title">{dataA.name.toUpperCase()}</h2>
                </div>
                <div className="comp-cat-pill" style={{ color: dataA.categoryColor, backgroundColor: `${dataA.categoryColor}20` }}>
                  {dataA.category}
                </div>
              </div>

              <div className="comp-aqi-highlight">
                <span className="comp-aqi-lbl">AQI Index</span>
                <span className="comp-aqi-num" style={{ color: dataA.categoryColor }}>{dataA.aqi}</span>
              </div>

              <div className="comp-metrics-table">
                <div className="comp-metric-row">
                  <span>Fine Particulate (PM2.5)</span>
                  <strong>{dataA.rawPayload.pm2_5} µg/m³</strong>
                </div>
                <div className="comp-metric-row">
                  <span>Coarse Dust (RSPM)</span>
                  <strong>{dataA.rawPayload.rspm} µg/m³</strong>
                </div>
                <div className="comp-metric-row">
                  <span>Nitrogen Dioxide (NO2)</span>
                  <strong>{dataA.rawPayload.no2} ppb</strong>
                </div>
                <div className="comp-metric-row">
                  <span>Sulfur Dioxide (SO2)</span>
                  <strong>{dataA.rawPayload.so2} ppb</strong>
                </div>
                <div className="comp-metric-row">
                  <span>ML Confidence</span>
                  <strong>{dataA.backendML?.confidence}%</strong>
                </div>
                <div className="comp-metric-row">
                  <span>Pattern Mining Index</span>
                  <strong>#{dataA.backendML?.pollutionPattern}</strong>
                </div>
              </div>

              <p className="comp-rec-text">{dataA.recommendation}</p>
            </div>

            {/* Station B Card */}
            <div className="compare-card glass-card">
              <div className="comp-card-top">
                <div>
                  <span className="comp-badge-region">{dataB.region}, {dataB.country}</span>
                  <h2 className="comp-station-title">{dataB.name.toUpperCase()}</h2>
                </div>
                <div className="comp-cat-pill" style={{ color: dataB.categoryColor, backgroundColor: `${dataB.categoryColor}20` }}>
                  {dataB.category}
                </div>
              </div>

              <div className="comp-aqi-highlight">
                <span className="comp-aqi-lbl">AQI Index</span>
                <span className="comp-aqi-num" style={{ color: dataB.categoryColor }}>{dataB.aqi}</span>
              </div>

              <div className="comp-metrics-table">
                <div className="comp-metric-row">
                  <span>Fine Particulate (PM2.5)</span>
                  <strong>{dataB.rawPayload.pm2_5} µg/m³</strong>
                </div>
                <div className="comp-metric-row">
                  <span>Coarse Dust (RSPM)</span>
                  <strong>{dataB.rawPayload.rspm} µg/m³</strong>
                </div>
                <div className="comp-metric-row">
                  <span>Nitrogen Dioxide (NO2)</span>
                  <strong>{dataB.rawPayload.no2} ppb</strong>
                </div>
                <div className="comp-metric-row">
                  <span>Sulfur Dioxide (SO2)</span>
                  <strong>{dataB.rawPayload.so2} ppb</strong>
                </div>
                <div className="comp-metric-row">
                  <span>ML Confidence</span>
                  <strong>{dataB.backendML?.confidence}%</strong>
                </div>
                <div className="comp-metric-row">
                  <span>Pattern Mining Index</span>
                  <strong>#{dataB.backendML?.pollutionPattern}</strong>
                </div>
              </div>

              <p className="comp-rec-text">{dataB.recommendation}</p>
            </div>
          </div>
        )}

        {/* Search & Filter Directory of Supported Stations */}
        <div className="glass-card mt-2 p-4">
          <div className="dir-header-flex">
            <div>
              <h3 className="section-card-title">Supported Monitoring Station Directory</h3>
              <p className="section-card-subtitle">Filter by station name or state to search valid network locations</p>
            </div>
          </div>

          <div className="dir-filters-row">
            <div className="hist-search-input-wrap flex-1">
              <Search size={16} className="search-flt-icon" />
              <input
                type="text"
                className="hist-search-input"
                placeholder="Search station by name or state..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
              />
            </div>

            <div className="state-filter-select-wrap">
              <Filter size={16} className="pin-cyan" />
              <select
                className="form-input"
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
              >
                {availableStates.map(st => (
                  <option key={st} value={st}>{st === 'ALL' ? 'All States' : st}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="supported-stations-grid">
            {filteredDirectory.map((st) => (
              <div
                key={st.name}
                className="station-quick-card"
                onClick={() => {
                  setLocA(st.name);
                  executeComparison(st.name, locB);
                }}
              >
                <div className="st-quick-top">
                  <strong>{st.name}</strong>
                  <span className="st-state-badge">{st.state}</span>
                </div>
                <div className="st-quick-nums">
                  <span>PM2.5: {st.pm2_5}</span>
                  <span>NO2: {st.no2}</span>
                  <span>RSPM: {st.rspm}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
