import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  CheckCircle2, 
  RefreshCw, 
  Sparkles, 
  MapPin, 
  Calendar, 
  Printer, 
  AlertTriangle 
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { reportService } from '../services/reportService';
import { useLocationContext } from '../context/LocationContext';
import { SUPPORTED_LOCATIONS, findSupportedLocation } from '../data/supportedLocations';
import './Reports.css';

export default function Reports() {
  const { selectedLocation } = useLocationContext();
  const [location, setLocation] = useState(selectedLocation || 'Coimbatore');
  const [dateRange, setDateRange] = useState('Current Telemetry Cycle');
  const [analysisType, setAnalysisType] = useState('Full Environmental & Machine Learning Audit');
  const [generating, setGenerating] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');

  const supportedList = Object.values(SUPPORTED_LOCATIONS);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError('');
    const match = findSupportedLocation(location);
    if (!match) {
      setError('Location Not Found.');
      return;
    }

    setGenerating(true);
    try {
      const res = await reportService.generateExecutiveReport({ 
        location: match.name, 
        dateRange, 
        analysisType 
      });
      setReport(res);
    } catch (err) {
      setError(err.message || 'Unable to fetch data');
    } finally {
      setGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (!report) return;
    const textContent = `AIR POLLUTION PATTERN MINING & CLASSIFICATION SYSTEM
EXECUTIVE ENVIRONMENTAL AUDIT REPORT
======================================================
Report ID: ${report.reportId}
Station: ${report.location.toUpperCase()} (${report.state}, India)
Audit Cycle: ${report.dateRange}
Generated Date: ${report.generatedAt}
Analysis Type: ${report.analysisType}

EXECUTIVE SUMMARY:
${report.executiveSummary}

KEY AUDIT FINDINGS & RECOMMENDATIONS:
${report.sections.map((s, idx) => `
${idx + 1}. ${s.title}
   - Key Metric: ${s.keyMetric}
   - Assessment: ${s.summary}
`).join('\n')}

======================================================
Generated via Air Pollution ML Platform
Backend Model: Random Forest Classifier, PCA Feature Extraction & Pattern Mining
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
          <span className="page-kicker">MODULE 9: REPORT GENERATION</span>
          <h1 className="page-headline">Environmental Report Generator</h1>
          <p className="page-subtext">
            Compile formal atmospheric health audits, classification digests, and PDF/printable exports powered by backend ML models.
          </p>
        </header>

        {/* Configuration Selector */}
        <form onSubmit={handleGenerate} className="report-config-card glass-card">
          <div className="report-fields-row">
            <div className="rep-field-col">
              <label className="rep-label">TARGET MONITORING STATION</label>
              <select
                className="form-input"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                {supportedList.map(st => (
                  <option key={st.name} value={st.name}>{st.name} ({st.state})</option>
                ))}
              </select>
            </div>

            <div className="rep-field-col">
              <label className="rep-label">AUDIT CYCLE</label>
              <select
                className="form-input"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option>Current Telemetry Cycle</option>
                <option>Past 24 Hours</option>
                <option>Past 7 Days</option>
                <option>Monthly Atmospheric Summary</option>
              </select>
            </div>

            <div className="rep-field-col">
              <label className="rep-label">ANALYSIS SCOPE</label>
              <select
                className="form-input"
                value={analysisType}
                onChange={(e) => setAnalysisType(e.target.value)}
              >
                <option>Full Environmental & Machine Learning Audit</option>
                <option>Particulate Exposure Risk Digest</option>
                <option>Pattern Mining & Spatial Cluster Evaluation</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="auth-error-alert mt-1">
              <AlertTriangle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="rep-submit-row">
            <button type="submit" className="btn-primary btn-generate-rep" disabled={generating}>
              {generating ? (
                <>
                  <RefreshCw size={16} className="spin-icn" />
                  <span>Evaluating Backend ML Models...</span>
                </>
              ) : (
                <>
                  <FileText size={16} />
                  <span>Generate Report Digest</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Generated Report Display */}
        {report && (
          <div className="glass-card generated-report-sheet printable-report">
            <div className="rep-sheet-header">
              <div>
                <span className="rep-sheet-id">ID: {report.reportId}</span>
                <h2 className="rep-sheet-title">{report.location.toUpperCase()} ENVIRONMENTAL AUDIT</h2>
                <span className="rep-sheet-meta">{report.state}, India • Generated on {report.generatedAt}</span>
              </div>

              <div className="rep-sheet-actions">
                <button className="btn-secondary" onClick={handlePrint}>
                  <Printer size={16} />
                  <span>Print / Save PDF</span>
                </button>
                <button className="btn-primary" onClick={handleDownload}>
                  <Download size={16} />
                  <span>Download Report</span>
                </button>
              </div>
            </div>

            {/* Executive Summary */}
            <div className="rep-exec-summary-box">
              <h3 className="rep-subheading">1. Executive Summary</h3>
              <p className="rep-body-text">{report.executiveSummary}</p>
            </div>

            {/* Audit Sections */}
            <div className="rep-sections-grid">
              {report.sections.map((sec, idx) => (
                <div key={idx} className="rep-section-item">
                  <div className="rep-sec-top">
                    <h4 className="rep-sec-title">{sec.title}</h4>
                    {sec.status && <span className="rep-status-tag">{sec.status}</span>}
                  </div>
                  <div className="rep-metric-highlight">{sec.keyMetric}</div>
                  <p className="rep-sec-desc">{sec.summary}</p>
                </div>
              ))}
            </div>

            {/* Signature & Disclaimer */}
            <div className="rep-sheet-footer">
              <div>
                <strong>Validated By:</strong>
                <p>Render ML Backend Pipeline (Random Forest & Pattern Mining Models)</p>
              </div>
              <div className="rep-badge-official">
                <CheckCircle2 size={16} />
                <span>Officially Certified Atmospheric Audit</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
