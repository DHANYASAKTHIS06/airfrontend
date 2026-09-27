import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ArrowRight, AlertTriangle } from 'lucide-react';
import { findSupportedLocation } from '../data/supportedLocations';
import './SearchBar.css';

export default function SearchBar({ initialValue = '', onSearch, placeholder = "Enter supported station (e.g. Coimbatore, Delhi, Bengaluru...)", variant = "hero" }) {
  const [query, setQuery] = useState(initialValue);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const suggestions = [
    { name: "Coimbatore" },
    { name: "Delhi" },
    { name: "Bengaluru" },
    { name: "Shimla" },
    { name: "Mumbai" },
    { name: "Chennai" }
  ];

  const handleSubmit = (e) => {
    e?.preventDefault();
    const target = query.trim();
    if (!target) {
      setError('Please enter a location name.');
      return;
    }

    const match = findSupportedLocation(target);
    if (!match) {
      setError('Location Not Found.');
      return;
    }

    setError('');
    if (onSearch) {
      onSearch(match.name);
    } else {
      navigate(`/air-quality/${encodeURIComponent(match.name)}`);
    }
  };

  const handleSelectSuggestion = (name) => {
    setQuery(name);
    setError('');
    if (onSearch) {
      onSearch(name);
    } else {
      navigate(`/air-quality/${encodeURIComponent(name)}`);
    }
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
            onChange={(e) => {
              setQuery(e.target.value);
              if (error) setError('');
            }}
            placeholder={placeholder}
            aria-label="Search location"
          />
          {query && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => {
                setQuery('');
                setError('');
              }}
            >
              ×
            </button>
          )}
        </div>

        <button type="submit" className="searchbar-submit-btn btn-primary">
          <span>Analyze Station</span>
          <ArrowRight size={18} />
        </button>
      </form>

      {error && (
        <div className="searchbar-error-notice">
          <AlertTriangle size={15} />
          <span>{error}</span>
        </div>
      )}

      {/* Suggested Quick Pick pills */}
      <div className="quick-suggestions-bar">
        <span className="quick-label">
          Supported Stations:
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
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
