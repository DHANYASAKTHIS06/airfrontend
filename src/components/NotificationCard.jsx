import React from 'react';
import { AlertTriangle, Info, CheckCircle2, X, Clock, MapPin } from 'lucide-react';
import './NotificationCard.css';

export default function NotificationCard({ notification, onDismiss, onMarkRead }) {
  if (!notification) return null;

  const getIcon = () => {
    switch (notification.type) {
      case 'danger': return <AlertTriangle size={18} className="notif-icn-rose" />;
      case 'warning': return <AlertTriangle size={18} className="notif-icn-amber" />;
      case 'success': return <CheckCircle2 size={18} className="notif-icn-green" />;
      default: return <Info size={18} className="notif-icn-cyan" />;
    }
  };

  return (
    <div className={`notification-card-glass glass-card ${notification.read ? 'is-read' : 'is-unread'}`}>
      <div className="notif-icon-wrap">
        {getIcon()}
      </div>

      <div className="notif-body">
        <div className="notif-header-row">
          <div className="notif-title-group">
            <span className="notif-title">{notification.title}</span>
            {notification.location && (
              <span className="notif-loc-pill">
                <MapPin size={11} /> {notification.location}
              </span>
            )}
          </div>
          <span className="notif-time">
            <Clock size={12} /> {notification.time}
          </span>
        </div>

        <p className="notif-message">{notification.message}</p>

        <div className="notif-actions-row">
          {!notification.read && onMarkRead && (
            <button className="btn-notif-action" onClick={() => onMarkRead(notification.id)}>
              Mark as read
            </button>
          )}
        </div>
      </div>

      {onDismiss && (
        <button
          className="btn-notif-dismiss"
          onClick={() => onDismiss(notification.id)}
          aria-label="Dismiss notification"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}
