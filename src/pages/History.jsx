import React, { useState } from 'react';
import { History as HistoryIcon, Trash2, Search, Filter } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import HistoryTimeline from '../components/HistoryTimeline';
import { useLocationContext } from '../context/LocationContext';
import './History.css';

export default function History() {
  const { history, clearHistory } = useLocationContext();
  const [filterQuery, setFilterQuery] = useState('');
  const [catFilter, setCatFilter] = useState('ALL');

  const filtered = history.filter(item => {
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
            <span className="page-kicker">AUDITED QUERY TIMELINE</span>
            <h1 className="page-headline">Telemetry Search History</h1>
            <p className="page-subtext">
              Chronological ledger of analyzed urban stations and classified risk profiles.
            </p>
          </div>

          {history.length > 0 && (
            <button className="btn-secondary btn-clear-hist" onClick={clearHistory}>
              <Trash2 size={16} />
              <span>Clear History</span>
            </button>
          )}
        </header>

        {/* Filter Controls */}
        <div className="hist-filter-controls-glass glass-card">
          <div className="hist-search-input-wrap">
            <Search size={16} className="search-flt-icon" />
            <input
              type="text"
              className="hist-search-input"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search by location name or concern..."
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

        {/* Timeline View */}
        {filtered.length === 0 ? (
          <div className="empty-history-glass glass-card">
            <HistoryIcon size={44} className="empty-hist-icn" />
            <h3>No Atmospheric Queries Recorded</h3>
            <p>Your search and classification timeline will appear here.</p>
          </div>
        ) : (
          <HistoryTimeline items={filtered} />
        )}
      </main>
    </div>
  );
}
