import React from 'react';
import BrandLogo from './BrandLogo';

/**
 * Reusable FullScreenLoader component for AHMAD STORE
 * 
 * @param {string} message - Primary loader message (default: 'Loading...')
 * @param {string} subtext - Optional secondary reassurance subtext
 * @param {number} logoHeight - Logo height (default: 52)
 */
const FullScreenLoader = ({
  message = 'Loading...',
  subtext = '',
  logoHeight = 52,
}) => {
  return (
    <div
      className="fullscreen-loader-overlay"
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className="fullscreen-loader-card">
        {/* Animated Brand Logo */}
        <div className="fullscreen-loader-logo-wrap">
          <BrandLogo height={logoHeight} />
        </div>

        {/* Branded Blue Circular Ring Spinner */}
        <div className="fullscreen-loader-spinner" aria-hidden="true">
          <div className="spinner-ring" />
        </div>

        {/* Status text */}
        <p className="fullscreen-loader-text">{message}</p>
        {subtext && <p className="fullscreen-loader-subtext">{subtext}</p>}
      </div>
    </div>
  );
};

export default FullScreenLoader;
