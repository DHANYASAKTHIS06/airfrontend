import React, { useState } from 'react';
import { Network, ChevronDown, ChevronUp, Sparkles, Info, ShieldAlert, ArrowRight } from 'lucide-react';
import './PatternCard.css';

export default function PatternCard({ pattern, rules = [] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="pattern-card-glass glass-card">
      <div className="pattern-card-header">
        <div className="pat-badge-icon">
          <Network size={20} className="pat-icon-cyan" />
        </div>
        <div className="pat-title-block">
          <span className="pat-kicker">DISCOVERED APRIORI PATTERN</span>
          <h3 className="pat-title">{pattern?.title || "Atmospheric Inversion & Particulate Accumulation"}</h3>
        </div>
      </div>

      <p className="pat-main-desc">
        {pattern?.description || "Elevated particulate pollution frequently appears with the observed stagnant micro-climate conditions."}
      </p>

      {/* Primary recommendation derived from rule */}
      {pattern?.recommendation && (
        <div className="pat-rec-box">
          <ShieldAlert size={16} className="pat-rec-icon" />
          <span className="pat-rec-text">{pattern.recommendation}</span>
        </div>
      )}

      {/* Advanced Technical Toggle */}
      <div className="pat-advanced-toggle-row">
        <button
          className="btn-pat-toggle"
          onClick={() => setExpanded(!expanded)}
        >
          <span>{expanded ? "Hide Mathematical Association Metrics" : "View Advanced Analysis (Support, Confidence, Lift)"}</span>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {expanded && (
        <div className="pat-expanded-content">
          <div className="pat-disclaimer-note">
            <Info size={14} className="info-icn" />
            <span>Note: Data mining association rules represent recurring statistical co-occurrences and do not assert direct univariate causation.</span>
          </div>

          <div className="pat-rules-table-wrap">
            <table className="pat-rules-table">
              <thead>
                <tr>
                  <th>Antecedent Condition (IF)</th>
                  <th>Consequent Event (THEN)</th>
                  <th>Support</th>
                  <th>Confidence</th>
                  <th>Lift Ratio</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((rule, idx) => (
                  <tr key={idx}>
                    <td className="rule-antecedent-cell">
                      <code>{rule.antecedent}</code>
                    </td>
                    <td className="rule-consequent-cell">
                      <code>{rule.consequent}</code>
                    </td>
                    <td className="metric-cell">{(rule.support * 100).toFixed(0)}%</td>
                    <td className="metric-cell">{(rule.confidence * 100).toFixed(0)}%</td>
                    <td className="metric-cell lift-cell">{rule.lift}x</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
