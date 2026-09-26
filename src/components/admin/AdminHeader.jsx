import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Tag } from 'antd';
import { LogoutOutlined, GlobalOutlined, UserOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';

const AdminHeader = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <header className="admin-topbar">
      <div className="d-flex align-items-center gap-2">
        <h5 className="page-heading mb-0">Management Portal</h5>
      </div>

      <div className="admin-user-menu">
        <Link to="/" target="_blank" rel="noopener noreferrer">
          <Button icon={<GlobalOutlined />} size="small">
            View Storefront
          </Button>
        </Link>

        {admin && (
          <div className="d-flex align-items-center gap-2">
            <span className="fw-semibold small d-none d-sm-inline">
              <UserOutlined className="me-1" />
              {admin.name}
            </span>
            <Tag color="blue">{admin.role || 'Admin'}</Tag>
          </div>
        )}

        <Button
          danger
          size="small"
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          title="Sign out"
        >
          Sign Out
        </Button>
      </div>
    </header>
  );
};

export default AdminHeader;
