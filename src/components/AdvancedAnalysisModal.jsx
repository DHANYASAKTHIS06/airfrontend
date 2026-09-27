import React, { useState } from 'react';
import { 
  X, 
  Cpu, 
  Database, 
  Network, 
  GitBranch, 
  ChevronRight, 
  TrendingUp, 
  Target, 
  BarChart2, 
  Share2, 
  Info,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import './AdvancedAnalysisModal.css';

export default function AdvancedAnalysisModal({ isOpen, onClose, data }) {
  if (!isOpen || !data) return null;

  const [activeTab, setActiveTab] = useState('rf');
  const { mlAnalysis, name, aqi, category } = data;
  const { randomForest, kMeans, apriori, pca } = mlAnalysis;

  return (
    <div className="advanced-modal-backdrop" onClick={onClose}>
      <div className="advanced-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-badge-icn">
              <Sparkles size={20} className="modal-icn-glow" />
            </div>
            <div>
              <h2 className="modal-title">Advanced Machine Learning & Pattern Mining</h2>
              <p className="modal-subtitle">
                Algorithmic telemetry breakdown for <span className="highlight-loc">{name}</span> (AQI {aqi} • {category})
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={22} />
          </button>
        </div>

        {/* Algorithm Selection Navigation Tabs */}
        <div className="algo-tabs-nav">
          <button
            className={`algo-tab-btn ${activeTab === 'rf' ? 'active' : ''}`}
            onClick={() => setActiveTab('rf')}
          >
            <Cpu size={16} />
            <span>Random Forest</span>
            <span className="tab-pill">Classification</span>
          </button>

          <button
            className={`algo-tab-btn ${activeTab === 'kmeans' ? 'active' : ''}`}
            onClick={() => setActiveTab('kmeans')}
          >
            <Database size={16} />
            <span>K-Means</span>
            <span className="tab-pill">Grouping</span>
          </button>

          <button
            className={`algo-tab-btn ${activeTab === 'apriori' ? 'active' : ''}`}
            onClick={() => setActiveTab('apriori')}
          >
            <Network size={16} />
            <span>Apriori</span>
            <span className="tab-pill">Pattern Mining</span>
          </button>

          <button
            className={`algo-tab-btn ${activeTab === 'pca' ? 'active' : ''}`}
            onClick={() => setActiveTab('pca')}
          >
            <GitBranch size={16} />
            <span>PCA</span>
            <span className="tab-pill">Feature Reduction</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="algo-tab-content">
          {/* 1. RANDOM FOREST TAB */}
          {activeTab === 'rf' && (
            <div className="tab-pane">
              <div className="algo-overview-card">
                <div className="algo-overview-header">
                  <div>
                    <h3 className="algo-name">{randomForest.modelName}</h3>
                    <p className="algo-desc">
                      Supervised ensemble classifier aggregating 100 decorrelated decision trees for robust non-linear AQI boundary assignment.
                    </p>
                  </div>
                  <div className="confidence-stat-box">
                    <span className="conf-label">Model Confidence</span>
                    <span className="conf-value">{randomForest.accuracyConfidence}%</span>
                  </div>
                </div>

                <div className="summary-quote-box">
                  <Info size={16} className="quote-icon" />
                  <span>{randomForest.summary}</span>
                </div>
              </div>

              {/* Tree Votes & Feature Importance */}
              <div className="algo-dual-grid">
                {/* Decision Tree Votes */}
                <div className="inner-glass-box">
                  <h4 className="box-title">Decision Tree Ensemble Vote Distribution</h4>
                  <p className="box-subtitle">100 individual estimators cast classification votes</p>

                  <div className="tree-votes-list">
                    {Object.entries(randomForest.treeVotes).map(([cls, votes]) => (
                      <div key={cls} className="vote-row">
                        <div className="vote-label-group">
                          <span className="vote-class-name">{cls}</span>
                          <span className="vote-count">{votes} trees ({votes}%)</span>
                        </div>
                        <div className="vote-progress-track">
                          <div
                            className="vote-progress-fill"
                            style={{
                              width: `${votes}%`,
                              backgroundColor:
                                cls === 'Good' ? '#10B981' :
                                cls === 'Moderate' ? '#14B8A6' :
                                cls === 'Poor' ? '#F59E0B' : '#EF4444'
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Feature Importance */}
                <div className="inner-glass-box">
                  <h4 className="box-title">Gini Feature Importance Weights</h4>
                  <p className="box-subtitle">Relative environmental weight in classification split</p>

                  <div className="feature-weight-list">
                    {randomForest.featureImportances.map((feat, idx) => (
                      <div key={idx} className="feat-row">
                        <div className="feat-label-group">
                          <span className="feat-name">{feat.feature}</span>
                          <span className="feat-weight">{feat.weight}%</span>
                        </div>
                        <div className="feat-progress-track">
                          <div
                            className="feat-progress-fill"
                            style={{ width: `${feat.weight}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. K-MEANS TAB */}
          {activeTab === 'kmeans' && (
            <div className="tab-pane">
              <div className="algo-overview-card">
                <div className="algo-overview-header">
                  <div>
                    <h3 className="algo-name">{kMeans.modelName}</h3>
                    <p className="algo-desc">
                      Unsupervised clustering partitioning regional air profiles into 4 environmental archetypes based on Euclidean multi-pollutant distance.
                    </p>
                  </div>
                  <div className="cluster-tag-box" style={{ borderColor: kMeans.clusterColor }}>
                    <span className="tag-label">Assigned Cluster</span>
                    <span className="tag-name" style={{ color: kMeans.clusterColor }}>
                      {kMeans.clusterId.split(':')[0]}
                    </span>
                  </div>
                </div>

                <div className="cluster-archetype-banner">
                  <span className="arch-title">{kMeans.clusterId}</span>
                  <p className="arch-desc">{kMeans.clusterCharacteristics}</p>
                </div>
              </div>

              <div className="algo-dual-grid">
                {/* Centroid Distance Metrics */}
                <div className="inner-glass-box">
                  <h4 className="box-title">Centroid Metric Deviations</h4>
                  <p className="box-subtitle">Cluster centroid mean vs Global Baseline</p>

                  <div className="centroid-list">
                    {kMeans.centroidsComparison.map((cent, idx) => (
                      <div key={idx} className="centroid-item">
                        <div className="centroid-name">{cent.metric}</div>
                        <div className="centroid-comparison-bars">
                          <div className="bar-group">
                            <span className="bar-val-lbl">Cluster: {cent.clusterValue}</span>
                            <div className="bar-track">
                              <div
                                className="bar-fill cluster-fill"
                                style={{ width: `${Math.min(cent.clusterValue, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="bar-group">
                            <span className="bar-val-lbl">Global Avg: {cent.globalAverage}</span>
                            <div className="bar-track">
                              <div
                                className="bar-fill baseline-fill"
                                style={{ width: `${Math.min(cent.globalAverage, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Spatial Neighborhood Clusters */}
                <div className="inner-glass-box">
                  <h4 className="box-title">Correlated Micro-Clusters</h4>
                  <p className="box-subtitle">Locations sharing identical atmospheric clustering parameters</p>

                  <div className="members-grid">
                    {kMeans.clusterMembers.map((member, i) => (
                      <div key={i} className="member-chip">
                        <CheckCircle2 size={15} className="member-check" />
                        <span>{member}</span>
                      </div>
                    ))}
                  </div>

                  <div className="distance-callout">
                    <span className="dist-label">Euclidean Distance to Centroid:</span>
                    <span className="dist-value">{kMeans.distanceToCentroid} σ</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. APRIORI TAB */}
          {activeTab === 'apriori' && (
            <div className="tab-pane">
              <div className="algo-overview-card">
                <div className="algo-overview-header">
                  <div>
                    <h3 className="algo-name">{apriori.modelName}</h3>
                    <p className="algo-desc">
                      Pattern mining identifying frequent itemsets and high-confidence association rules between micro-climate triggers and pollutant spikes.
                    </p>
                  </div>
                  <div className="apriori-thresholds">
                    <span className="rule-th">Min Support: {apriori.minSupport * 100}%</span>
                    <span className="rule-th">Min Confidence: {apriori.minConfidence * 100}%</span>
                  </div>
                </div>

                <div className="summary-quote-box">
                  <Info size={16} className="quote-icon" />
                  <span>{apriori.patternDiscovery}</span>
                </div>
              </div>

              {/* Association Rules */}
              <div className="inner-glass-box">
                <h4 className="box-title">Discovered Association Rules (IF Condition → THEN Event)</h4>
                <p className="box-subtitle">Ranked by statistical Lift and Confidence</p>

                <div className="rules-cards-list">
                  {apriori.associationRules.map((rule, idx) => (
                    <div key={idx} className="rule-card">
                      <div className="rule-flow">
                        <div className="rule-antecedent">
                          <span className="rule-tag-if">IF</span>
                          <span className="rule-cond-text">{rule.antecedent}</span>
                        </div>
                        <div className="rule-arrow-divider">➔</div>
                        <div className="rule-consequent">
                          <span className="rule-tag-then">THEN</span>
                          <span className="rule-event-text">{rule.consequent}</span>
                        </div>
                      </div>

                      <div className="rule-metrics-bar">
                        <div className="rule-metric">
                          <span className="m-title">Confidence</span>
                          <span className="m-val">{rule.confidence}</span>
                        </div>
                        <div className="rule-metric">
                          <span className="m-title">Support</span>
                          <span className="m-val">{rule.support}</span>
                        </div>
                        <div className="rule-metric">
                          <span className="m-title">Lift Ratio</span>
                          <span className="m-val lift-highlight">{rule.lift}x</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Frequent Itemsets */}
              <div className="inner-glass-box mt-1">
                <h4 className="box-title">Frequent Atmospheric Co-Occurrence Sets</h4>
                <div className="itemsets-chip-list">
                  {apriori.frequentItemsets.map((item, i) => (
                    <div key={i} className="itemset-chip">
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 4. PCA TAB */}
          {activeTab === 'pca' && (
            <div className="tab-pane">
              <div className="algo-overview-card">
                <div className="algo-overview-header">
                  <div>
                    <h3 className="algo-name">{pca.modelName}</h3>
                    <p className="algo-desc">
                      Orthogonal linear transformation reducing 12 continuous multi-sensor features into orthogonal principal axes.
                    </p>
                  </div>
                  <div className="variance-badge-box">
                    <span className="var-label">Cumulative Variance</span>
                    <span className="var-val">{pca.totalVarianceExplained}</span>
                  </div>
                </div>
              </div>

              <div className="algo-dual-grid">
                {/* Principal Components */}
                <div className="inner-glass-box">
                  <h4 className="box-title">Principal Axes & Key Drivers</h4>
                  <p className="box-subtitle">Eigenvector variance decomposition</p>

                  <div className="pca-components-list">
                    {pca.components.map((comp, idx) => (
                      <div key={idx} className="pca-comp-card">
                        <div className="comp-top">
                          <span className="comp-name">{comp.name}</span>
                          <span className="comp-var-pill">{comp.variance} variance</span>
                        </div>
                        <div className="comp-drivers">
                          <span className="drivers-lbl">Eigenvector Weights:</span>
                          <span className="drivers-val">{comp.keyDrivers}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2D Projection Coordinate Space Map */}
                <div className="inner-glass-box">
                  <h4 className="box-title">2D PCA Coordinate Projection</h4>
                  <p className="box-subtitle">PC1 (Pollution Axis) vs PC2 (Ventilation Axis)</p>

                  <div className="pca-plot-canvas">
                    {/* Crosshairs */}
                    <div className="pca-axis-x"></div>
                    <div className="pca-axis-y"></div>
                    <span className="axis-label-x">+ Pollution Load →</span>
                    <span className="axis-label-y">↑ + Ventilation</span>

                    {/* Points */}
                    {pca.scatterPoints.map((pt, i) => {
                      // Map (-4 to +4) to percentage 0% - 100%
                      const leftPct = Math.min(Math.max(((pt.x + 3.5) / 7) * 100, 8), 92);
                      const bottomPct = Math.min(Math.max(((pt.y + 3) / 6) * 100, 8), 92);

                      return (
                        <div
                          key={i}
                          className={`pca-point-node ${pt.active ? 'active-point' : ''}`}
                          style={{ left: `${leftPct}%`, bottom: `${bottomPct}%` }}
                        >
                          <div className="point-dot"></div>
                          <span className="point-caption">{pt.name}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pca-current-coord-tag">
                    <span>{name} Projection Coordinates:</span>
                    <code>PC1: {pca.coordinates.pc1}, PC2: {pca.coordinates.pc2}</code>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <div className="modal-footer-note">
            <span>AERO-DETECTIVE Mining Engine v2.4 • Non-destructive telemetry extraction</span>
          </div>
          <button className="btn-secondary" onClick={onClose}>
            Close Advanced View
          </button>
        </div>
      </div>
    </div>
  );
}
