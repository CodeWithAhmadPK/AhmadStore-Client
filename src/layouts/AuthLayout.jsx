import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import BrandLogo from '../components/common/BrandLogo';

const AuthLayout = () => {
  return (
    <div className="auth-centered-box">
      <div className="auth-card">
        <div className="text-center mb-4">
          <Link to="/" className="text-decoration-none d-inline-block mb-3">
            <BrandLogo height={48} />
          </Link>
          <p className="text-muted small">Single-Store E-Commerce Administration</p>
        </div>

        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
