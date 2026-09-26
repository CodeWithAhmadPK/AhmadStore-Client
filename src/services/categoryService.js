import api from './api';

export const categoryService = {
  // Public: Get active categories
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  // Admin: Get all categories including inactive with product counts
  getAdminCategories: async () => {
    const response = await api.get('/categories/admin');
    return response.data;
  },

  // Public: Get category by slug or ID
  getCategoryByIdOrSlug: async (idOrSlug) => {
    const response = await api.get(`/categories/${idOrSlug}`);
    return response.data;
  },

  // Admin: Create category
  createCategory: async (categoryData) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },

  // Admin: Update category
  updateCategory: async (id, categoryData) => {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  // Admin: Delete category safely
  deleteCategory: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};

export default categoryService;
