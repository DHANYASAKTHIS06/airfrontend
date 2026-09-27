import React from 'react';
import { MapPin, AlertTriangle, CheckCircle2, ShieldAlert, Wind, Thermometer, Droplets, Compass } from 'lucide-react';
import './AQICard.css';

export default function AQICard({ data }) {
  if (!data) return null;

  const { name, country, aqi, category, categoryColor, mainConcern, weather } = data;

  // Calculate circular gauge angle and stroke offset
  // AQI max 500 for gauge visualization
  const safeAQI = Math.min(Math.max(aqi, 0), 500);
  const strokeDashoffset = 314 - (314 * Math.min(safeAQI, 400)) / 400;

  const getCategoryBadgeClass = (cat) => {
    switch (cat.toLowerCase()) {
      case 'good': return 'badge-good';
      case 'moderate': return 'badge-moderate';
      case 'poor': return 'badge-poor';
      case 'very poor': return 'badge-very-poor';
      default: return 'badge-poor';
    }
  };

  const getCategoryIcon = (cat) => {
    switch (cat.toLowerCase()) {
      case 'good': return <CheckCircle2 size={20} className="cat-icon-emerald" />;
      case 'moderate': return <Wind size={20} className="cat-icon-teal" />;
      case 'poor': return <AlertTriangle size={20} className="cat-icon-amber" />;
      case 'very poor': return <ShieldAlert size={20} className="cat-icon-rose" />;
      default: return <AlertTriangle size={20} />;
    }
  };

  return (
    <div className="aqi-card-glass">
      {/* Location Header Header */}
      <div className="aqi-card-header">
        <div className="location-pill-group">
          <div className="location-tag">
            <MapPin size={18} className="location-pin" />
            <h2 className="location-name">{name.toUpperCase()}</h2>
          </div>
          <span className="location-region">{country || "Regional Station"}</span>
        </div>

        <div className={`category-status-pill ${getCategoryBadgeClass(category)}`}>
          {getCategoryIcon(category)}
          <span className="category-text-label">{category.toUpperCase()}</span>
        </div>
      </div>

      {/* Main Metric Section */}
      <div className="aqi-metric-showcase">
        {/* Radial Gauge Meter */}
        <div className="gauge-meter-wrapper">
          <svg className="radial-gauge-svg" viewBox="0 0 120 120">
            {/* Background ring */}
            <circle
              cx="60"
              cy="60"
              r="50"
              className="gauge-bg-ring"
            />
            {/* Value fill ring */}
            <circle
              cx="60"
              cy="60"
              r="50"
              className="gauge-val-ring"
              style={{
                stroke: categoryColor,
                strokeDashoffset: strokeDashoffset,
              }}
            />
          </svg>
          <div className="gauge-inner-content">
            <span className="aqi-title-mini">AQI</span>
            <span className="aqi-main-value" style={{ color: categoryColor }}>{aqi}</span>
            <span className="aqi-scale-label">Index</span>
          </div>
        </div>

        {/* Core Abstraction summary */}
        <div className="core-abstraction-block">
          <div className="abstraction-row">
            <span className="abs-label">Air Quality Status</span>
            <span className="abs-value-category" style={{ color: categoryColor }}>
              {category}
            </span>
          </div>

          <div className="abstraction-row">
            <span className="abs-label">Main Pollution Concern</span>
            <div className="abs-concern-box">
              <AlertTriangle size={15} style={{ color: categoryColor, flexShrink: 0 }} />
              <span className="abs-concern-text">{mainConcern}</span>
            </div>
          </div>

          {/* Quick weather context metrics */}
          {weather && (
            <div className="weather-micro-strip">
              <div className="w-metric" title="Temperature">
                <Thermometer size={14} className="w-icon" />
                <span>{weather.temp}°C</span>
              </div>
              <div className="w-metric" title="Humidity">
                <Droplets size={14} className="w-icon" />
                <span>{weather.humidity}%</span>
              </div>
              <div className="w-metric" title="Wind Velocity">
                <Compass size={14} className="w-icon" />
                <span>{weather.windSpeed} km/h {weather.windDirection}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AQI Range Spectrum Indicator */}
      <div className="spectrum-strip-wrapper">
        <div className="spectrum-bar">
          <div className="spectrum-segment seg-good" title="0-50 Good"></div>
          <div className="spectrum-segment seg-mod" title="51-100 Moderate"></div>
          <div className="spectrum-segment seg-poor" title="101-200 Poor"></div>
          <div className="spectrum-segment seg-vpoor" title="201-300+ Very Poor"></div>
          <div
            className="spectrum-pointer"
            style={{ left: `${Math.min(Math.max((aqi / 300) * 100, 4), 96)}%`, backgroundColor: categoryColor }}
          ></div>
        </div>
        <div className="spectrum-labels">
          <span>0 (Good)</span>
          <span>50</span>
          <span>100 (Moderate)</span>
          <span>200 (Poor)</span>
          <span>300+ (Very Poor)</span>
        </div>
      </div>
    </div>
  );
}
