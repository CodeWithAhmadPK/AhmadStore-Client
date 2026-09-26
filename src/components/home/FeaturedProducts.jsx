import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Skeleton } from 'antd';
import { ArrowRightOutlined, StarFilled } from '@ant-design/icons';
import ProductCard from '../common/ProductCard';
import productService from '../../services/productService';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchFeatured = async () => {
      try {
        const res = await productService.getFeaturedProducts(8);
        if (isMounted && res?.products && res.products.length > 0) {
          setProducts(res.products);
        } else {
          // If no explicitly featured products found yet, fallback to latest products
          const fallback = await productService.getProducts({ limit: 8 });
          if (isMounted && fallback?.products) {
            setProducts(fallback.products);
          }
        }
      } catch (err) {
        console.warn('Could not load featured products:', err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchFeatured();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="featured-products-section py-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h3 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <span>Featured Products</span>
            <StarFilled style={{ color: '#f59e0b', fontSize: '1.15rem' }} />
          </h3>
          <p className="text-secondary small mb-0">Handpicked trending items across all departments</p>
        </div>
        <Link to="/shop?sort=featured" className="text-primary fw-semibold small text-decoration-none">
          Explore All <ArrowRightOutlined />
        </Link>
      </div>

      {loading ? (
        <div className="row g-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="col-12 col-sm-6 col-lg-3">
              <Skeleton active paragraph={{ rows: 3 }} />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-5 bg-light rounded-3">
          <p className="text-muted mb-3">No products available at the moment.</p>
          <Link to="/shop" className="btn btn-primary-store btn-sm">
            Visit Shop Page
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {products.map((product) => (
            <div key={product._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default FeaturedProducts;
