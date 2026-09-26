import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import settingsService from '../services/settingsService';

const SettingsContext = createContext(null);

const defaultSettings = {
  storeName: 'AHMAD STORE',
  deliveryFee: 200,
  freeDeliveryThreshold: 0,
  contact: {
    phone: '+92 300 0000000',
    whatsapp: '+92 300 0000000',
    email: 'info@ahmadstore.com',
    address: 'Pakistan',
  },
  socialLinks: {
    facebook: '',
    instagram: '',
    tiktok: '',
    youtube: '',
  },
  heroBanners: [],
  promoBanner: {
    isActive: true,
    text: 'Special Offer: Cash on Delivery Available Across Pakistan!',
    linkUrl: '/shop',
  },
  seasonalPreset: 'Default',
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await settingsService.getSettings();
      if (data && data.settings) {
        setSettings(data.settings);
      }
      setError(null);
    } catch (err) {
      console.warn('Could not load dynamic settings, using defaults:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const value = {
    settings,
    loading,
    error,
    refreshSettings: fetchSettings,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export default SettingsContext;
