import React from 'react';

const StatsCard = ({ title, value, icon, subtitle, color = 'primary' }) => {
  return (
    <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <span className="text-secondary small fw-semibold text-uppercase letter-spacing-1">
          {title}
        </span>
        <div
          className={`p-2 rounded-3 bg-${color}-subtle d-flex align-items-center justify-content-center`}
          style={{ width: '42px', height: '42px' }}
        >
          {icon}
        </div>
      </div>
      <h3 className="fw-bold text-dark mb-1">{value}</h3>
      {subtitle && <span className="text-muted small">{subtitle}</span>}
    </div>
  );
};

export default StatsCard;
