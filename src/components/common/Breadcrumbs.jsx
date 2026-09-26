import React from 'react';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';

const Breadcrumbs = ({ items = [] }) => {
  const breadcrumbItems = [
    {
      title: (
        <Link to="/" className="d-flex align-items-center gap-1">
          <HomeOutlined />
          <span>Home</span>
        </Link>
      ),
    },
    ...items.map((item) => ({
      title: item.link ? <Link to={item.link}>{item.label}</Link> : item.label,
    })),
  ];

  return (
    <div className="py-3">
      <Breadcrumb items={breadcrumbItems} />
    </div>
  );
};

export default Breadcrumbs;
