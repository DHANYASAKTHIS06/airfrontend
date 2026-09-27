import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  History, 
  MapPin, 
  Trash2, 
  Search, 
  ExternalLink, 
  Clock, 
  Calendar, 
  Sparkles,
  ArrowRight,
  Filter
} from 'lucide-react';
import { AirQualityService } from '../services/airQualityService';
import './HistoryPage.css';

export default function HistoryPage() {
  const [historyItems, setHistoryItems] = useState([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const navigate = useNavigate();

  useEffect(() => {
    setHistoryItems(AirQualityService.getHistory());
  }, []);

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear your local search history logs?")) {
      AirQualityService.clearHistory();
      setHistoryItems([]);
    }
  };

  const filteredItems = historyItems.filter((item) => {
    const matchesSearch = item.location.toLowerCase().includes(searchFilter.toLowerCase()) ||
                          (item.mainConcern && item.mainConcern.toLowerCase().includes(searchFilter.toLowerCase()));
    const matchesCategory = categoryFilter === 'ALL' || item.category.toUpperCase() === categoryFilter.toUpperCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="history-page-root container">
      {/* Header section */}
      <div className="history-header">
        <div className="history-header-title-group">
          <div className="history-icon-circle">
            <History size={22} className="history-icon-glow" />
          </div>
          <div>
            <h1 className="history-title">Atmospheric Query History</h1>
            <p className="history-subtitle">
              Comprehensive log of past location lookups and classified pollution profiles
            </p>
          </div>
        </div>

        {historyItems.length > 0 && (
          <button className="btn-secondary btn-clear-history" onClick={handleClearHistory}>
            <Trash2 size={16} />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="history-controls-bar glass-panel">
        <div className="search-filter-input-wrap">
          <Search size={16} className="search-flt-icon" />
          <input
            type="text"
            className="search-flt-input"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Filter by city name or pollution concern..."
          />
        </div>

        <div className="category-filter-chips">
          <span className="flt-lbl"><Filter size={14} /> Category:</span>
          {['ALL', 'Good', 'Moderate', 'Poor', 'Very Poor'].map((cat) => (
            <button
              key={cat}
              className={`flt-chip ${categoryFilter === cat ? 'active' : ''}`}
              onClick={() => setCategoryFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* History Grid / List */}
      {filteredItems.length === 0 ? (
        <div className="empty-history-box glass-card">
          <History size={48} className="empty-icn" />
          <h3 className="empty-title">No Search Records Found</h3>
          <p className="empty-desc">
            {historyItems.length === 0
              ? "You haven't queried any city atmospheric profiles yet."
              : "No records matching your active filters."}
          </p>
          <button
            className="btn-primary"
            onClick={() => navigate('/analyze/Coimbatore')}
          >
            <span>Analyze Coimbatore Now</span>
            <ArrowRight size={18} />
          </button>
        </div>
      ) : (
        <div className="history-grid">
          {filteredItems.map((item) => {
            const dateObj = new Date(item.timestamp);
            const dateStr = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
            const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            return (
              <div key={item.id || item.timestamp} className="history-item-card glass-card">
                <div className="item-top-row">
                  <div className="item-loc-group">
                    <MapPin size={18} className="item-pin" />
                    <h3 className="item-city-name">{item.location}</h3>
                  </div>
                  <span
                    className="item-cat-tag"
                    style={{
                      backgroundColor: `${item.categoryColor || '#22D3EE'}20`,
                      color: item.categoryColor || '#22D3EE',
                      borderColor: `${item.categoryColor || '#22D3EE'}40`
                    }}
                  >
                    {item.category}
                  </span>
                </div>

                <div className="item-aqi-showcase">
                  <div className="item-aqi-block">
                    <span className="item-aqi-label">AQI Index</span>
                    <span className="item-aqi-number" style={{ color: item.categoryColor || '#22D3EE' }}>
                      {item.aqi}
                    </span>
                  </div>
                  <div className="item-concern-block">
                    <span className="item-concern-label">Main Concern</span>
                    <span className="item-concern-text">{item.mainConcern || "Particulate Pollution"}</span>
                  </div>
                </div>

                <div className="item-footer">
                  <div className="item-timestamp">
                    <Clock size={13} />
                    <span>{dateStr} at {timeStr}</span>
                  </div>
                  <Link
                    to={`/analyze/${encodeURIComponent(item.location)}`}
                    className="item-reanalyze-btn"
                  >
                    <span>Inspect</span>
                    <ExternalLink size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
