import api from './api';

export const uploadService = {
  // Admin: Upload images to Cloudinary (multipart/form-data)
  uploadImages: async (files) => {
    const formData = new FormData();
    if (Array.isArray(files)) {
      files.forEach((file) => formData.append('images', file));
    } else {
      formData.append('images', files);
    }

    const response = await api.post('/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Admin: Delete image from Cloudinary
  deleteImage: async (public_id) => {
    const response = await api.delete('/uploads', {
      data: { public_id },
    });
    return response.data;
  },
};

export default uploadService;
