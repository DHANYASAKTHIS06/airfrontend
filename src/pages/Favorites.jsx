import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, MapPin, ExternalLink, Trash2, ArrowRight } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useLocationContext } from '../context/LocationContext';
import { MONITORED_LOCATIONS } from '../services/airQualityService';
import './Favorites.css';

export default function Favorites() {
  const { favorites, toggleFavorite, selectLocation } = useLocationContext();
  const navigate = useNavigate();

  const handleOpen = (city) => {
    selectLocation(city);
    navigate(`/air-quality/${encodeURIComponent(city)}`);
  };

  return (
    <div className="dashboard-layout-root">
      <Sidebar />

      <main className="dashboard-main-viewport">
        {/* Page Header */}
        <header className="page-header-block">
          <span className="page-kicker">MONITORED REGIONAL ZONES</span>
          <h1 className="page-headline">Favorite Stations</h1>
          <p className="page-subtext">
            Quick-access telemetry pins for high-priority urban and environmental zones.
          </p>
        </header>

        {favorites.length === 0 ? (
          <div className="empty-favs-glass glass-card">
            <Star size={44} className="empty-star" />
            <h3>No Favorite Locations Pinned</h3>
            <p>Star any monitored station during air analysis to pin it here.</p>
            <button className="btn-primary" onClick={() => handleOpen('Coimbatore')}>
              <span>Explore Coimbatore</span>
              <ArrowRight size={17} />
            </button>
          </div>
        ) : (
          <div className="favorites-cards-grid">
            {favorites.map((cityName) => {
              const key = cityName.toLowerCase();
              const info = MONITORED_LOCATIONS[key] || {
                name: cityName,
                aqi: 110,
                category: 'Poor',
                categoryColor: '#F59E0B',
                mainConcern: 'Particulate Dust'
              };

              return (
                <div key={cityName} className="fav-card glass-card">
                  <div className="fav-card-top">
                    <div className="fav-loc-tag">
                      <MapPin size={18} className="pin-cyan" />
                      <h3 className="fav-city-name">{info.name}</h3>
                    </div>
                    <button
                      className="btn-fav-remove"
                      onClick={() => toggleFavorite(cityName)}
                      title="Remove from favorites"
                    >
                      <Star size={18} className="star-filled" />
                    </button>
                  </div>

                  <div className="fav-aqi-row">
                    <span className="fav-aqi-num" style={{ color: info.categoryColor }}>
                      {info.aqi}
                    </span>
                    <span className="fav-cat-tag" style={{ color: info.categoryColor }}>
                      {info.category}
                    </span>
                  </div>

                  <div className="fav-concern-line">
                    <span className="fc-lbl">Concern:</span>
                    <span className="fc-val">{info.mainConcern}</span>
                  </div>

                  <button className="btn-primary w-full btn-fav-launch" onClick={() => handleOpen(info.name)}>
                    <span>Launch Analysis</span>
                    <ExternalLink size={15} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
