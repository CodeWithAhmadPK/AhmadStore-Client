import React from 'react';
import Breadcrumbs from '../../components/common/Breadcrumbs';

const PrivacyPolicyPage = () => {
  return (
    <div className="privacy-page-wrapper py-3">
      <div className="container" style={{ maxWidth: '850px' }}>
        <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />

        <div className="card border-0 shadow-sm rounded-4 p-5 mb-5 bg-white">
          <h1 className="fw-bold mb-3">Privacy Policy</h1>
          <p className="text-muted small mb-4">Last Updated: September 2026</p>

          <div className="text-secondary" style={{ lineHeight: '1.7' }}>
            <h5 className="fw-bold text-dark mt-4 mb-2">1. Information We Collect</h5>
            <p>
              AHMAD STORE operates strictly as a single-store general e-commerce retailer with guest checkout.
              We collect only the minimum required information necessary to fulfill and deliver your orders:
            </p>
            <ul>
              <li><strong>Contact Information:</strong> Customer full name, mobile phone number, and optional email address.</li>
              <li><strong>Delivery Information:</strong> Complete street address, city, and delivery notes.</li>
              <li><strong>Order Data:</strong> Items, quantities, and chosen product variants.</li>
            </ul>

            <h5 className="fw-bold text-dark mt-4 mb-2">2. How We Use Your Information</h5>
            <p>Your details are used exclusively for:</p>
            <ul>
              <li>Packaging, processing, and dispatching your parcels.</li>
              <li>Courier coordination and delivery updates via SMS/phone.</li>
              <li>Customer service assistance regarding your order reference.</li>
            </ul>

            <h5 className="fw-bold text-dark mt-4 mb-2">3. Zero Account Passwords Stored</h5>
            <p>
              Because our customer checkout is entirely guest-based (V1), we do not store customer login passwords
              or collect sensitive credit card details on our servers. All transactions are settled via Cash on Delivery (COD).
            </p>

            <h5 className="fw-bold text-dark mt-4 mb-2">4. Third-Party Sharing</h5>
            <p>
              We only share your delivery name, address, and phone number with our verified logistics and courier
              partners to facilitate physical parcel delivery. We never sell, rent, or trade customer information to
              advertisers or external marketing firms.
            </p>

            <h5 className="fw-bold text-dark mt-4 mb-2">5. Contact Us</h5>
            <p className="mb-0">
              For any questions regarding our privacy practices or data handling, please contact us through our Contact Support page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
