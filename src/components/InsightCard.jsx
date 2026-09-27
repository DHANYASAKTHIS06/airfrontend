import React from 'react';
import { 
  AlertTriangle, 
  Thermometer, 
  Droplets, 
  Wind, 
  Compass, 
  Activity,
  Layers
} from 'lucide-react';
import './InsightCard.css';

export default function InsightCard({ data }) {
  if (!data) return null;

  const { category, categoryColor, mainConcern, weather, pollutants } = data;

  // Filter only valid metrics that exist
  const insights = [
    {
      id: 'category',
      label: 'Air Quality Status',
      value: category?.toUpperCase() || 'MODERATE',
      color: categoryColor || '#14B8A6',
      icon: <Activity size={20} />
    },
    mainConcern && {
      id: 'concern',
      label: 'Primary Concern',
      value: mainConcern,
      color: categoryColor || '#F59E0B',
      icon: <AlertTriangle size={20} />
    },
    weather?.temp !== undefined && {
      id: 'temp',
      label: 'Ambient Temperature',
      value: `${weather.temp}°C`,
      color: '#38BDF8',
      icon: <Thermometer size={20} />
    },
    weather?.humidity !== undefined && {
      id: 'humidity',
      label: 'Relative Humidity',
      value: `${weather.humidity}%`,
      color: '#2DD4BF',
      icon: <Droplets size={20} />
    },
    weather?.windSpeed !== undefined && {
      id: 'wind',
      label: 'Wind Velocity',
      value: `${weather.windSpeed} km/h ${weather.windDir || ''}`,
      color: '#A78BFA',
      icon: <Compass size={20} />
    }
  ].filter(Boolean);

  return (
    <div className="insights-grid-container">
      {insights.map((item) => (
        <div key={item.id} className="insight-card-glass glass-card">
          <div className="insight-top">
            <span className="insight-label">{item.label}</span>
            <div className="insight-icon-box" style={{ color: item.color, borderColor: `${item.color}40`, background: `${item.color}15` }}>
              {item.icon}
            </div>
          </div>
          <span className="insight-main-value" style={{ color: item.color }}>
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}
