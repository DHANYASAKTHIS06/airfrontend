import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { BarChart3, Clock, Calendar } from 'lucide-react';
import './AirQualityChart.css';

export default function AirQualityChart({ data }) {
  const [range, setRange] = useState('24h');

  if (!data) return null;

  const chartData = range === '24h' 
    ? data.trend24h 
    : range === '7d' 
      ? data.trend7d 
      : data.trend30d;

  const xKey = range === '24h' ? 'time' : 'day';

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const aqiVal = payload[0].value;
      const cat = aqiVal > 200 ? 'Very Poor' : aqiVal > 100 ? 'Poor' : aqiVal > 50 ? 'Moderate' : 'Good';
      const color = aqiVal > 200 ? '#EF4444' : aqiVal > 100 ? '#F59E0B' : aqiVal > 50 ? '#14B8A6' : '#10B981';

      return (
        <div className="chart-tooltip-glass">
          <span className="tooltip-time">{label}</span>
          <div className="tooltip-val-row">
            <span className="tooltip-aqi-lbl">AQI Index:</span>
            <span className="tooltip-aqi-num" style={{ color }}>{aqiVal} ({cat})</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="air-chart-wrapper glass-card">
      <div className="chart-header-row">
        <div className="chart-title-block">
          <BarChart3 size={20} className="chart-header-icn" />
          <div>
            <h3 className="chart-heading">Air Quality Temporal Progression</h3>
            <p className="chart-subheading">Atmospheric telemetry trajectory over selected time window</p>
          </div>
        </div>

        {/* Range Buttons: 24h, 7d, 30d */}
        <div className="chart-range-picker">
          <button
            className={`range-btn ${range === '24h' ? 'active' : ''}`}
            onClick={() => setRange('24h')}
          >
            24 Hours
          </button>
          <button
            className={`range-btn ${range === '7d' ? 'active' : ''}`}
            onClick={() => setRange('7d')}
          >
            7 Days
          </button>
          <button
            className={`range-btn ${range === '30d' ? 'active' : ''}`}
            onClick={() => setRange('30d')}
          >
            30 Days
          </button>
        </div>
      </div>

      <div className="recharts-box" style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 15, right: 20, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="aqiAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stop-color="#06B6D4" stop-opacity={0.4} />
                <stop offset="95%" stop-color="#06B6D4" stop-opacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
            <XAxis
              dataKey={xKey}
              stroke="#64748B"
              tick={{ fill: '#94A3B8', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(255, 255, 255, 0.08)' }}
            />
            <YAxis
              stroke="#64748B"
              tick={{ fill: '#94A3B8', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(255, 255, 255, 0.08)' }}
              domain={[0, 'dataMax + 40']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="aqi"
              stroke="#22D3EE"
              strokeWidth={3}
              fill="url(#aqiAreaGradient)"
              activeDot={{ r: 6, fill: '#FFFFFF', stroke: '#06B6D4', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
