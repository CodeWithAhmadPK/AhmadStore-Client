import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import BrandLogo from '../common/BrandLogo';
import {
  DashboardOutlined,
  ShoppingOutlined,
  PlusCircleOutlined,
  AppstoreOutlined,
  OrderedListOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';

const AdminSidebar = ({ isOpen = false, onClose }) => {
  return (
    <aside className={`admin-sidebar${isOpen ? ' is-open' : ''}`} aria-label="Admin navigation">
      <div className="sidebar-brand d-flex align-items-center justify-content-between">
        <Link to="/admin" className="text-decoration-none">
          <BrandLogo height={30} variant="on-dark" />
        </Link>
        <span className="badge bg-secondary-subtle text-light small fw-normal ms-2">Admin</span>
        <button
          type="button"
          className="sidebar-mobile-close"
          onClick={onClose}
          aria-label="Close admin navigation"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <nav className="sidebar-nav" onClick={onClose}>
        <div className="nav-group-title">Overview</div>
        <NavLink
          to="/admin"
          end
          className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
        >
          <DashboardOutlined className="icon" />
          <span>Dashboard</span>
        </NavLink>

        <div className="nav-group-title mt-3">Catalog</div>
        <NavLink
          to="/admin/products"
          end
          className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
        >
          <ShoppingOutlined className="icon" />
          <span>All Products</span>
        </NavLink>
        <NavLink
          to="/admin/products/new"
          className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
        >
          <PlusCircleOutlined className="icon" />
          <span>Add Product</span>
        </NavLink>
        <NavLink
          to="/admin/categories"
          className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
        >
          <AppstoreOutlined className="icon" />
          <span>Categories</span>
        </NavLink>

        <div className="nav-group-title mt-3">Sales</div>
        <NavLink
          to="/admin/orders"
          className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
        >
          <OrderedListOutlined className="icon" />
          <span>Orders</span>
        </NavLink>

        <div className="nav-group-title mt-3">Administration</div>
        <NavLink
          to="/admin/settings"
          className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
        >
          <SettingOutlined className="icon" />
          <span>Store Settings</span>
        </NavLink>
        <NavLink
          to="/admin/profile"
          className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
        >
          <UserOutlined className="icon" />
          <span>My Profile</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div>Single-Store E-Commerce</div>
        <div className="text-muted small">v1.0.0</div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
