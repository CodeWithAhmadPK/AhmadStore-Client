import api from './api';

export const settingsService = {
  // Public: Get store settings (delivery fee, contact, hero, promo banner)
  getSettings: async () => {
    const response = await api.get('/settings');
    return response.data;
  },

  // Admin: Update store settings
  updateSettings: async (settingsData) => {
    const response = await api.put('/settings', settingsData);
    return response.data;
  },
};

export default settingsService;
