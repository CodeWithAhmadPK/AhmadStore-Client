import React from 'react';
import {
  RocketOutlined,
  DollarOutlined,
  SafetyCertificateOutlined,
  CustomerServiceOutlined,
} from '@ant-design/icons';
import { useSettings } from '../../context/SettingsContext';
import formatCurrency from '../../utils/formatCurrency';

const PromoBanner = () => {
  const { settings } = useSettings();

  const freeDeliveryText =
    settings.freeDeliveryThreshold > 0
      ? `Free Delivery on orders over ${formatCurrency(settings.freeDeliveryThreshold)}`
      : 'Standard Delivery at lowest rates';

  const features = [
    {
      icon: <DollarOutlined style={{ fontSize: '1.8rem', color: '#10b981' }} />,
      title: 'Cash on Delivery',
      desc: 'Pay conveniently at your doorstep upon receiving your parcel',
    },
    {
      icon: <RocketOutlined style={{ fontSize: '1.8rem', color: '#2563eb' }} />,
      title: 'Nationwide Shipping',
      desc: freeDeliveryText,
    },
    {
      icon: <SafetyCertificateOutlined style={{ fontSize: '1.8rem', color: '#f59e0b' }} />,
      title: '100% Authentic Goods',
      desc: 'Carefully vetted merchandise across all departments',
    },
    {
      icon: <CustomerServiceOutlined style={{ fontSize: '1.8rem', color: '#0f172a' }} />,
      title: 'Dedicated Support',
      desc: 'Reach us via WhatsApp or Phone for swift order tracking',
    },
  ];

  return (
    <section className="promo-trust-section py-4 my-3">
      <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
        <div className="row g-4">
          {features.map((item, index) => (
            <div key={index} className="col-12 col-sm-6 col-lg-3">
              <div className="d-flex align-items-start gap-3">
                <div className="p-2 rounded-3 bg-light d-flex align-items-center justify-content-center">
                  {item.icon}
                </div>
                <div>
                  <h6 className="fw-bold mb-1 text-dark">{item.title}</h6>
                  <p className="text-secondary small mb-0">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
