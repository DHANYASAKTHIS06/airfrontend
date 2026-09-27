import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MONITORED_LOCATIONS } from '../services/airQualityService';
import { MapPin, AlertTriangle, ShieldCheck, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import './PollutionMap.css';

// Sub-component to re-center map dynamically
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}

export default function PollutionMap({ selectedLocation = 'Coimbatore' }) {
  const currentKey = selectedLocation.toLowerCase();
  const activeData = MONITORED_LOCATIONS[currentKey] || MONITORED_LOCATIONS.coimbatore;
  const centerPos = [activeData.lat || 11.0168, activeData.lng || 76.9558];

  const locationsList = Object.values(MONITORED_LOCATIONS);

  return (
    <div className="pollution-map-glass-card glass-card">
      <div className="map-card-header">
        <div className="map-title-wrap">
          <MapPin size={20} className="map-pin-cyan" />
          <div>
            <h3 className="map-title">Geospatial Atmospheric Sensor Grid</h3>
            <p className="map-subtitle">Interactive regional telemetry stations and classified hazard zones</p>
          </div>
        </div>

        {/* Legend */}
        <div className="map-legend">
          <div className="legend-item"><span className="leg-dot dot-good"></span> Good (0-50)</div>
          <div className="legend-item"><span className="leg-dot dot-mod"></span> Moderate (51-100)</div>
          <div className="legend-item"><span className="leg-dot dot-poor"></span> Poor (101-200)</div>
          <div className="legend-item"><span className="leg-dot dot-vpoor"></span> Very Poor (201+)</div>
        </div>
      </div>

      <div className="leaflet-map-frame">
        <MapContainer
          center={centerPos}
          zoom={5}
          scrollWheelZoom={false}
          className="leaflet-container-custom"
        >
          <ChangeView center={centerPos} zoom={activeData ? 6 : 5} />
          {/* CartoDB Dark Matter tiles for sleek environmental dark theme */}
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {locationsList.map((loc) => {
            const isSelected = loc.name.toLowerCase() === currentKey;
            return (
              <CircleMarker
                key={loc.name}
                center={[loc.lat, loc.lng]}
                radius={isSelected ? 16 : 10}
                pathOptions={{
                  fillColor: loc.categoryColor,
                  fillOpacity: isSelected ? 0.9 : 0.7,
                  color: isSelected ? '#FFFFFF' : loc.categoryColor,
                  weight: isSelected ? 3 : 1.5
                }}
              >
                <Popup className="custom-map-popup">
                  <div className="map-popup-content">
                    <div className="popup-top">
                      <strong className="popup-name">{loc.name.toUpperCase()}</strong>
                      <span className="popup-cat-badge" style={{ backgroundColor: loc.categoryColor }}>
                        {loc.category}
                      </span>
                    </div>

                    <div className="popup-aqi-row">
                      <span className="popup-aqi-lbl">AQI:</span>
                      <strong className="popup-aqi-val" style={{ color: loc.categoryColor }}>{loc.aqi}</strong>
                    </div>

                    <div className="popup-concern">
                      <span className="p-lbl">Main Concern:</span>
                      <p className="p-txt">{loc.mainConcern}</p>
                    </div>

                    <div className="popup-rec">
                      <span className="p-lbl">Recommendation:</span>
                      <p className="p-txt">{loc.shortAdvice || loc.recommendation}</p>
                    </div>

                    <Link to={`/air-quality/${encodeURIComponent(loc.name)}`} className="popup-inspect-link">
                      <span>View Full Analysis</span>
                      <ExternalLink size={12} />
                    </Link>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
