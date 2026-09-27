import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis, 
  Tooltip, 
  Cell 
} from 'recharts';
import { Database, CheckCircle2, ChevronDown, ChevronUp, Layers } from 'lucide-react';
import './ClusterChart.css';

export default function ClusterChart({ clusterData }) {
  const [activeCluster, setActiveCluster] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  if (!clusterData) return null;

  const { clusters, dataPoints } = clusterData;

  const getClusterColor = (id) => {
    switch (id) {
      case 1: return '#10B981'; // Low
      case 2: return '#14B8A6'; // Moderate
      case 3: return '#EF4444'; // High
      default: return '#06B6D4';
    }
  };

  const CustomScatterTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const cluster = clusters.find(c => c.id === data.clusterId);
      return (
        <div className="cluster-tooltip-glass">
          <strong className="c-tt-title">{data.name}</strong>
          <div className="c-tt-row">
            <span>Cluster:</span>
            <span style={{ color: cluster?.color }}>{cluster?.label}</span>
          </div>
          <div className="c-tt-row">
            <span>AQI Index:</span>
            <strong>{data.aqi}</strong>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="cluster-chart-root glass-card">
      <div className="cluster-header-row">
        <div className="cluster-title-wrap">
          <Database size={20} className="text-cyan" />
          <div>
            <h3 className="cluster-title">Spatial Environmental Clusters (k=3)</h3>
            <p className="cluster-subtitle">Partitioning regional atmospheric stations into 3 homogeneous clusters</p>
          </div>
        </div>
      </div>

      {/* Cluster Category Selector Badges */}
      <div className="cluster-archetypes-list">
        {clusters.map((c) => {
          const isSelected = activeCluster === c.id;
          return (
            <div
              key={c.id}
              className={`cluster-pill-card ${isSelected ? 'active' : ''}`}
              style={{ borderColor: isSelected ? c.color : 'rgba(255, 255, 255, 0.08)' }}
              onClick={() => setActiveCluster(isSelected ? null : c.id)}
            >
              <div className="pill-top">
                <span className="pill-dot" style={{ backgroundColor: c.color }}></span>
                <span className="pill-name" style={{ color: c.color }}>{c.label}</span>
              </div>
              <p className="pill-desc">{c.characteristics}</p>
              <div className="pill-samples">
                <span>Zones: {c.sampleLocations.slice(0, 2).join(', ')}...</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2D Scatter Space Chart */}
      <div className="scatter-frame-container" style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 10, left: 10 }}>
            <XAxis
              type="number"
              dataKey="x"
              name="Pollution Load Axis"
              stroke="#64748B"
              tick={{ fill: '#94A3B8', fontSize: 11 }}
              label={{ value: 'Atmospheric Particulate Axis →', position: 'bottom', fill: '#64748B', fontSize: 11 }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Ventilation Axis"
              stroke="#64748B"
              tick={{ fill: '#94A3B8', fontSize: 11 }}
              label={{ value: '↑ Convective Ventilation Axis', angle: -90, position: 'left', fill: '#64748B', fontSize: 11 }}
            />
            <ZAxis range={[120, 240]} />
            <Tooltip content={<CustomScatterTooltip />} />
            <Scatter name="Stations" data={dataPoints}>
              {dataPoints.map((entry, index) => {
                const color = getClusterColor(entry.clusterId);
                const isDimmed = activeCluster !== null && activeCluster !== entry.clusterId;
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={color}
                    fillOpacity={isDimmed ? 0.2 : 0.85}
                    stroke={isDimmed ? 'transparent' : '#FFFFFF'}
                    strokeWidth={1.5}
                  />
                );
              })}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Advanced Technical Toggle */}
      <div className="cluster-advanced-toggle">
        <button
          className="btn-cluster-toggle"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <span>{showAdvanced ? "Hide Technical Centroid Coordinates" : "View Advanced Cluster Centroid Matrices"}</span>
          {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {showAdvanced && (
        <div className="cluster-centroids-breakdown">
          {clusters.map((c) => (
            <div key={c.id} className="centroid-card">
              <span className="c-name" style={{ color: c.color }}>{c.name}</span>
              <div className="c-matrix">
                <span>Centroid PM2.5: <strong>{c.centroid.pm25} µg/m³</strong></span>
                <span>NO2 Mean: <strong>{c.centroid.no2} ppb</strong></span>
                <span>Wind Dispersion: <strong>{c.centroid.wind} km/h</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
