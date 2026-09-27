import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Result } from 'antd';
import { ShoppingOutlined, HomeOutlined } from '@ant-design/icons';

const NotFoundPage = () => {
  return (
    <div className="container py-5 text-center">
      <div className="not-found-card card border-0 shadow-sm rounded-4 p-5 bg-white mx-auto" style={{ maxWidth: '600px' }}>
        <Result
          status="404"
          title="404 - Page Not Found"
          subTitle="The page or product you are looking for might have been moved, renamed, or is temporarily unavailable."
          extra={[
            <Link to="/" key="home">
              <Button type="primary" icon={<HomeOutlined />}>
                Go to Homepage
              </Button>
            </Link>,
            <Link to="/shop" key="shop">
              <Button icon={<ShoppingOutlined />}>Browse Catalog</Button>
            </Link>,
          ]}
        />
      </div>
    </div>
  );
};

export default NotFoundPage;
