import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Database, 
  Activity, 
  HelpCircle, 
  Mail, 
  Server, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  Search,
  Lock,
  RefreshCw,
  Sliders,
  FileText
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { AuthService } from '../services/authService';
import { SUPPORTED_LOCATIONS } from '../data/supportedLocations';
import './Help.css';

export default function AdminSupport() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(user?.role === 'Administrator' ? 'ADMIN' : 'SUPPORT');
  const [usersList, setUsersList] = useState([]);
  const [searchUser, setSearchUser] = useState('');
  const [backendStatus, setBackendStatus] = useState('Online');

  useEffect(() => {
    setUsersList(AuthService.getAllUsers());
  }, []);

  const faqs = [
    {
      q: "What machine learning models are deployed on the backend?",
      a: "The deployed Render backend runs a Random Forest classifier trained on national air quality monitoring datasets, coupled with Principal Component Analysis (PCA) for spatial feature extraction and Apriori association pattern mining."
    },
    {
      q: "How are air quality hazard ratings calculated?",
      a: "Raw sensory measurements (PM2.5, RSPM/PM10, SPM, NO2, SO2) are fed into the trained supervised Random Forest classifier which outputs exact classification ratings (Good, Moderate, Poor, Very Poor) along with statistical confidence scores."
    },
    {
      q: "How does pattern mining assist in environmental safety?",
      a: "Apriori association algorithms identify co-occurring atmospheric parameters such as low wind velocities and high humidity that trigger particulate accumulation and boundary-layer thermal inversions."
    },
    {
      q: "How is user data and telemetry persisted?",
      a: "Analytical records, historical queries, and user profiles are managed through a unified state management layer with database synchronization and local storage persistence."
    }
  ];

  const filteredUsers = usersList.filter(u => 
    u.name?.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.role?.toLowerCase().includes(searchUser.toLowerCase())
  );

  return (
    <div className="dashboard-layout-root">
      <Sidebar />

      <main className="dashboard-main-viewport">
        {/* Page Header */}
        <header className="page-header-block">
          <span className="page-kicker">MODULE 10: ADMIN & SUPPORT</span>
          <h1 className="page-headline">Administration & Technical Support</h1>
          <p className="page-subtext">
            System administration, user management, telemetry diagnostics, and technical documentation.
          </p>
        </header>

        {/* Tab Selection */}
        <div className="hist-tab-bar mb-2">
          <button
            className={`hist-tab-btn ${activeTab === 'SUPPORT' ? 'active' : ''}`}
            onClick={() => setActiveTab('SUPPORT')}
          >
            <HelpCircle size={16} />
            <span>Support & Documentation</span>
          </button>
          <button
            className={`hist-tab-btn ${activeTab === 'ADMIN' ? 'active' : ''}`}
            onClick={() => setActiveTab('ADMIN')}
          >
            <ShieldCheck size={16} />
            <span>Admin Control Panel</span>
          </button>
        </div>

        {activeTab === 'ADMIN' ? (
          /* Admin Dashboard Section */
          <div className="admin-dashboard-stack">
            {/* System Status Metrics Cards */}
            <div className="admin-kpi-grid">
              <div className="admin-kpi-card glass-card">
                <div className="kpi-top">
                  <span className="kpi-label">Render ML Backend</span>
                  <Server size={20} className="text-cyan" />
                </div>
                <div className="kpi-val text-success">
                  <span className="pulsing-radar-dot"></span> Online & Serving
                </div>
                <span className="kpi-sub">https://airbackend-zfvt.onrender.com</span>
              </div>

              <div className="admin-kpi-card glass-card">
                <div className="kpi-top">
                  <span className="kpi-label">Monitored Stations</span>
                  <Activity size={20} className="text-teal" />
                </div>
                <div className="kpi-val text-teal">{Object.keys(SUPPORTED_LOCATIONS).length} Stations</div>
                <span className="kpi-sub">Active National Sensor Grid</span>
              </div>

              <div className="admin-kpi-card glass-card">
                <div className="kpi-top">
                  <span className="kpi-label">Registered Analysts</span>
                  <Users size={20} className="text-green" />
                </div>
                <div className="kpi-val text-green">{usersList.length} Accounts</div>
                <span className="kpi-sub">Active platform users</span>
              </div>
            </div>

            {/* User Management Table */}
            <div className="glass-card mt-2 p-4">
              <div className="dir-header-flex">
                <div>
                  <h3 className="section-card-title">User Account Registry</h3>
                  <p className="section-card-subtitle">Manage registered analysts, station officers, and admin privileges</p>
                </div>

                <div className="hist-search-input-wrap">
                  <Search size={16} className="search-flt-icon" />
                  <input
                    type="text"
                    className="hist-search-input"
                    placeholder="Search users by name, email or role..."
                    value={searchUser}
                    onChange={(e) => setSearchUser(e.target.value)}
                  />
                </div>
              </div>

              <div className="admin-table-frame mt-1">
                <table className="admin-users-table">
                  <thead>
                    <tr>
                      <th>Analyst Name</th>
                      <th>Email Address</th>
                      <th>Assigned Role</th>
                      <th>Organization</th>
                      <th>Account Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u.id}>
                        <td>
                          <strong>{u.name}</strong>
                        </td>
                        <td>{u.email}</td>
                        <td>
                          <span className={`role-badge ${u.role === 'Administrator' ? 'admin' : 'analyst'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td>{u.organization || 'Atmospheric Cell'}</td>
                        <td>
                          <span className="status-badge active">
                            <CheckCircle2 size={13} /> {u.status || 'Active'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* Support & Documentation Section */
          <div className="support-docs-stack">
            {/* Algorithm Overview Grid */}
            <div className="help-engines-grid">
              <div className="help-engine-card glass-card">
                <Cpu size={24} className="text-cyan mb-sm" />
                <h3 className="he-title">Random Forest Classifier</h3>
                <span className="he-role">Classification Engine</span>
                <p className="he-desc">Trained supervised model deployed on Render backend to classify atmospheric safety ratings.</p>
              </div>

              <div className="help-engine-card glass-card">
                <Database size={24} className="text-teal mb-sm" />
                <h3 className="he-title">K-Means & PCA</h3>
                <span className="he-role">Spatial Partitioning</span>
                <p className="he-desc">Unsupervised spatial clustering mapping stations across principal component coordinates.</p>
              </div>

              <div className="help-engine-card glass-card">
                <Activity size={24} className="text-green mb-sm" />
                <h3 className="he-title">Apriori Mining</h3>
                <span className="he-role">Pattern Association</span>
                <p className="he-desc">Extracts environmental co-occurrence rules and inversion triggers for proactive warnings.</p>
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
                  <h4 className="contact-title">Need Technical Assistance or Station Integration?</h4>
                  <p className="contact-sub">Reach our environmental data engineering team for platform support.</p>
                </div>
              </div>
              <a href="mailto:support@aerodetective.org" className="btn-primary">
                Contact Support Team
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
