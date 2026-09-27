import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Input, Drawer, Button, Badge } from 'antd';
import {
  ShoppingCartOutlined,
  SearchOutlined,
  PhoneOutlined,
  MenuOutlined,
  AppstoreOutlined,
  CloseOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';
import categoryService from '../../services/categoryService';
import BrandLogo from './BrandLogo';

const Navbar = () => {
  const { itemCount } = useCart();
  const { settings } = useSettings();
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const loadCategories = async () => {
      try {
        const res = await categoryService.getCategories();
        if (isMounted && res?.categories) {
          setCategories(res.categories);
        }
      } catch (err) {
        console.warn('Failed to fetch categories for navbar:', err.message);
      }
    };
    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Top Announcement Bar */}
      {settings.promoBanner?.isActive && settings.promoBanner?.text && (
        <div
          className="bg-dark text-white text-center py-1 px-3 d-flex justify-content-center align-items-center gap-3 flex-wrap"
          style={{ fontSize: '0.82rem', letterSpacing: '0.2px' }}
        >
          <span>{settings.promoBanner.text}</span>
          {settings.contact?.phone && (
            <span className="d-none d-md-inline text-secondary">
              <PhoneOutlined className="me-1 text-primary-light" />
              {settings.contact.phone}
            </span>
          )}
        </div>
      )}

      {/* Main Navbar */}
      <header className="store-navbar py-2">
        <div className="container d-flex align-items-center justify-content-between gap-3">
          {/* Mobile Menu Toggle Button */}
          <button
            className="btn btn-sm btn-light d-lg-none p-1 border-0"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Toggle navigation menu"
          >
            <MenuOutlined style={{ fontSize: '1.25rem' }} />
          </button>

          {/* Brand Logo */}
          <Link to="/" className="brand-logo d-inline-flex align-items-center text-decoration-none">
            <BrandLogo height={38} />
          </Link>

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearch} className="nav-search-container d-none d-lg-block">
            <Input
              placeholder="Search in electronics, fashion, mobile accessories, home..."
              prefix={<SearchOutlined className="text-muted" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
              size="middle"
              className="rounded-pill"
            />
          </form>

          {/* Right Action Links */}
          <div className="d-flex align-items-center gap-3">
            <Link
              to="/shop"
              className="text-dark fw-semibold d-none d-md-inline text-decoration-none"
            >
              Shop All
            </Link>

            <Link
              to="/cart"
              className="cart-badge-btn text-decoration-none"
              aria-label="View shopping cart"
            >
              <ShoppingCartOutlined style={{ fontSize: '1.25rem' }} />
              <span className="d-none d-sm-inline">Cart</span>
              <span className="cart-count">{itemCount}</span>
            </Link>
          </div>
        </div>

        {/* Mobile Search Row */}
        <div className="container d-lg-none mt-2">
          <form onSubmit={handleSearch}>
            <Input
              placeholder="Search products across all categories..."
              prefix={<SearchOutlined className="text-muted" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
              size="middle"
              className="rounded-pill"
            />
          </form>
        </div>

        {/* Horizontal Category Strip (Desktop) */}
        {categories.length > 0 && (
          <nav className="category-strip d-none d-md-block mt-2">
            <div className="container d-flex align-items-center gap-1">
              <Link
                to="/shop"
                className={`category-link ${location.pathname === '/shop' ? 'active' : ''}`}
              >
                All Products
              </Link>
              {categories.slice(0, 8).map((cat) => (
                <Link
                  key={cat._id}
                  to={`/category/${cat.slug}`}
                  className={`category-link ${
                    location.pathname === `/category/${cat.slug}` ? 'active' : ''
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
              {categories.length > 8 && (
                <Link to="/shop" className="category-link text-primary fw-bold">
                  More Categories &rarr;
                </Link>
              )}
            </div>
          </nav>
        )}
      </header>

      {/* Mobile Navigation Drawer */}
      <Drawer
        title={
          <div className="d-flex justify-content-between align-items-center">
            <BrandLogo height={28} />
          </div>
        }
        placement="left"
        width="min(378px, 100vw)"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        styles={{ body: { padding: 0 } }}
      >
        <div className="p-3 bg-light border-bottom">
          <Link
            to="/shop"
            className="btn btn-primary-store w-100 d-flex justify-content-center align-items-center gap-2"
          >
            <AppstoreOutlined />
            <span>Browse All Products</span>
          </Link>
        </div>

        <div className="p-3">
          <h6 className="text-muted small text-uppercase fw-bold mb-2">Shop By Category</h6>
          <div className="list-group list-group-flush">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/category/${cat.slug}`}
                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-2 px-1 border-0"
              >
                <span>{cat.name}</span>
                <RightOutlined style={{ fontSize: '0.75rem' }} className="text-muted" />
              </Link>
            ))}
          </div>

          <hr className="my-3" />

          <h6 className="text-muted small text-uppercase fw-bold mb-2">Quick Links</h6>
          <div className="list-group list-group-flush">
            <Link
              to="/about"
              className="list-group-item list-group-item-action py-2 px-1 border-0 text-secondary"
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className="list-group-item list-group-item-action py-2 px-1 border-0 text-secondary"
            >
              Contact Support
            </Link>
            <Link
              to="/privacy-policy"
              className="list-group-item list-group-item-action py-2 px-1 border-0 text-secondary"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="list-group-item list-group-item-action py-2 px-1 border-0 text-secondary"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default Navbar;
