import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import {
  SafetyCertificateOutlined,
  CheckCircleOutlined,
  RocketOutlined,
  HeartOutlined,
} from '@ant-design/icons';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import BrandLogo from '../../components/common/BrandLogo';
import { useSettings } from '../../context/SettingsContext';

const AboutPage = () => {
  const { settings } = useSettings();

  return (
    <div className="about-page-wrapper py-3">
      <div className="container" style={{ maxWidth: '900px' }}>
        <Breadcrumbs items={[{ label: 'About Us' }]} />

        <div className="card border-0 shadow-sm rounded-4 p-5 mb-5 bg-white">
          <div className="text-center mb-5">
            <div className="mb-3">
              <BrandLogo height={46} />
            </div>
            <span className="badge bg-primary px-3 py-2 text-uppercase fw-bold mb-2">
              Our Story & Commitment
            </span>
            <h1 className="display-6 fw-bold text-dark mb-3">About {settings.storeName || 'AHMAD STORE'}</h1>
            <p className="lead text-secondary mx-auto" style={{ maxWidth: '650px' }}>
              Your comprehensive Pakistani general e-commerce store dedicated to genuine products,
              honest pricing, and hassle-free Cash on Delivery.
            </p>
          </div>

          <div className="row g-4 mb-5">
            <div className="col-12 col-md-6">
              <div className="p-4 bg-light rounded-4 h-100">
                <div className="d-flex align-items-center gap-2 mb-2 text-primary fw-bold">
                  <SafetyCertificateOutlined style={{ fontSize: '1.4rem' }} />
                  <h5 className="mb-0 fw-bold">Authenticity Guaranteed</h5>
                </div>
                <p className="text-secondary small mb-0">
                  Every product listed on AHMAD STORE is thoroughly evaluated for quality, functionality,
                  and durability before dispatching to your doorstep.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="p-4 bg-light rounded-4 h-100">
                <div className="d-flex align-items-center gap-2 mb-2 text-success fw-bold">
                  <CheckCircleOutlined style={{ fontSize: '1.4rem' }} />
                  <h5 className="mb-0 fw-bold">Single-Store Reliability</h5>
                </div>
                <p className="text-secondary small mb-0">
                  We are not an unvetted third-party marketplace. AHMAD STORE is the sole seller and
                  handles every order directly with dedicated customer accountability.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="p-4 bg-light rounded-4 h-100">
                <div className="d-flex align-items-center gap-2 mb-2 text-warning fw-bold">
                  <RocketOutlined style={{ fontSize: '1.4rem' }} />
                  <h5 className="mb-0 fw-bold">Nationwide Cash on Delivery</h5>
                </div>
                <p className="text-secondary small mb-0">
                  Shop with complete peace of mind. We deliver across all major cities and towns in
                  Pakistan, allowing you to pay cash upon parcel handover.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="p-4 bg-light rounded-4 h-100">
                <div className="d-flex align-items-center gap-2 mb-2 text-danger fw-bold">
                  <HeartOutlined style={{ fontSize: '1.4rem' }} />
                  <h5 className="mb-0 fw-bold">Customer-First Service</h5>
                </div>
                <p className="text-secondary small mb-0">
                  Our direct WhatsApp and phone support channels ensure any inquiry, delivery update,
                  or order assistance is handled with prompt care.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center pt-3 border-top">
            <h4 className="fw-bold mb-3">Ready to Start Shopping?</h4>
            <Link to="/shop">
              <Button type="primary" size="large" className="btn-accent-store border-0 px-4">
                Browse Full Catalog
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
