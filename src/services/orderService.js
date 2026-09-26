import api from './api';

export const orderService = {
  // Public: Place guest COD order
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Public: Lookup order by order reference
  lookupOrder: async (orderReference) => {
    const response = await api.get(`/orders/lookup/${orderReference}`);
    return response.data;
  },

  // Admin: Get all orders with search & status filters
  getOrders: async (params = {}) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  // Admin: Get order details by ID
  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Admin: Update order status
  updateOrderStatus: async (id, statusData) => {
    const response = await api.patch(`/orders/${id}/status`, statusData);
    return response.data;
  },
};

export default orderService;
