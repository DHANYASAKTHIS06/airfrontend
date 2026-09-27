import React, { useState, useEffect } from 'react';
import { Database, Layers, Sparkles, AlertTriangle, RefreshCw } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ClusterChart from '../components/ClusterChart';
import LoadingAnimation from '../components/LoadingScreen';
import { clusteringService } from '../services/clusteringService';
import './Clustering.css';

export default function Clustering() {
  const [clusterData, setClusterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadClusterData = () => {
    setLoading(true);
    setError(null);
    clusteringService.getClustersData()
      .then((res) => {
        setClusterData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || 'Failed to fetch cluster data from Render backend.');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadClusterData();
  }, []);

  return (
    <div className="dashboard-layout-root">
      <Sidebar />

      <main className="dashboard-main-viewport">
        {/* Page Header */}
        <header className="page-header-block">
          <span className="page-kicker">K-MEANS & PCA SPATIAL PARTITIONING</span>
          <h1 className="page-headline">Pollution Clusters</h1>
          <p className="page-subtext">
            Unsupervised spatial grouping discovering atmospheric archetypes using real PCA components from Render backend.
          </p>
        </header>

        {loading && (
          <div style={{ padding: '60px 0' }}>
            <LoadingAnimation location="Spatial Network" />
          </div>
        )}

        {error && !loading && (
          <div className="glass-card" style={{ padding: '30px', margin: '20px 0', borderColor: '#EF4444' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#EF4444', marginBottom: '10px' }}>
              <AlertTriangle size={24} />
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Cluster Mining Error</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>{error}</p>
            <button className="btn-primary" onClick={loadClusterData}>
              <RefreshCw size={16} />
              <span>Retry Clustering Pipeline</span>
            </button>
          </div>
        )}

        {clusterData && !loading && !error && (
          <>
            {/* 2D Interactive Cluster Visualization */}
            <ClusterChart clusterData={clusterData} />

            {/* Detailed Cluster Archetype Breakdown */}
            <div className="clusters-grid-detail">
              {clusterData.clusters.map((c) => (
                <div key={c.id} className="cluster-detail-card glass-card">
                  <div className="c-detail-top">
                    <span className="c-detail-tag" style={{ color: c.color, backgroundColor: `${c.color}15`, borderColor: `${c.color}40` }}>
                      {c.label}
                    </span>
                    <h3 className="c-detail-name">{c.name}</h3>
                  </div>

                  <p className="c-detail-desc">{c.characteristics}</p>

                  <div className="c-detail-zones">
                    <span className="z-lbl">Represented Stations:</span>
                    <div className="z-chips">
                      {c.sampleLocations.map((loc, i) => (
                        <span key={i} className="z-chip">{loc}</span>
                      ))}
                    </div>
                  </div>

                  <div className="c-detail-rec">
                    <span className="rec-lbl">General Advisory:</span>
                    <p className="rec-val">{c.recommendation}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
