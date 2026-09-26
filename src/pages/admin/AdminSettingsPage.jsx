import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Button,
  Card,
  message,
  Space,
  Divider,
  Skeleton,
} from 'antd';
import {
  SaveOutlined,
  PlusOutlined,
  MinusCircleOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import settingsService from '../../services/settingsService';
import { useSettings } from '../../context/SettingsContext';

const { Option } = Select;

const AdminSettingsPage = () => {
  const [form] = Form.useForm();
  const { refreshSettings } = useSettings();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await settingsService.getSettings();
        if (isMounted && res?.settings) {
          const s = res.settings;
          form.setFieldsValue({
            storeName: s.storeName,
            deliveryFee: s.deliveryFee,
            freeDeliveryThreshold: s.freeDeliveryThreshold,
            seasonalPreset: s.seasonalPreset || 'Default',
            contact: {
              phone: s.contact?.phone,
              whatsapp: s.contact?.whatsapp,
              email: s.contact?.email,
              address: s.contact?.address,
            },
            socialLinks: {
              facebook: s.socialLinks?.facebook,
              instagram: s.socialLinks?.instagram,
              tiktok: s.socialLinks?.tiktok,
              youtube: s.socialLinks?.youtube,
            },
            promoBanner: {
              isActive: s.promoBanner?.isActive !== false,
              text: s.promoBanner?.text,
              linkUrl: s.promoBanner?.linkUrl,
            },
            heroBanners: s.heroBanners || [],
          });
        }
      } catch (err) {
        message.error(err.message || 'Failed to load store settings');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSettings();
    return () => {
      isMounted = false;
    };
  }, [form]);

  const onFinish = async (values) => {
    try {
      setSaving(true);
      await settingsService.updateSettings(values);
      await refreshSettings();
      message.success('Store settings updated successfully');
    } catch (err) {
      message.error(err.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <Skeleton active paragraph={{ rows: 12 }} />
      </div>
    );
  }

  return (
    <div className="admin-settings-wrapper" style={{ maxWidth: '980px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Store Configuration & Content</h3>
          <p className="text-secondary small mb-0">
            Manage delivery rates, contact details, promotional announcements, and hero banners.
          </p>
        </div>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* Store Profile & Shipping Card */}
        <Card title="Store Profile & Delivery Rates" className="shadow-sm border-0 rounded-4 mb-4">
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <Form.Item
                label="Store Name"
                name="storeName"
                rules={[{ required: true, message: 'Store name is required' }]}
              >
                <Input placeholder="AHMAD STORE" size="large" />
              </Form.Item>
            </div>

            <div className="col-12 col-md-6">
              <Form.Item label="Seasonal Preset Theme" name="seasonalPreset">
                <Select size="large">
                  <Option value="Default">Default Collection</Option>
                  <Option value="Summer">Summer Season</Option>
                  <Option value="Eid">Eid Festival</Option>
                  <Option value="Winter">Winter Collection</Option>
                  <Option value="New Arrivals">New Arrivals</Option>
                  <Option value="Clearance">Clearance Sale</Option>
                </Select>
              </Form.Item>
            </div>

            <div className="col-12 col-md-6">
              <Form.Item
                label="Standard Delivery Fee (PKR)"
                name="deliveryFee"
                rules={[{ required: true, message: 'Delivery fee is required' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} size="large" prefix="Rs." />
              </Form.Item>
            </div>

            <div className="col-12 col-md-6">
              <Form.Item
                label="Free Delivery Threshold (PKR)"
                name="freeDeliveryThreshold"
                extra="Orders above this amount qualify for Free Delivery (0 = disabled)"
              >
                <InputNumber min={0} style={{ width: '100%' }} size="large" prefix="Rs." />
              </Form.Item>
            </div>
          </div>
        </Card>

        {/* Contact & Support Card */}
        <Card title="Customer Support & Contact Info" className="shadow-sm border-0 rounded-4 mb-4">
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <Form.Item label="Support Phone Number" name={['contact', 'phone']}>
                <Input placeholder="+92 300 0000000" />
              </Form.Item>
            </div>

            <div className="col-12 col-md-6">
              <Form.Item
                label="WhatsApp Number (With country code)"
                name={['contact', 'whatsapp']}
                extra="Used for customer floating chat button and inquiries"
              >
                <Input placeholder="+92 300 0000000" />
              </Form.Item>
            </div>

            <div className="col-12 col-md-6">
              <Form.Item label="Official Email Address" name={['contact', 'email']}>
                <Input placeholder="support@ahmadstore.com" />
              </Form.Item>
            </div>

            <div className="col-12 col-md-6">
              <Form.Item label="Store Physical Address" name={['contact', 'address']}>
                <Input placeholder="Main Market, Lahore, Pakistan" />
              </Form.Item>
            </div>
          </div>
        </Card>

        {/* Top Promotional Announcement Banner */}
        <Card title="Top Announcement Banner" className="shadow-sm border-0 rounded-4 mb-4">
          <Form.Item
            label="Banner Display Active"
            name={['promoBanner', 'isActive']}
            valuePropName="checked"
          >
            <Switch checkedChildren="Visible" unCheckedChildren="Hidden" />
          </Form.Item>

          <Form.Item label="Announcement Message" name={['promoBanner', 'text']}>
            <Input placeholder="Special Offer: Nationwide Cash on Delivery Across Pakistan!" />
          </Form.Item>

          <Form.Item label="Banner Target Link" name={['promoBanner', 'linkUrl']}>
            <Input placeholder="/shop" />
          </Form.Item>
        </Card>

        {/* Dynamic Hero Banners Card */}
        <Card title="Hero Banners & Slides" className="shadow-sm border-0 rounded-4 mb-4">
          <p className="text-secondary small mb-3">
            Customize the slides featured at the top of the customer homepage.
          </p>

          <Form.List name="heroBanners">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} className="p-3 bg-light rounded-3 mb-3 border">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-bold small">Hero Slide #{name + 1}</span>
                      <MinusCircleOutlined
                        className="text-danger"
                        style={{ fontSize: '1.1rem' }}
                        onClick={() => remove(name)}
                      />
                    </div>

                    <div className="row g-2">
                      <div className="col-12 col-md-6">
                        <Form.Item
                          {...restField}
                          name={[name, 'title']}
                          label="Slide Title"
                          rules={[{ required: true, message: 'Title required' }]}
                          className="mb-2"
                        >
                          <Input placeholder="e.g. Premium Electronics & Gadgets" />
                        </Form.Item>
                      </div>

                      <div className="col-12 col-md-6">
                        <Form.Item
                          {...restField}
                          name={[name, 'subtitle']}
                          label="Subtitle"
                          className="mb-2"
                        >
                          <Input placeholder="Brief promotional description..." />
                        </Form.Item>
                      </div>

                      <div className="col-12 col-md-6">
                        <Form.Item
                          {...restField}
                          name={[name, 'image']}
                          label="Background Image URL"
                          rules={[{ required: true, message: 'Image URL required' }]}
                          className="mb-2"
                        >
                          <Input placeholder="https://images.unsplash.com/..." />
                        </Form.Item>
                      </div>

                      <div className="col-12 col-md-3">
                        <Form.Item
                          {...restField}
                          name={[name, 'linkUrl']}
                          label="Target Link"
                          className="mb-2"
                        >
                          <Input placeholder="/shop" />
                        </Form.Item>
                      </div>

                      <div className="col-12 col-md-3">
                        <Form.Item
                          {...restField}
                          name={[name, 'buttonText']}
                          label="Button Label"
                          className="mb-2"
                        >
                          <Input placeholder="Shop Now" />
                        </Form.Item>
                      </div>
                    </div>
                  </div>
                ))}

                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Add New Hero Slide
                </Button>
              </>
            )}
          </Form.List>
        </Card>

        {/* Submit */}
        <div className="d-flex justify-content-end mb-5">
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            icon={<SaveOutlined />}
            loading={saving}
            className="btn-accent-store border-0 px-4"
          >
            Save All Settings
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AdminSettingsPage;
