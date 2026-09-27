import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Cpu, 
  MapPin, 
  Sliders, 
  Sparkles, 
  AlertTriangle, 
  RefreshCw,
  Layers
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { predictionService } from '../services/predictionService';
import { useLocationContext } from '../context/LocationContext';
import './Prediction.css';

export default function Prediction() {
  const { selectedLocation } = useLocationContext();
  const [params, setParams] = useState({
    pm2_5: 68.4,
    rspm: 124.2,
    spm: 180.0,
    no2: 38.6,
    so2: 12.1
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [prediction, setPrediction] = useState(null);

  const handleRunPrediction = async () => {
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const result = await predictionService.runRandomForestPrediction(params);
      setPrediction(result);
    } catch (e) {
      console.error(e);
      setError(e.message || 'Failed to communicate with Render ML backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-layout-root">
      <Sidebar />

      <main className="dashboard-main-viewport">
        {/* Page Header */}
        <header className="page-header-block">
          <span className="page-kicker">DEPLOYED ML BACKEND PREDICTION ENGINE</span>
          <h1 className="page-headline">Air Quality Predictive Mining</h1>
          <p className="page-subtext">
            Transmit telemetry metrics directly to trained ML models deployed on Render backend.
          </p>
        </header>

        {/* Pipeline Stepper Visualizer */}
        <div className="rf-pipeline-stepper-glass glass-card">
          <span className="pipeline-title">LIVE BACKEND ML PIPELINE FLOW</span>
          <div className="pipeline-flow-row">
            <div className={`pipe-node ${loading ? 'active' : 'active'}`}>
              <MapPin size={16} />
              <span>Location Telemetry</span>
            </div>
            <div className="pipe-arrow">➔</div>
            <div className={`pipe-node ${loading ? 'active' : ''}`}>
              <Sliders size={16} />
              <span>Parameter Payload</span>
            </div>
            <div className="pipe-arrow">➔</div>
            <div className={`pipe-node ${prediction ? 'active' : ''}`}>
              <Cpu size={16} />
              <span>Render ML Models</span>
            </div>
            <div className="pipe-arrow">➔</div>
            <div className={`pipe-node ${prediction ? 'active' : ''}`}>
              <Sparkles size={16} />
              <span>Real Result & Advisory</span>
            </div>
          </div>
        </div>

        {/* Input Controls & Simulation Panel */}
        <div className="prediction-grid-layout">
          {/* Left: Interactive Environmental Sliders */}
          <div className="sim-controls-panel glass-card">
            <h3 className="panel-title">Environmental Telemetry Scenario</h3>
            <p className="panel-subtitle">Adjust pollutant measurements to query backend ML models</p>

            <div className="slider-fields-list">
              <div className="slider-group">
                <div className="slider-top-lbl">
                  <span>Fine Particulate (PM2.5)</span>
                  <strong>{params.pm2_5} µg/m³</strong>
                </div>
                <input
                  type="range"
                  min="5"
                  max="280"
                  step="0.1"
                  value={params.pm2_5}
                  onChange={(e) => setParams({ ...params, pm2_5: parseFloat(e.target.value) })}
                  className="custom-range"
                />
              </div>

              <div className="slider-group">
                <div className="slider-top-lbl">
                  <span>Coarse Dust (RSPM / PM10)</span>
                  <strong>{params.rspm} µg/m³</strong>
                </div>
                <input
                  type="range"
                  min="10"
                  max="350"
                  step="0.1"
                  value={params.rspm}
                  onChange={(e) => setParams({ ...params, rspm: parseFloat(e.target.value) })}
                  className="custom-range"
                />
              </div>

              <div className="slider-group">
                <div className="slider-top-lbl">
                  <span>Suspended Particulate (SPM)</span>
                  <strong>{params.spm} µg/m³</strong>
                </div>
                <input
                  type="range"
                  min="15"
                  max="450"
                  step="0.1"
                  value={params.spm}
                  onChange={(e) => setParams({ ...params, spm: parseFloat(e.target.value) })}
                  className="custom-range"
                />
              </div>

              <div className="slider-group">
                <div className="slider-top-lbl">
                  <span>Nitrogen Dioxide (NO₂)</span>
                  <strong>{params.no2} ppb</strong>
                </div>
                <input
                  type="range"
                  min="5"
                  max="120"
                  step="0.1"
                  value={params.no2}
                  onChange={(e) => setParams({ ...params, no2: parseFloat(e.target.value) })}
                  className="custom-range"
                />
              </div>

              <div className="slider-group">
                <div className="slider-top-lbl">
                  <span>Sulfur Dioxide (SO₂)</span>
                  <strong>{params.so2} ppb</strong>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  step="0.1"
                  value={params.so2}
                  onChange={(e) => setParams({ ...params, so2: parseFloat(e.target.value) })}
                  className="custom-range"
                />
              </div>
            </div>

            <button
              className="btn-primary w-full btn-run-rf"
              onClick={handleRunPrediction}
              disabled={loading}
            >
              {loading ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  <span>Processing on Render Backend...</span>
                </>
              ) : (
                <>
                  <Cpu size={18} />
                  <span>Execute Backend ML Prediction</span>
                </>
              )}
            </button>
          </div>

          {/* Right: Real Prediction Result from Backend */}
          <div className="sim-result-panel glass-card">
            <h3 className="panel-title">Forecasted Intelligence</h3>
            <p className="panel-subtitle">Real results from Render trained ML backend models</p>

            {error && (
              <div style={{ padding: '20px', borderRadius: '10px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#EF4444', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                  <AlertTriangle size={18} />
                  <span>Backend Error</span>
                </div>
                <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem' }}>{error}</p>
              </div>
            )}

            {prediction ? (
              <motion.div
                className="pred-result-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="pred-status-banner">
                  <span className="pred-lbl">BACKEND ML CLASSIFICATION</span>
                  <h2 className="pred-val" style={{ color: prediction.predictedColor }}>
                    {prediction.predictedClass.toUpperCase()}
                  </h2>
                  <span className="pred-conf-pill">
                    {prediction.confidence}% ML Confidence Rating
                  </span>
                </div>

                <div className="pred-meaning-box">
                  <span className="meaning-title">Backend Model Breakdown:</span>
                  <p className="meaning-desc">{prediction.explanation}</p>
                  <div style={{ marginTop: '10px', display: 'flex', gap: '15px', flexWrap: 'wrap', fontSize: '0.85rem' }}>
                    <span><strong>PCA PC1:</strong> {prediction.pcaProjection?.PC1}</span>
                    <span><strong>PCA PC2:</strong> {prediction.pcaProjection?.PC2}</span>
                    <span><strong>Pattern Index:</strong> #{prediction.pollutionPattern}</span>
                    <span><strong>Regression Score:</strong> {prediction.pollutionScore}</span>
                  </div>
                </div>

                <div className="pred-rec-box">
                  <AlertTriangle size={18} style={{ color: prediction.predictedColor }} />
                  <div>
                    <strong style={{ display: 'block', marginBottom: '4px' }}>Real Backend Recommendations:</strong>
                    {prediction.recommendations?.map((rec, i) => (
                      <p key={i} className="rec-text" style={{ margin: '3px 0' }}>• {rec}</p>
                    ))}
                  </div>
                </div>

                {/* Feature importance split */}
                <div className="pred-feat-weights">
                  <span className="weights-title">Model Feature Importances</span>
                  <div className="weights-list">
                    {prediction.featureImportances.map((f, i) => (
                      <div key={i} className="weight-item">
                        <div className="w-lbl-row">
                          <span>{f.feature}</span>
                          <strong>{f.weight}%</strong>
                        </div>
                        <div className="w-track">
                          <div className="w-fill" style={{ width: `${f.weight}%`, backgroundColor: f.color }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : !loading && !error ? (
              <div className="pred-empty-placeholder">
                <Cpu size={48} className="empty-rf-icn" />
                <p>Adjust the telemetry parameters on the left and click <strong>Execute Backend ML Prediction</strong>.</p>
              </div>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}
