import api from './api';

export const productService = {
  // Public: Get products with filters, sort, and pagination
  getProducts: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  // Public: Get featured products for homepage
  getFeaturedProducts: async (limit = 8) => {
    const response = await api.get('/products/featured', { params: { limit } });
    return response.data;
  },

  // Public: Get single product by slug or ID
  getProductBySlugOrId: async (slugOrId) => {
    const response = await api.get(`/products/${slugOrId}`);
    return response.data;
  },

  // Public: Get related products
  getRelatedProducts: async (productId, limit = 4) => {
    const response = await api.get(`/products/${productId}/related`, { params: { limit } });
    return response.data;
  },

  // Admin: Get all products with filters & pagination
  getAdminProducts: async (params = {}) => {
    const response = await api.get('/products/admin/all', { params });
    return response.data;
  },

  // Admin: Create product
  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  // Admin: Update product
  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  // Admin: Delete product
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};

export default productService;
