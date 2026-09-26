import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Skeleton, Card } from 'antd';
import { AppstoreOutlined, ArrowRightOutlined } from '@ant-design/icons';
import categoryService from '../../services/categoryService';

// Default category visual backgrounds for a clean general ecommerce storefront
const categoryImageMap = {
  'fashion-clothing': 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&auto=format&fit=crop&q=70',
  'shoes-footwear': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=70',
  'mobiles-accessories': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=70',
  'electronics': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=70',
  'computers-accessories': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=70',
  'home-kitchen': 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=70',
  'beauty-personal-care': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=70',
  'watches': 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop&q=70',
  'bags-accessories': 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=70',
  'sports-fitness': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=70',
  'toys-kids': 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600&auto=format&fit=crop&q=70',
  'books-stationery': 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=70',
  'automotive-accessories': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=70',
  'daily-use-general': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=70',
};

const FeaturedCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchCats = async () => {
      try {
        const res = await categoryService.getCategories();
        if (isMounted && res?.categories) {
          setCategories(res.categories);
        }
      } catch (err) {
        console.warn('Could not load categories:', err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchCats();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="featured-categories-section py-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h3 className="fw-bold mb-1">Featured Categories</h3>
          <p className="text-secondary small mb-0">Browse through our most popular departments</p>
        </div>
        <Link to="/shop" className="text-primary fw-semibold small text-decoration-none">
          View All <ArrowRightOutlined />
        </Link>
      </div>

      {loading ? (
        <div className="row g-3">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="col-6 col-md-4 col-lg-2">
              <Skeleton.Button active block style={{ height: '140px', borderRadius: '12px' }} />
            </div>
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-4 text-muted">No categories available at the moment.</div>
      ) : (
        <div className="row g-3">
          {categories.map((cat) => {
            const bgImage =
              cat.image ||
              categoryImageMap[cat.slug] ||
              'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&auto=format&fit=crop&q=70';

            return (
              <div key={cat._id} className="col-6 col-md-4 col-lg-2">
                <Link
                  to={`/category/${cat.slug}`}
                  className="text-decoration-none d-block h-100"
                >
                  <div
                    className="category-card p-3 d-flex flex-column justify-content-end text-white rounded-3 overflow-hidden position-relative"
                    style={{
                      height: '140px',
                      background: `linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(15,23,42,0.85) 100%), url(${bgImage}) center/cover no-repeat`,
                      boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                      transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.08)';
                    }}
                  >
                    <h6 className="fw-bold mb-1 text-white text-truncate">{cat.name}</h6>
                    <span className="small text-light opacity-75" style={{ fontSize: '0.75rem' }}>
                      {cat.subcategories?.length > 0
                        ? `${cat.subcategories.length} subcategories`
                        : 'Explore now'}
                    </span>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default FeaturedCategories;
