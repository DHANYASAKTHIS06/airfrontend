import React from 'react';
import Sidebar from '../components/Sidebar';
import PollutionMap from '../components/PollutionMap';
import { useLocationContext } from '../context/LocationContext';
import { MONITORED_LOCATIONS } from '../services/airQualityService';
import './SpatialMapPage.css';

export default function SpatialMapPage() {
  const { selectedLocation, selectLocation } = useLocationContext();
  const hubs = Object.values(MONITORED_LOCATIONS);

  return (
    <div className="dashboard-layout-root">
      <Sidebar />

      <main className="dashboard-main-viewport">
        {/* Header */}
        <header className="page-header-block">
          <span className="page-kicker">SPATIAL SENSOR TELEMETRY</span>
          <h1 className="page-headline">Geospatial Air Quality Map</h1>
          <p className="page-subtext">
            Explore active environmental monitoring pins, hazard categories, and particulate concentrations across national coordinates.
          </p>
        </header>

        {/* Full Spatial Map */}
        <PollutionMap selectedLocation={selectedLocation} />

        {/* Station Directory Quick Cards */}
        <div className="map-station-directory">
          <h3 className="section-card-title mb-sm">Active Environmental Telemetry Stations</h3>
          <div className="station-cards-grid">
            {hubs.map((hub) => (
              <div
                key={hub.name}
                className={`station-dir-card glass-card ${hub.name.toLowerCase() === selectedLocation.toLowerCase() ? 'active' : ''}`}
                onClick={() => selectLocation(hub.name)}
              >
                <div className="st-top">
                  <strong className="st-name">{hub.name}</strong>
                  <span className="st-cat-pill" style={{ color: hub.categoryColor, backgroundColor: `${hub.categoryColor}15` }}>
                    {hub.category}
                  </span>
                </div>
                <div className="st-aqi-line">
                  <span className="st-aqi-val" style={{ color: hub.categoryColor }}>AQI {hub.aqi}</span>
                  <span className="st-coords">[{hub.lat}°N, {hub.lng}°E]</span>
                </div>
                <p className="st-concern">{hub.mainConcern}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
