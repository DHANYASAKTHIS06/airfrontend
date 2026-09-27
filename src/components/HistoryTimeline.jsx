import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, ExternalLink, Calendar } from 'lucide-react';
import './HistoryTimeline.css';

export default function HistoryTimeline({ items = [] }) {
  if (items.length === 0) return null;

  // Group items into Today, Yesterday, Earlier
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  const groups = {
    Today: [],
    Yesterday: [],
    Earlier: []
  };

  items.forEach(item => {
    const itemDate = new Date(item.timestamp).toDateString();
    if (itemDate === today) {
      groups.Today.push(item);
    } else if (itemDate === yesterday) {
      groups.Yesterday.push(item);
    } else {
      groups.Earlier.push(item);
    }
  });

  return (
    <div className="history-timeline-root">
      {Object.entries(groups).map(([groupName, groupItems]) => {
        if (groupItems.length === 0) return null;

        return (
          <div key={groupName} className="timeline-group">
            <div className="timeline-group-header">
              <Calendar size={14} className="group-cal-icn" />
              <span className="group-title">{groupName}</span>
            </div>

            <div className="timeline-items-list">
              {groupItems.map((item) => {
                const timeStr = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                return (
                  <div key={item.id || item.timestamp} className="timeline-item-card glass-card">
                    <div className="t-node-marker"></div>
                    <div className="t-card-content">
                      <div className="t-top-row">
                        <div className="t-loc-box">
                          <MapPin size={15} className="t-pin" />
                          <strong className="t-loc-name">{item.location}</strong>
                        </div>
                        <span className="t-time-stamp"><Clock size={12} /> {timeStr}</span>
                      </div>

                      <div className="t-metrics-row">
                        <div className="t-aqi-col">
                          <span className="t-aqi-val" style={{ color: item.categoryColor || '#22D3EE' }}>
                            AQI {item.aqi}
                          </span>
                          <span className="t-cat-tag" style={{ color: item.categoryColor || '#22D3EE' }}>
                            {item.category}
                          </span>
                        </div>
                        <span className="t-concern-text">{item.mainConcern || "Particulate Pollution"}</span>
                      </div>

                      <Link to={`/air-quality/${encodeURIComponent(item.location)}`} className="t-inspect-link">
                        <span>Inspect Analysis</span>
                        <ExternalLink size={13} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
