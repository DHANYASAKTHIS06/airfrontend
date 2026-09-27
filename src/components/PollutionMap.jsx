import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Popup, CircleMarker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { SUPPORTED_LOCATIONS } from '../data/supportedLocations';
import { MapPin } from 'lucide-react';
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
  const currentKey = (selectedLocation || 'Coimbatore').toLowerCase();
  const activeData = SUPPORTED_LOCATIONS[currentKey] || SUPPORTED_LOCATIONS.coimbatore;
  const centerPos = [activeData.lat || 11.0168, activeData.lng || 76.9558];

  const locationsList = Object.values(SUPPORTED_LOCATIONS);

  const getColorForPM25 = (pm25) => {
    if (pm25 > 90) return '#EF4444'; // Very Poor
    if (pm25 > 60) return '#F59E0B'; // Poor
    if (pm25 > 30) return '#14B8A6'; // Moderate
    return '#10B981'; // Good
  };

  return (
    <div className="pollution-map-glass-card glass-card">
      <div className="map-card-header">
        <div className="map-title-wrap">
          <MapPin size={20} className="map-pin-cyan" />
          <div>
            <h3 className="map-title">Geospatial Sensor Grid</h3>
            <p className="map-subtitle">Supported national monitoring stations and baseline measurements</p>
          </div>
        </div>

        {/* Legend */}
        <div className="map-legend">
          <div className="legend-item"><span className="leg-dot dot-good"></span> Clean Baseline</div>
          <div className="legend-item"><span className="leg-dot dot-mod"></span> Moderate</div>
          <div className="legend-item"><span className="leg-dot dot-poor"></span> Poor</div>
          <div className="legend-item"><span className="leg-dot dot-vpoor"></span> Very Poor</div>
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
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {locationsList.map((loc) => {
            const isSelected = loc.name.toLowerCase() === currentKey;
            const color = getColorForPM25(loc.pm2_5);
            return (
              <CircleMarker
                key={loc.name}
                center={[loc.lat, loc.lng]}
                radius={isSelected ? 14 : 8}
                pathOptions={{
                  fillColor: color,
                  fillOpacity: isSelected ? 0.9 : 0.7,
                  color: isSelected ? '#FFFFFF' : color,
                  weight: isSelected ? 3 : 1.5
                }}
              >
                <Popup className="custom-map-popup">
                  <div className="map-popup-content">
                    <div className="popup-top">
                      <strong className="popup-name">{loc.name.toUpperCase()}</strong>
                      <span className="popup-cat-badge" style={{ backgroundColor: color }}>
                        {loc.state}
                      </span>
                    </div>

                    <div className="popup-aqi-row">
                      <span className="popup-aqi-lbl">PM2.5:</span>
                      <strong className="popup-aqi-val" style={{ color }}>{loc.pm2_5} µg/m³</strong>
                    </div>

                    <div className="popup-concern">
                      <span className="p-lbl">Telemetry Metrics:</span>
                      <p className="p-txt">NO2: {loc.no2} ppb | RSPM: {loc.rspm} µg/m³</p>
                    </div>

                    <Link to={`/air-quality/${encodeURIComponent(loc.name)}`} className="popup-inspect-link">
                      <span>Analyze with Render ML</span>
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
