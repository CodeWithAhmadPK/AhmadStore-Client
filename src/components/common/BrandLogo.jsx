import React, { useState } from 'react';

/**
 * Reusable BrandLogo component for AHMAD STORE
 * 
 * @param {number|string} height - Height of the logo in pixels or CSS string (default: 38)
 * @param {number|string} width - Optional custom width (default: 'auto')
 * @param {string} className - Optional additional CSS class
 * @param {object} style - Optional inline styles
 * @param {'default'|'on-dark'} variant - Display variant ('default' for light backgrounds, 'on-dark' for dark backgrounds)
 * @param {string} alt - Accessibility alt text (default: 'AHMAD STORE')
 */
const BrandLogo = ({
  height = 38,
  width = 'auto',
  className = '',
  style = {},
  variant = 'default',
  alt = 'AHMAD STORE',
}) => {
  const [imgError, setImgError] = useState(false);

  // Logo source path from public/assets
  const logoSrc = '/assets/ahmad-store-logo.png';

  const containerClasses = [
    'brand-logo-container',
    variant === 'on-dark' ? 'variant-on-dark' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Error fallback: If image fails to load, gracefully display clean typography
  if (imgError) {
    return (
      <span className={containerClasses} style={style}>
        <span
          className={`brand-logo-text-fallback ${
            variant === 'on-dark' ? 'text-on-dark' : ''
          }`}
          style={{ fontSize: typeof height === 'number' ? `${Math.max(16, height * 0.45)}px` : '1.25rem' }}
        >
          AHMAD<span>STORE</span>
        </span>
      </span>
    );
  }

  const computedHeight = typeof height === 'number' ? `${height}px` : height;
  const computedWidth = typeof width === 'number' ? `${width}px` : width;

  return (
    <span className={containerClasses} style={style}>
      <img
        src={logoSrc}
        alt={alt}
        className="brand-logo-img"
        style={{
          height: computedHeight,
          width: computedWidth,
          objectFit: 'contain',
        }}
        onError={() => setImgError(true)}
        loading="eager"
      />
    </span>
  );
};

export default BrandLogo;
