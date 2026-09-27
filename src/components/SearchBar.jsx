import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Sparkles, ArrowRight } from 'lucide-react';
import './SearchBar.css';

export default function SearchBar({ initialValue = '', onSearch, placeholder = "Enter city, zone, or station (e.g. Coimbatore, Delhi, Bengaluru...)", variant = "hero" }) {
  const [query, setQuery] = useState(initialValue);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  const suggestions = [
    { name: "Coimbatore", badge: "Poor (AQI 156)", color: "#F59E0B" },
    { name: "Delhi", badge: "Very Poor (AQI 284)", color: "#EF4444" },
    { name: "Bengaluru", badge: "Moderate (AQI 68)", color: "#14B8A6" },
    { name: "Shimla", badge: "Good (AQI 28)", color: "#10B981" },
    { name: "Mumbai", badge: "Poor (AQI 132)", color: "#F59E0B" }
  ];

  const handleSubmit = (e) => {
    e?.preventDefault();
    const target = query.trim() || "Coimbatore";
    if (onSearch) {
      onSearch(target);
    } else {
      navigate(`/analyze/${encodeURIComponent(target)}`);
    }
    setShowSuggestions(false);
  };

  const handleSelectSuggestion = (name) => {
    setQuery(name);
    if (onSearch) {
      onSearch(name);
    } else {
      navigate(`/analyze/${encodeURIComponent(name)}`);
    }
    setShowSuggestions(false);
  };

  return (
    <div className={`searchbar-wrapper variant-${variant}`}>
      <form onSubmit={handleSubmit} className="searchbar-form">
        <div className="searchbar-input-container">
          <div className="search-icon-left">
            <MapPin size={20} className="pin-icon" />
          </div>
          <input
            type="text"
            className="searchbar-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            placeholder={placeholder}
            aria-label="Search location"
          />
          {query && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setQuery('')}
            >
              ×
            </button>
          )}
        </div>

        <button type="submit" className="searchbar-submit-btn btn-primary">
          <span>Analyze Air Quality</span>
          <ArrowRight size={18} />
        </button>
      </form>

      {/* Suggested Quick Pick pills */}
      <div className="quick-suggestions-bar">
        <span className="quick-label">
          <Sparkles size={14} /> Popular Queries:
        </span>
        <div className="quick-chips-list">
          {suggestions.map((item) => (
            <button
              key={item.name}
              type="button"
              className="quick-chip"
              onClick={() => handleSelectSuggestion(item.name)}
            >
              <span className="chip-name">{item.name}</span>
              <span className="chip-indicator" style={{ backgroundColor: item.color }}></span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
