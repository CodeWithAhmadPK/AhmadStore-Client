import React from 'react';
import { Link } from 'react-router-dom';
import { PhoneOutlined, MailOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useSettings } from '../../context/SettingsContext';
import BrandLogo from './BrandLogo';

const Footer = () => {
  const { settings } = useSettings();

  return (
    <footer className="store-footer">
      <div className="container">
        <div className="row g-4">
          {/* Brand Info */}
          <div className="col-12 col-md-4">
            <div className="mb-3">
              <BrandLogo height={38} variant="on-dark" />
            </div>
            <p className="text-secondary small mb-3">
              Your trusted destination for general e-commerce in Pakistan. Quality merchandise
              across fashion, electronics, home essentials, and more with reliable Cash on
              Delivery.
            </p>
            <div className="text-secondary small">
              {settings.contact?.phone && (
                <div className="mb-1">
                  <PhoneOutlined className="me-2 text-primary-light" />
                  {settings.contact.phone}
                </div>
              )}
              {settings.contact?.email && (
                <div className="mb-1">
                  <MailOutlined className="me-2 text-primary-light" />
                  <span className="footer-contact-email">{settings.contact.email}</span>
                </div>
              )}
              {settings.contact?.address && (
                <div>
                  <EnvironmentOutlined className="me-2 text-primary-light" />
                  {settings.contact.address}
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-6 col-md-2 offset-md-1">
            <h5>Quick Links</h5>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/shop">All Products</Link>
              </li>
              <li>
                <Link to="/cart">Shopping Cart</Link>
              </li>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/contact">Contact Support</Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div className="col-6 col-md-2">
            <h5>Customer Care</h5>
            <ul>
              <li>
                <Link to="/privacy-policy">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms">Terms & Conditions</Link>
              </li>
              <li>
                <span className="text-secondary small">Cash on Delivery (COD)</span>
              </li>
              <li>
                <span className="text-secondary small">Fast Delivery Across PK</span>
              </li>
            </ul>
          </div>

          {/* Business Hours & Admin Link */}
          <div className="col-12 col-md-3">
            <h5>Store Hours</h5>
            <p className="text-secondary small mb-2">Monday – Saturday: 9:00 AM – 9:00 PM</p>
            <p className="text-secondary small mb-3">Sunday: 11:00 AM – 6:00 PM</p>
            <div className="pt-2">
              <Link to="/admin/login" className="text-secondary small opacity-75">
                Admin Portal Login &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
          <span>
            &copy; {new Date().getFullYear()} {settings.storeName || 'AHMAD STORE'}. All rights
            reserved.
          </span>
          <span className="text-secondary">Cash on Delivery Nationwide</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
