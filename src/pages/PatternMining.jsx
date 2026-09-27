import React, { useState, useEffect } from 'react';
import { Network, Sparkles, Sliders, Info, ShieldCheck, ArrowRight, AlertTriangle, RefreshCw } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import PatternCard from '../components/PatternCard';
import LoadingAnimation from '../components/LoadingScreen';
import { patternService } from '../services/patternService';
import { useLocationContext } from '../context/LocationContext';
import './PatternMining.css';

export default function PatternMining() {
  const { selectedLocation } = useLocationContext();
  const [patternData, setPatternData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPatternData = () => {
    setLoading(true);
    setError(null);
    patternService.getMinedPatterns(selectedLocation)
      .then((res) => {
        setPatternData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || 'Failed to fetch pattern matching data from Render backend.');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadPatternData();
  }, [selectedLocation]);

  return (
    <div className="dashboard-layout-root">
      <Sidebar />

      <main className="dashboard-main-viewport">
        {/* Page Header */}
        <header className="page-header-block">
          <span className="page-kicker">DEPLOYED BACKEND PATTERN MINER</span>
          <h1 className="page-headline">Pollution Patterns</h1>
          <p className="page-subtext">
            Discover relationships and atmospheric triggers matched by Render backend ML model for <strong>{selectedLocation}</strong>.
          </p>
        </header>

        {loading && (
          <div style={{ padding: '60px 0' }}>
            <LoadingAnimation location={selectedLocation} />
          </div>
        )}

        {error && !loading && (
          <div className="glass-card" style={{ padding: '30px', margin: '20px 0', borderColor: '#EF4444' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#EF4444', marginBottom: '10px' }}>
              <AlertTriangle size={24} />
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Pattern Mining Error</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>{error}</p>
            <button className="btn-primary" onClick={loadPatternData}>
              <RefreshCw size={16} />
              <span>Retry Pattern Mining</span>
            </button>
          </div>
        )}

        {patternData && !loading && !error && (
          <>
            {/* Primary Narrative Insight */}
            <div className="primary-pattern-banner glass-card">
              <div className="pat-banner-icon">
                <Sparkles size={24} className="sparkle-cyan" />
              </div>
              <div className="pat-banner-content">
                <span className="pat-lead-kicker">PRIMARY MINED ASSOCIATION INSIGHT</span>
                <p className="pat-lead-text">{patternData.primaryInsight}</p>
              </div>
            </div>

            {/* Human Readable Pattern Cards */}
            <div className="pattern-cards-stack">
              {patternData?.humanPatterns?.map((pat) => (
                <PatternCard
                  key={pat.id}
                  pattern={pat}
                  rules={patternData.associationRules}
                />
              ))}
            </div>

            {/* Frequent Itemsets Summary Box */}
            <div className="glass-card frequent-itemsets-card">
              <h3 className="section-card-title">Frequent Atmospheric Itemsets</h3>
              <p className="section-card-subtitle">Co-occurring telemetry itemsets matched by backend model</p>

              <div className="itemsets-grid">
                {patternData.frequentItemsets.map((item, i) => (
                  <div key={i} className="itemset-tile">
                    <span className="itemset-code">{item.items}</span>
                    <span className="itemset-support">Support: {(item.support * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
