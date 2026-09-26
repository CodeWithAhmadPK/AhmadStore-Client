import React from 'react';
import HeroCarousel from '../../components/home/HeroCarousel';
import PromoBanner from '../../components/home/PromoBanner';
import FeaturedCategories from '../../components/home/FeaturedCategories';
import FeaturedProducts from '../../components/home/FeaturedProducts';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';
import { useSettings } from '../../context/SettingsContext';

const HomePage = () => {
  const { settings } = useSettings();

  return (
    <div className="homepage-wrapper">
      <div className="container py-3">
        {/* Dynamic Hero Carousel */}
        <HeroCarousel />

        {/* Trust & Guarantee Promo Banner */}
        <PromoBanner />

        {/* Featured Store Categories */}
        <FeaturedCategories />

        {/* Featured Products Grid */}
        <FeaturedProducts />

        {/* Bottom Banner Call to Action */}
        <div className="my-5 p-5 text-center rounded-4 text-white position-relative overflow-hidden"
             style={{
               background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
               boxShadow: '0 8px 24px rgba(15, 23, 42, 0.15)',
             }}>
          <h2 className="display-6 fw-bold mb-3">Shop With Complete Confidence</h2>
          <p className="lead mx-auto mb-4 text-light opacity-90" style={{ maxWidth: '650px', fontSize: '1.05rem' }}>
            Browse through hundreds of items in electronics, fashion, mobile accessories, kitchenware and general merchandise with doorstep inspection on Cash on Delivery.
          </p>
          <Link to="/shop">
            <Button
              type="primary"
              size="large"
              icon={<ShoppingOutlined />}
              className="btn-accent-store border-0 px-4 fw-semibold"
              style={{ height: '48px' }}
            >
              Explore Full Collection
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
