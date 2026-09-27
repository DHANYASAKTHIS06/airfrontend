import React from 'react';
import { Layers, Info } from 'lucide-react';
import './PollutionCard.css';

export default function PollutionCard({ pollutants = [] }) {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'good': return '#10B981';
      case 'moderate':
      case 'acceptable': return '#14B8A6';
      case 'high': return '#F59E0B';
      case 'critical': return '#EF4444';
      default: return '#06B6D4';
    }
  };

  const calculateRatio = (value, limit) => {
    return Math.min(Math.round((value / limit) * 100), 100);
  };

  return (
    <div className="pollution-card-glass">
      <div className="pol-header">
        <div className="pol-header-icon-wrap">
          <Layers size={20} className="pol-icon" />
        </div>
        <div>
          <h3 className="pol-title">Monitored Pollutant Matrix</h3>
          <p className="pol-subtitle">Concentration measurements against national atmospheric thresholds</p>
        </div>
      </div>

      <div className="pollutants-grid">
        {pollutants.map((pol) => {
          const color = getStatusColor(pol.status);
          const ratio = calculateRatio(pol.value, pol.limit);

          return (
            <div key={pol.name} className="pollutant-tile">
              <div className="tile-top-row">
                <span className="tile-code-badge">{pol.name}</span>
                <span
                  className="tile-status-tag"
                  style={{
                    backgroundColor: `${color}20`,
                    color: color,
                    borderColor: `${color}40`
                  }}
                >
                  {pol.status}
                </span>
              </div>

              <div className="tile-value-row">
                <span className="tile-value-num">{pol.value}</span>
                <span className="tile-unit">{pol.unit}</span>
              </div>

              <div className="tile-label">{pol.label}</div>

              {/* Threshold Progress Bar */}
              <div className="tile-progress-track">
                <div
                  className="tile-progress-fill"
                  style={{
                    width: `${ratio}%`,
                    backgroundColor: color
                  }}
                ></div>
              </div>

              <div className="tile-limit-info">
                <span>Safe Threshold: {pol.limit} {pol.unit}</span>
                <span>{ratio}% of standard</span>
              </div>

              <p className="tile-impact-desc">{pol.impact}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
