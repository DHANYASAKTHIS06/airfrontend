import React, { useState, useEffect } from 'react';
import { Wind, Cpu, Database, Network, GitBranch, Sparkles } from 'lucide-react';
import './LoadingScreen.css';

export default function LoadingScreen({ location = "Selected Location", onComplete }) {
  const [stage, setStage] = useState(0);

  const stages = [
    { title: "Acquiring Atmospheric Sensor Streams", sub: `Connecting to ${location} air telemetry grid...`, icon: <Wind size={20} /> },
    { title: "Executing Random Forest Classification", sub: "Evaluating multi-tree particulate decision matrices...", icon: <Cpu size={20} /> },
    { title: "Mining Spatial Patterns & Inversion Rules", sub: "Running Apriori association algorithms & K-Means clustering...", icon: <Network size={20} /> },
    { title: "Synthesizing Dimensional PCA Projections", sub: "Formatting health intelligence & actionable recommendations...", icon: <GitBranch size={20} /> }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStage((prev) => {
        if (prev < stages.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          if (onComplete) {
            setTimeout(onComplete, 400);
          }
          return prev;
        }
      });
    }, 450);

    return () => clearInterval(timer);
  }, [stages.length, onComplete]);

  return (
    <div className="loading-screen-overlay">
      <div className="loading-card glass-card">
        {/* Radar Scanning Ring */}
        <div className="scanner-radar-frame">
          <div className="scanner-radar-circle">
            <div className="radar-sweep-beam"></div>
            <div className="radar-crosshair-h"></div>
            <div className="radar-crosshair-v"></div>
            <div className="radar-core-dot"></div>
          </div>
        </div>

        {/* Location & Title */}
        <div className="loading-text-group">
          <span className="scanning-badge">
            <Sparkles size={14} className="animate-spin" /> PATTERN MINING IN PROGRESS
          </span>
          <h2 className="loading-location-title">Analyzing {location.toUpperCase()}</h2>
          <p className="loading-stage-desc">{stages[stage]?.title}</p>
        </div>

        {/* Progress Tracker Bar */}
        <div className="stage-progress-bar-wrap">
          <div
            className="stage-progress-bar-fill"
            style={{ width: `${((stage + 1) / stages.length) * 100}%` }}
          ></div>
        </div>

        {/* Step Indicator list */}
        <div className="loading-steps-list">
          {stages.map((stg, i) => (
            <div
              key={i}
              className={`loading-step-item ${i === stage ? 'active' : i < stage ? 'completed' : 'pending'}`}
            >
              <div className="step-state-bullet">
                {i < stage ? '✓' : stg.icon}
              </div>
              <div className="step-info">
                <span className="step-title-text">{stg.title}</span>
                {i === stage && <span className="step-sub-text">{stg.sub}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
