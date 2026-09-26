import React from 'react';
import Breadcrumbs from '../../components/common/Breadcrumbs';

const TermsPage = () => {
  return (
    <div className="terms-page-wrapper py-3">
      <div className="container" style={{ maxWidth: '850px' }}>
        <Breadcrumbs items={[{ label: 'Terms & Conditions' }]} />

        <div className="card border-0 shadow-sm rounded-4 p-5 mb-5 bg-white">
          <h1 className="fw-bold mb-3">Terms & Conditions</h1>
          <p className="text-muted small mb-4">Last Updated: September 2026</p>

          <div className="text-secondary" style={{ lineHeight: '1.7' }}>
            <h5 className="fw-bold text-dark mt-4 mb-2">1. Introduction & Acceptance</h5>
            <p>
              Welcome to AHMAD STORE. By browsing our website, placing an order, or utilizing our services,
              you agree to be bound by the following Terms & Conditions.
            </p>

            <h5 className="fw-bold text-dark mt-4 mb-2">2. Single-Store Model</h5>
            <p>
              AHMAD STORE is the sole seller of all merchandise featured on this platform. There are no third-party
              or unvetted seller accounts. We take full responsibility for product accuracy, packaging, and dispatch.
            </p>

            <h5 className="fw-bold text-dark mt-4 mb-2">3. Pricing & Stock Availability</h5>
            <p>
              All prices are listed in Pakistani Rupees (PKR). We strive for absolute accuracy in pricing and stock
              counts; however, in the rare event of an unforeseen inventory discrepancy or technical error, we reserve
              the right to cancel or adjust an order with prompt customer notification.
            </p>

            <h5 className="fw-bold text-dark mt-4 mb-2">4. Payment Policy (Cash on Delivery)</h5>
            <p>
              Payment method for Version 1 is strictly Cash on Delivery (COD). Customers are required to have the exact
              cash amount ready upon courier arrival. Full payment must be made to the delivery agent before handover of
              the parcel.
            </p>

            <h5 className="fw-bold text-dark mt-4 mb-2">5. Delivery & Inspection</h5>
            <p>
              Delivery timeframes typically range between 2 to 5 business days depending on customer city and region.
              Please inspect parcel packaging upon delivery. In case of damaged outer packaging, inform the courier agent
              immediately and contact our support team.
            </p>

            <h5 className="fw-bold text-dark mt-4 mb-2">6. Order Cancellation</h5>
            <p className="mb-0">
              Orders may be cancelled before shipment by contacting our customer support team with your unique Order Reference.
              Once an order has been handed over to the courier, standard return protocols apply.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
