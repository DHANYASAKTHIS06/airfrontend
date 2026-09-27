import React from 'react';
import { HelpCircle, Cpu, Network, Database, GitBranch, ShieldCheck, Mail, ArrowRight } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import './Help.css';

export default function Help() {
  const faqs = [
    {
      q: "What is Data Abstraction in AERO-DETECTIVE?",
      a: "Instead of bombarding you with 15 raw sensor numbers (e.g. 68.4 µg/m³ PM2.5, 38.6 ppb NO2), AERO-DETECTIVE synthesizes telemetry into 3 essential human decisions: Air Quality Category (POOR), Primary Concern (Particulate Dust), and Actionable Health Guidance (Reduce outdoor exertion)."
    },
    {
      q: "How does Random Forest classify air quality?",
      a: "Random Forest combines 100 decorrelated decision trees. Each tree evaluates meteorological dispersion and pollutant thresholds. The ensemble vote prevents localized baseline distortions from triggering false alarms."
    },
    {
      q: "What are Apriori Association Rules?",
      a: "Apriori mines co-occurring environmental triggers. For instance, it identifies that when wind velocity drops below 6 km/h and humidity exceeds 65%, particulate levels spike with 89% confidence and a 2.34x statistical lift."
    },
    {
      q: "Does association imply causation?",
      a: "No. In data mining, association rules reveal statistical co-occurrence patterns in historical sensor logs, providing predictive warnings rather than proof of univariate direct causation."
    }
  ];

  return (
    <div className="dashboard-layout-root">
      <Sidebar />

      <main className="dashboard-main-viewport">
        {/* Header */}
        <header className="page-header-block">
          <span className="page-kicker">KNOWLEDGE BASE & METHODOLOGY</span>
          <h1 className="page-headline">Help & Architectural Documentation</h1>
          <p className="page-subtext">
            Understanding the machine learning algorithms, telemetry indices, and data abstraction principles.
          </p>
        </header>

        {/* Algorithm Overview Grid */}
        <div className="help-engines-grid">
          <div className="help-engine-card glass-card">
            <Cpu size={24} className="text-cyan mb-sm" />
            <h3 className="he-title">Random Forest</h3>
            <span className="he-role">Classification Module</span>
            <p className="he-desc">Supervised ensemble aggregating 100 decision trees to classify overall air hazard categories.</p>
          </div>

          <div className="help-engine-card glass-card">
            <Database size={24} className="text-teal mb-sm" />
            <h3 className="he-title">K-Means</h3>
            <span className="he-role">Spatial Partitioning</span>
            <p className="he-desc">Unsupervised clustering grouping stations into clean, moderate, or high-pollution archetypes.</p>
          </div>

          <div className="help-engine-card glass-card">
            <Network size={24} className="text-green mb-sm" />
            <h3 className="he-title">Apriori Miner</h3>
            <span className="he-role">Pattern Association</span>
            <p className="he-desc">Discovers temporal and climate trigger rules (Support, Confidence, Lift) for proactive forecasting.</p>
          </div>

          <div className="help-engine-card glass-card">
            <GitBranch size={24} className="text-blue mb-sm" />
            <h3 className="he-title">PCA</h3>
            <span className="he-role">Feature Reduction</span>
            <p className="he-desc">Compresses 12 continuous sensor dimensions into 2D principal variance axes.</p>
          </div>
        </div>

        {/* FAQ Stack */}
        <div className="help-faq-card glass-card">
          <h3 className="faq-main-title">Frequently Asked Questions</h3>
          <div className="faq-list">
            {faqs.map((faq, i) => (
              <div key={i} className="faq-item">
                <h4 className="faq-q">{faq.q}</h4>
                <p className="faq-a">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Support Contact */}
        <div className="help-contact-banner glass-card">
          <div className="contact-left">
            <Mail size={22} className="text-cyan" />
            <div>
              <h4 className="contact-title">Need Technical Assistance or Station Onboarding?</h4>
              <p className="contact-sub">Reach our environmental data engineering lab for telemetry integration.</p>
            </div>
          </div>
          <a href="mailto:support@aerodetective.org" className="btn-primary">
            Contact Support Lab
          </a>
        </div>
      </main>
    </div>
  );
}
