import React, { useState } from 'react';
import { FileText, Download, CheckCircle2, RefreshCw, Sparkles, MapPin, Calendar, Layers } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { reportService } from '../services/reportService';
import { useLocationContext } from '../context/LocationContext';
import './Reports.css';

export default function Reports() {
  const { selectedLocation } = useLocationContext();
  const [location, setLocation] = useState(selectedLocation || 'Coimbatore');
  const [dateRange, setDateRange] = useState('Last 7 Days');
  const [analysisType, setAnalysisType] = useState('Full Environmental & Machine Learning Audit');
  const [generating, setGenerating] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [report, setReport] = useState(null);

  const steps = [
    "Collecting multi-station telemetry...",
    "Executing pattern mining & cluster models...",
    "Synthesizing health risk projections...",
    "Finalizing executive report digest..."
  ];

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    setStepIndex(0);

    const timer = setInterval(() => {
      setStepIndex(p => {
        if (p < steps.length - 1) return p + 1;
        return p;
      });
    }, 450);

    try {
      const res = await reportService.generateExecutiveReport({ location, dateRange, analysisType });
      setTimeout(() => {
        clearInterval(timer);
        setReport(res);
        setGenerating(false);
      }, 2000);
    } catch (err) {
      clearInterval(timer);
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    const textContent = `AERO-DETECTIVE EXECUTIVE ENVIRONMENTAL REPORT
======================================================
Report ID: ${report.reportId}
Location: ${report.location.toUpperCase()}
Time Window: ${report.dateRange}
Analysis Type: ${report.analysisType}
Date: ${report.generatedAt}

EXECUTIVE SUMMARY:
${report.executiveSummary}

KEY AUDIT SECTIONS:
${report.sections.map((s, idx) => `
${idx + 1}. ${s.title}
   - Indicator: ${s.keyMetric}
   - Assessment: ${s.summary}
`).join('\n')}

======================================================
Generated via AERO-DETECTIVE Environmental Mining Platform
Tagline: "See What the Air Hides."
`;

    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.reportId}_${report.location}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="dashboard-layout-root">
      <Sidebar />

      <main className="dashboard-main-viewport">
        {/* Page Header */}
        <header className="page-header-block">
          <span className="page-kicker">EXECUTIVE INTELLIGENCE EXPORT</span>
          <h1 className="page-headline">Environmental Report Generator</h1>
          <p className="page-subtext">
            Compile formal atmospheric health and pattern mining audit summaries.
          </p>
        </header>

        {/* Configuration Selector */}
        <form onSubmit={handleGenerate} className="report-config-card glass-card">
          <div className="report-fields-row">
            <div className="rep-field-col">
              <label className="rep-label">TARGET LOCATION</label>
              <div className="rep-input-wrap">
                <MapPin size={16} className="pin-cyan" />
                <input
                  type="text"
                  className="rep-input"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter location name..."
                  required
                />
              </div>
            </div>

            <div className="rep-field-col">
              <label className="rep-label">TELEMETRY WINDOW</label>
              <select
                className="rep-select"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="Last 24 Hours">Last 24 Hours</option>
                <option value="Last 7 Days">Last 7 Days</option>
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="Current Seasonal Quarter">Current Seasonal Quarter</option>
              </select>
            </div>

            <div className="rep-field-col">
              <label className="rep-label">ANALYSIS SCOPE</label>
              <select
                className="rep-select"
                value={analysisType}
                onChange={(e) => setAnalysisType(e.target.value)}
              >
                <option value="Full Environmental & Machine Learning Audit">Full Environmental & ML Audit</option>
                <option value="Public Health & Sensitive Group Advisory">Public Health & Sensitive Group Advisory</option>
                <option value="Atmospheric Inversion & Pattern Mining Study">Atmospheric Inversion & Pattern Study</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn-primary btn-gen-report" disabled={generating}>
            {generating ? (
              <>
                <RefreshCw size={17} className="animate-spin" />
                <span>{steps[stepIndex]}</span>
              </>
            ) : (
              <>
                <Sparkles size={17} />
                <span>Compile Executive Report</span>
              </>
            )}
          </button>
        </form>

        {/* Generated Report Result */}
        {report && (
          <div className="report-output-card glass-card">
            <div className="rep-output-header">
              <div className="rep-header-left">
                <div className="rep-badge-ready">
                  <CheckCircle2 size={16} />
                  <span>REPORT READY</span>
                </div>
                <h2 className="rep-doc-title">
                  Atmospheric Audit: {report.location.toUpperCase()}
                </h2>
                <span className="rep-doc-id">{report.reportId} • Generated {report.generatedAt}</span>
              </div>

              <button className="btn-primary btn-download-rep" onClick={handleDownload}>
                <Download size={16} />
                <span>Download Summary Digest</span>
              </button>
            </div>

            <div className="rep-exec-summary-box">
              <span className="exec-lbl">EXECUTIVE SUMMARY</span>
              <p className="exec-text">{report.executiveSummary}</p>
            </div>

            <div className="rep-sections-list">
              {report.sections.map((sec, i) => (
                <div key={i} className="rep-sec-card">
                  <div className="sec-top">
                    <span className="sec-title">{sec.title}</span>
                    <span className="sec-metric-pill">{sec.keyMetric}</span>
                  </div>
                  <p className="sec-summary">{sec.summary}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
