import React from 'react';
import { ShieldCheck, HeartPulse, Sparkles, Home, Activity, Check, AlertCircle } from 'lucide-react';
import './RecommendationCard.css';

export default function RecommendationCard({ data }) {
  if (!data) return null;

  const { category, recommendation, shortAdvice } = data;

  const getAdvicePoints = () => {
    switch (category.toLowerCase()) {
      case 'good':
        return [
          { icon: <Activity size={18} className="advice-icn-green" />, text: "Ideal conditions for outdoor sports, runs, and open recreation." },
          { icon: <Home size={18} className="advice-icn-green" />, text: "Keep windows open for fresh natural ventilation." },
          { icon: <Check size={18} className="advice-icn-green" />, text: "Zero mask or air purification requirements." }
        ];
      case 'moderate':
        return [
          { icon: <Activity size={18} className="advice-icn-teal" />, text: "Generally safe for outdoor activities; monitor high-traffic areas." },
          { icon: <HeartPulse size={18} className="advice-icn-teal" />, text: "Unusually sensitive individuals should limit prolonged heavy exertion." },
          { icon: <Home size={18} className="advice-icn-teal" />, text: "Ventilation is safe during non-peak vehicular hours." }
        ];
      case 'poor':
        return [
          { icon: <AlertCircle size={18} className="advice-icn-amber" />, text: "Reduce prolonged outdoor exposure and avoid strenuous sports." },
          { icon: <HeartPulse size={18} className="advice-icn-amber" />, text: "Children and elderly should remain in filtered indoor zones." },
          { icon: <Home size={18} className="advice-icn-amber" />, text: "Keep windows closed during evening stagnation; wear N95 mask outdoors." }
        ];
      case 'very poor':
      default:
        return [
          { icon: <AlertCircle size={18} className="advice-icn-rose" />, text: "Avoid all non-essential outdoor physical activity and travel." },
          { icon: <HeartPulse size={18} className="advice-icn-rose" />, text: "Wear high-efficiency particulate masks (N95/FFP2) if stepping outside." },
          { icon: <Home size={18} className="advice-icn-rose" />, text: "Run indoor HEPA air purifiers and seal external window drafts." }
        ];
    }
  };

  return (
    <div className="recommendation-card-glass">
      <div className="rec-card-title-row">
        <div className="rec-badge-icon">
          <ShieldCheck size={20} className="rec-icon-glow" />
        </div>
        <div>
          <h3 className="rec-heading">Actionable Health Recommendation</h3>
          <p className="rec-subheading">Personalized environmental guidance based on air pattern mining</p>
        </div>
      </div>

      {/* Main highlighted recommendation quote */}
      <div className="rec-main-statement">
        <div className="rec-quote-accent"></div>
        <p className="rec-text">{recommendation}</p>
      </div>

      {/* Targeted Guidance points */}
      <div className="rec-advice-grid">
        {getAdvicePoints().map((item, idx) => (
          <div key={idx} className="advice-item">
            <div className="advice-icon-wrap">{item.icon}</div>
            <span className="advice-desc">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
