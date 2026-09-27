import React, { useState } from 'react';
import { Bell, Check, Trash2, AlertTriangle, ShieldCheck, Info } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import './Notifications.css';

export default function Notifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 'n1',
      title: 'High Particulate Alert',
      location: 'Delhi',
      type: 'danger',
      category: 'System Alert',
      message: 'Station telemetry shows PM2.5 elevated to 98.5 µg/m³ with RSPM crossing 178 µg/m³. Severe atmospheric loading detected.',
      time: '15 minutes ago',
      read: false
    },
    {
      id: 'n2',
      title: 'Pattern Mining Trigger Match',
      location: 'Coimbatore',
      type: 'warning',
      category: 'Personalized Alert',
      message: 'Backend Apriori pattern mining matched Pattern #2 for Coimbatore. Station baseline requires standard urban monitoring.',
      time: '1 hour ago',
      read: false
    },
    {
      id: 'n3',
      title: 'Optimal Baseline Confirmed',
      location: 'Shimla',
      type: 'success',
      category: 'System Notification',
      message: 'Alpine station telemetry indicates pristine air baseline (AQI 28). Minimal particulate concentration.',
      time: '3 hours ago',
      read: true
    },
    {
      id: 'n4',
      title: 'Model Telemetry Synchronization',
      location: 'National Sensor Grid',
      type: 'info',
      category: 'System Notification',
      message: 'Render backend ML models (Random Forest, PCA, Pattern Matching) online and serving live inference.',
      time: '5 hours ago',
      read: true
    }
  ]);

  const [filter, setFilter] = useState('ALL');

  const handleDismiss = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleMarkRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const filtered = notifications.filter(n => {
    if (filter === 'UNREAD') return !n.read;
    if (filter === 'ALERTS') return n.type === 'danger' || n.type === 'warning';
    return true;
  });

  return (
    <div className="dashboard-layout-root">
      <Sidebar />

      <main className="dashboard-main-viewport">
        {/* Page Header */}
        <header className="page-header-block notif-header-flex">
          <div>
            <span className="page-kicker">MODULE 7: NOTIFICATION & ALERT</span>
            <h1 className="page-headline">Notifications & Environmental Alerts</h1>
            <p className="page-subtext">
              Real-time threshold alerts, personalized triggers, and automated system warnings.
            </p>
          </div>

          <div className="notif-top-btns">
            <button className="btn-secondary" onClick={handleMarkAllRead}>
              <Check size={16} />
              <span>Mark All Read</span>
            </button>
          </div>
        </header>

        {/* Filter Pills */}
        <div className="notif-filter-bar">
          <button
            className={`notif-filter-btn ${filter === 'ALL' ? 'active' : ''}`}
            onClick={() => setFilter('ALL')}
          >
            All Notifications ({notifications.length})
          </button>
          <button
            className={`notif-filter-btn ${filter === 'UNREAD' ? 'active' : ''}`}
            onClick={() => setFilter('UNREAD')}
          >
            Unread ({notifications.filter(n => !n.read).length})
          </button>
          <button
            className={`notif-filter-btn ${filter === 'ALERTS' ? 'active' : ''}`}
            onClick={() => setFilter('ALERTS')}
          >
            High Priority Alerts
          </button>
        </div>

        {/* Notification Stack */}
        <div className="notifications-stack-list">
          {filtered.length === 0 ? (
            <div className="empty-notif-box glass-card">
              <Bell size={42} className="empty-bell" />
              <h3>No Notifications in this Category</h3>
              <p>System alerts and threshold notifications will appear here.</p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className={`notif-card glass-card notif-type-${item.type} ${!item.read ? 'unread' : ''}`}
              >
                <div className="notif-icon-box">
                  {item.type === 'danger' ? <AlertTriangle size={20} className="text-danger" /> :
                   item.type === 'warning' ? <AlertTriangle size={20} className="text-warning" /> :
                   item.type === 'success' ? <ShieldCheck size={20} className="text-success" /> :
                   <Info size={20} className="text-cyan" />}
                </div>

                <div className="notif-content-col">
                  <div className="notif-title-row">
                    <span className="notif-category-tag">{item.category}</span>
                    <span className="notif-station-tag">{item.location}</span>
                    <span className="notif-timestamp">{item.time}</span>
                  </div>
                  <h4 className="notif-headline">{item.title}</h4>
                  <p className="notif-body-msg">{item.message}</p>
                </div>

                <div className="notif-actions-col">
                  {!item.read && (
                    <button
                      className="btn-notif-action"
                      onClick={() => handleMarkRead(item.id)}
                      title="Mark as read"
                    >
                      <Check size={16} />
                    </button>
                  )}
                  <button
                    className="btn-notif-action delete"
                    onClick={() => handleDismiss(item.id)}
                    title="Dismiss notification"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
