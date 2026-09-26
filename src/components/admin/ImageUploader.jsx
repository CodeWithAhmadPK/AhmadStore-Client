import React, { useState } from 'react';
import { Upload, Button, message, Input, Space, Tag } from 'antd';
import {
  UploadOutlined,
  DeleteOutlined,
  StarOutlined,
  StarFilled,
  LinkOutlined,
} from '@ant-design/icons';
import uploadService from '../../services/uploadService';

const ImageUploader = ({ value = [], onChange, maxImages = 6 }) => {
  const [uploading, setUploading] = useState(false);
  const [directUrl, setDirectUrl] = useState('');

  // Handle direct file upload through backend Cloudinary API
  const handleCustomUpload = async ({ file, onSuccess, onError }) => {
    try {
      setUploading(true);
      const res = await uploadService.uploadImages(file);
      if (res?.success && res.images && res.images.length > 0) {
        const newImages = res.images.map((img, idx) => ({
          url: img.url,
          public_id: img.public_id || '',
          isPrimary: value.length === 0 && idx === 0,
        }));

        const updated = [...value, ...newImages].slice(0, maxImages);
        onChange?.(updated);
        message.success('Image uploaded to Cloudinary successfully');
        onSuccess?.('ok');
      } else {
        throw new Error(res?.message || 'Upload failed');
      }
    } catch (err) {
      console.warn('Cloudinary upload error:', err.message);
      message.error(err.message || 'Image upload failed. You can also paste an image URL directly.');
      onError?.(err);
    } finally {
      setUploading(false);
    }
  };

  // Add image by direct URL (e.g. for testing or existing media)
  const handleAddDirectUrl = () => {
    if (!directUrl.trim()) return;
    const newImage = {
      url: directUrl.trim(),
      public_id: '',
      isPrimary: value.length === 0,
    };
    const updated = [...value, newImage].slice(0, maxImages);
    onChange?.(updated);
    setDirectUrl('');
    message.success('Image added');
  };

  const handleRemove = async (indexToRemove) => {
    const imgToRemove = value[indexToRemove];
    if (imgToRemove?.public_id) {
      try {
        await uploadService.deleteImage(imgToRemove.public_id);
      } catch (err) {
        console.warn('Could not delete image from Cloudinary:', err.message);
      }
    }

    const updated = value.filter((_, idx) => idx !== indexToRemove);
    // If we removed the primary image, make the first remaining image primary
    if (imgToRemove?.isPrimary && updated.length > 0) {
      updated[0].isPrimary = true;
    }
    onChange?.(updated);
  };

  const handleSetPrimary = (indexToPrimary) => {
    const updated = value.map((img, idx) => ({
      ...img,
      isPrimary: idx === indexToPrimary,
    }));
    onChange?.(updated);
  };

  return (
    <div className="image-uploader-container">
      {/* Upload Controls */}
      <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
        <Upload
          customRequest={handleCustomUpload}
          showUploadList={false}
          disabled={value.length >= maxImages || uploading}
          accept="image/*"
        >
          <Button
            icon={<UploadOutlined />}
            loading={uploading}
            disabled={value.length >= maxImages}
          >
            Upload via Cloudinary
          </Button>
        </Upload>

        <span className="text-muted small">or</span>

        <Space.Compact style={{ maxWidth: '380px', width: '100%' }}>
          <Input
            placeholder="Paste direct Image URL (https://...)"
            prefix={<LinkOutlined className="text-muted" />}
            value={directUrl}
            onChange={(e) => setDirectUrl(e.target.value)}
            onPressEnter={handleAddDirectUrl}
            disabled={value.length >= maxImages}
          />
          <Button onClick={handleAddDirectUrl} disabled={value.length >= maxImages || !directUrl.trim()}>
            Add
          </Button>
        </Space.Compact>

        <span className="text-muted small ms-auto">
          {value.length} of {maxImages} images
        </span>
      </div>

      {/* Thumbnails Grid */}
      {value.length > 0 && (
        <div className="d-flex gap-3 flex-wrap">
          {value.map((img, idx) => (
            <div
              key={idx}
              className="position-relative border rounded-3 overflow-hidden bg-light p-1"
              style={{ width: '110px', height: '110px' }}
            >
              <img
                src={img.url}
                alt={`Product image ${idx + 1}`}
                className="w-100 h-100 rounded-2"
                style={{ objectFit: 'cover' }}
              />

              {/* Primary Star Indicator */}
              <button
                type="button"
                className="btn btn-sm position-absolute top-0 start-0 m-1 p-0 border-0"
                onClick={() => handleSetPrimary(idx)}
                title={img.isPrimary ? 'Primary Image' : 'Set as Primary'}
              >
                {img.isPrimary ? (
                  <Tag color="gold" className="m-0 px-1 py-0 small fw-bold">
                    <StarFilled /> Primary
                  </Tag>
                ) : (
                  <Tag className="m-0 px-1 py-0 small bg-white opacity-75">
                    <StarOutlined />
                  </Tag>
                )}
              </button>

              {/* Remove Button */}
              <button
                type="button"
                className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 p-0 rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '22px', height: '22px' }}
                onClick={() => handleRemove(idx)}
                title="Remove image"
              >
                <DeleteOutlined style={{ fontSize: '11px' }} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
