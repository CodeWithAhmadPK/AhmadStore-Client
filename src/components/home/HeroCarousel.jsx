import React from 'react';
import { Carousel, Button } from 'antd';
import { Link } from 'react-router-dom';
import { ShoppingOutlined, RightOutlined } from '@ant-design/icons';
import { useSettings } from '../../context/SettingsContext';

const defaultBanners = [
  {
    title: 'Top Tier Electronics & Gadgets',
    subtitle: 'Explore headphones, smartphones, smart accessories and gaming peripherals with Cash on Delivery.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1400&auto=format&fit=crop&q=80',
    linkUrl: '/shop',
    buttonText: 'Shop Electronics',
  },
  {
    title: 'Modern Fashion & Apparel',
    subtitle: 'Upgrade your daily wardrobe with trending casual wear, eastern clothing, and footwear.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&auto=format&fit=crop&q=80',
    linkUrl: '/shop',
    buttonText: 'Explore Fashion',
  },
  {
    title: 'Home & Kitchen Essentials',
    subtitle: 'Quality kitchenware, home decor, and organizers crafted for everyday convenience.',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1400&auto=format&fit=crop&q=80',
    linkUrl: '/shop',
    buttonText: 'Shop Home Goods',
  },
];

const HeroCarousel = () => {
  const { settings } = useSettings();

  const banners =
    settings.heroBanners && settings.heroBanners.length > 0
      ? settings.heroBanners.filter((b) => b.isActive !== false)
      : defaultBanners;

  const activeBanners = banners.length > 0 ? banners : defaultBanners;

  return (
    <div className="hero-slider-section mb-4">
      <Carousel autoplay autoplaySpeed={5000} effect="fade" pauseOnHover>
        {activeBanners.map((banner, index) => (
          <div key={index}>
            <div
              className="hero-slide-item d-flex align-items-center"
              style={{
                background: `linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.65)), url(${banner.image || defaultBanners[index % defaultBanners.length].image}) center/cover no-repeat`,
                minHeight: '440px',
                padding: '3.5rem 1.5rem',
                borderRadius: '16px',
                color: '#ffffff',
              }}
            >
              <div className="container text-center text-md-start" style={{ maxWidth: '750px' }}>
                <span className="badge bg-primary px-3 py-2 text-uppercase mb-3 fw-bold" style={{ letterSpacing: '1px' }}>
                  {settings.seasonalPreset && settings.seasonalPreset !== 'Default'
                    ? `${settings.seasonalPreset} Collection`
                    : 'Special Offer'}
                </span>
                <h1 className="display-5 fw-bold text-white mb-3" style={{ lineHeight: '1.2' }}>
                  {banner.title}
                </h1>
                <p className="lead text-light opacity-90 mb-4" style={{ fontSize: '1.1rem' }}>
                  {banner.subtitle}
                </p>
                <div className="d-flex gap-3 justify-content-center justify-content-md-start">
                  <Link to={banner.linkUrl || '/shop'}>
                    <Button
                      type="primary"
                      size="large"
                      icon={<ShoppingOutlined />}
                      className="btn-accent-store border-0 px-4 fw-semibold"
                      style={{ height: '48px', fontSize: '1rem' }}
                    >
                      {banner.buttonText || 'Shop Now'}
                    </Button>
                  </Link>
                  <Link to="/shop">
                    <Button
                      size="large"
                      ghost
                      className="text-white px-4 fw-semibold"
                      style={{ height: '48px', fontSize: '1rem' }}
                    >
                      Browse All <RightOutlined style={{ fontSize: '0.8rem' }} />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default HeroCarousel;
