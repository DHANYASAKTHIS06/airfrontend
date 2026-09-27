import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { History as HistoryIcon, Star, Trash2, Search, Filter, MapPin, ArrowRight } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useLocationContext } from '../context/LocationContext';
import './History.css';

export default function History() {
  const { history, clearHistory, favorites, toggleFavorite, selectLocation } = useLocationContext();
  const [activeTab, setActiveTab] = useState('HISTORY'); // 'HISTORY' or 'FAVORITES'
  const [filterQuery, setFilterQuery] = useState('');
  const [catFilter, setCatFilter] = useState('ALL');
  const navigate = useNavigate();

  const handleOpenLocation = (city) => {
    selectLocation(city);
    navigate(`/air-quality/${encodeURIComponent(city)}`);
  };

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.location.toLowerCase().includes(filterQuery.toLowerCase()) ||
                          (item.mainConcern && item.mainConcern.toLowerCase().includes(filterQuery.toLowerCase()));
    const matchesCat = catFilter === 'ALL' || item.category.toUpperCase() === catFilter.toUpperCase();
    return matchesSearch && matchesCat;
  });

  return (
    <div className="dashboard-layout-root">
      <Sidebar />

      <main className="dashboard-main-viewport">
        {/* Page Header */}
        <header className="page-header-block hist-top-flex">
          <div>
            <span className="page-kicker">MODULE 8: HISTORY & FAVORITES</span>
            <h1 className="page-headline">Search History & Saved Stations</h1>
            <p className="page-subtext">
              Track previous analytical queries, audit logs, and quick-access pinned stations.
            </p>
          </div>

          {activeTab === 'HISTORY' && history.length > 0 && (
            <button className="btn-secondary btn-clear-hist" onClick={clearHistory}>
              <Trash2 size={16} />
              <span>Clear History</span>
            </button>
          )}
        </header>

        {/* Tab Selector */}
        <div className="hist-tab-bar">
          <button
            className={`hist-tab-btn ${activeTab === 'HISTORY' ? 'active' : ''}`}
            onClick={() => setActiveTab('HISTORY')}
          >
            <HistoryIcon size={16} />
            <span>Search History ({history.length})</span>
          </button>
          <button
            className={`hist-tab-btn ${activeTab === 'FAVORITES' ? 'active' : ''}`}
            onClick={() => setActiveTab('FAVORITES')}
          >
            <Star size={16} />
            <span>Saved Favorites ({favorites.length})</span>
          </button>
        </div>

        {activeTab === 'HISTORY' ? (
          <>
            {/* Filter Controls */}
            <div className="hist-filter-controls-glass glass-card">
              <div className="hist-search-input-wrap">
                <Search size={16} className="search-flt-icon" />
                <input
                  type="text"
                  className="hist-search-input"
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  placeholder="Search history by location or category..."
                />
              </div>

              <div className="hist-category-chips">
                <span className="flt-label"><Filter size={14} /> Category:</span>
                {['ALL', 'Good', 'Moderate', 'Poor', 'Very Poor'].map(cat => (
                  <button
                    key={cat}
                    className={`flt-chip-btn ${catFilter === cat ? 'active' : ''}`}
                    onClick={() => setCatFilter(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Timeline / Card View */}
            {filteredHistory.length === 0 ? (
              <div className="empty-history-glass glass-card">
                <HistoryIcon size={44} className="empty-hist-icn" />
                <h3>No Query Logs Recorded</h3>
                <p>Telemetry searches will automatically appear in this historical ledger.</p>
              </div>
            ) : (
              <div className="history-ledger-stack">
                {filteredHistory.map((item) => (
                  <div key={item.id} className="history-ledger-item glass-card" onClick={() => handleOpenLocation(item.location)}>
                    <div className="hl-left">
                      <MapPin size={18} className="pin-cyan" />
                      <div>
                        <h3 className="hl-station-title">{item.location}</h3>
                        <span className="hl-country-tag">{item.country}</span>
                      </div>
                    </div>

                    <div className="hl-middle">
                      <span className="hl-cat-pill" style={{ color: item.categoryColor, backgroundColor: `${item.categoryColor}15` }}>
                        {item.category}
                      </span>
                      <span className="hl-aqi-txt" style={{ color: item.categoryColor }}>AQI {item.aqi}</span>
                    </div>

                    <div className="hl-right">
                      <span className="hl-date-time">
                        {new Date(item.timestamp).toLocaleString()}
                      </span>
                      <button className="btn-secondary btn-sm" onClick={(e) => { e.stopPropagation(); handleOpenLocation(item.location); }}>
                        <span>Re-Analyze</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          /* Favorites Tab */
          <div className="favorites-cards-grid">
            {favorites.length === 0 ? (
              <div className="empty-history-glass glass-card">
                <Star size={44} className="empty-hist-icn" />
                <h3>No Stations Pinned</h3>
                <p>Star any monitored station to pin it to your favorites list.</p>
              </div>
            ) : (
              favorites.map((cityName) => (
                <div key={cityName} className="fav-card glass-card">
                  <div className="fav-card-top">
                    <div className="fav-loc-tag">
                      <MapPin size={18} className="pin-cyan" />
                      <h3 className="fav-city-name">{cityName}</h3>
                    </div>
                    <button
                      className="btn-fav-remove"
                      onClick={() => toggleFavorite(cityName)}
                      title="Remove from favorites"
                    >
                      <Star size={18} className="star-filled" />
                    </button>
                  </div>

                  <p className="fav-desc-line">Monitored National Monitoring Station</p>

                  <button className="btn-primary w-full mt-2" onClick={() => handleOpenLocation(cityName)}>
                    <span>Launch Analysis</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
