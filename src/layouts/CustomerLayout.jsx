import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useSettings } from '../context/SettingsContext';

const CustomerLayout = () => {
  const { settings } = useSettings();
  const whatsappNumber = settings.contact?.whatsapp?.replace(/[^0-9]/g, '');

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <main className="flex-grow-1 page-container">
        <Outlet />
      </main>

      <Footer />

      {/* Floating WhatsApp Quick Action Button */}
      {whatsappNumber && (
        <a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="floating-whatsapp-btn"
          aria-label="Chat on WhatsApp"
        >
          💬
        </a>
      )}
    </div>
  );
};

export default CustomerLayout;
