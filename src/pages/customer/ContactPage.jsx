import React from 'react';
import { Form, Input, Button, message } from 'antd';
import {
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  MessageOutlined,
  SendOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import { useSettings } from '../../context/SettingsContext';

const { TextArea } = Input;

const ContactPage = () => {
  const { settings } = useSettings();
  const [form] = Form.useForm();

  const whatsappNumber = settings.contact?.whatsapp?.replace(/[^0-9]/g, '');

  const onFinish = (values) => {
    message.success(
      `Thank you, ${values.name}! Your message has been received. Our team will get back to you shortly.`
    );
    form.resetFields();
  };

  return (
    <div className="contact-page-wrapper py-3">
      <div className="container" style={{ maxWidth: '950px' }}>
        <Breadcrumbs items={[{ label: 'Contact Us' }]} />

        <div className="text-center mb-4">
          <h1 className="display-6 fw-bold mb-2">We'd Love to Hear From You</h1>
          <p className="text-secondary small">
            Have questions about a product, delivery timeline, or an existing order? Get in touch.
          </p>
        </div>

        <div className="row g-4 mb-5">
          {/* Left: Contact Info & WhatsApp CTA */}
          <div className="col-12 col-md-5">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
              <h5 className="fw-bold mb-3">Direct Contact Channels</h5>

              <div className="d-flex align-items-start gap-3 mb-3">
                <div className="p-2 bg-light rounded-3 text-primary">
                  <PhoneOutlined style={{ fontSize: '1.2rem' }} />
                </div>
                <div>
                  <span className="text-muted small d-block">Phone Support</span>
                  <span className="fw-bold text-dark">{settings.contact?.phone || '+92 300 0000000'}</span>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3 mb-3">
                <div className="p-2 bg-light rounded-3 text-success">
                  <MessageOutlined style={{ fontSize: '1.2rem' }} />
                </div>
                <div>
                  <span className="text-muted small d-block">WhatsApp Support</span>
                  <span className="fw-bold text-dark">{settings.contact?.whatsapp || '+92 300 0000000'}</span>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3 mb-3">
                <div className="p-2 bg-light rounded-3 text-primary">
                  <MailOutlined style={{ fontSize: '1.2rem' }} />
                </div>
                <div>
                  <span className="text-muted small d-block">Email Inquiries</span>
                  <span className="fw-bold text-dark">{settings.contact?.email || 'support@ahmadstore.com'}</span>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3 mb-4">
                <div className="p-2 bg-light rounded-3 text-secondary">
                  <EnvironmentOutlined style={{ fontSize: '1.2rem' }} />
                </div>
                <div>
                  <span className="text-muted small d-block">Store Address</span>
                  <span className="text-dark small">{settings.contact?.address || 'Main Commercial Area, Pakistan'}</span>
                </div>
              </div>

              <hr className="my-2" />

              <div className="d-flex align-items-center gap-2 text-muted small mt-3 mb-3">
                <ClockCircleOutlined />
                <span>Working Hours: Mon – Sat (9:00 AM – 9:00 PM)</span>
              </div>

              {whatsappNumber && (
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                    'Hello AHMAD STORE, I have an inquiry regarding your products.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn w-100 fw-semibold text-white d-flex align-items-center justify-content-center gap-2 mt-auto"
                  style={{ backgroundColor: '#25d366', height: '46px' }}
                >
                  <MessageOutlined /> Instant WhatsApp Chat
                </a>
              )}
            </div>
          </div>

          {/* Right: Message Form */}
          <div className="col-12 col-md-7">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
              <h5 className="fw-bold mb-3">Send a Message</h5>

              <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                  label="Your Name"
                  name="name"
                  rules={[{ required: true, message: 'Please provide your name' }]}
                >
                  <Input placeholder="Ahmad Hassan" size="large" />
                </Form.Item>

                <div className="row g-2">
                  <div className="col-12 col-sm-6">
                    <Form.Item
                      label="Phone Number"
                      name="phone"
                      rules={[{ required: true, message: 'Please enter your phone number' }]}
                    >
                      <Input placeholder="0300 1234567" size="large" />
                    </Form.Item>
                  </div>

                  <div className="col-12 col-sm-6">
                    <Form.Item
                      label="Email Address"
                      name="email"
                      rules={[{ type: 'email', message: 'Please enter a valid email' }]}
                    >
                      <Input placeholder="optional@example.com" size="large" />
                    </Form.Item>
                  </div>
                </div>

                <Form.Item
                  label="Your Inquiry or Message"
                  name="message"
                  rules={[{ required: true, message: 'Please enter your message' }]}
                >
                  <TextArea rows={4} placeholder="How can we assist you with our products or your order?" />
                </Form.Item>

                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  icon={<SendOutlined />}
                  className="btn-accent-store border-0 fw-semibold"
                  style={{ height: '48px' }}
                >
                  Submit Inquiry
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
