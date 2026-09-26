import React from 'react';
import { Empty, Button } from 'antd';
import { Link } from 'react-router-dom';

const EmptyState = ({
  title = 'No Products Found',
  description = 'Try adjusting your search or filters to find what you are looking for.',
  actionText = 'Browse All Products',
  actionLink = '/shop',
  onAction,
}) => {
  return (
    <div className="py-5 text-center w-100">
      <Empty
        description={
          <div>
            <h5 className="fw-bold mb-2 text-dark">{title}</h5>
            <p className="text-muted mb-4">{description}</p>
          </div>
        }
      >
        {onAction ? (
          <Button type="primary" onClick={onAction}>
            {actionText}
          </Button>
        ) : actionLink ? (
          <Link to={actionLink}>
            <Button type="primary">{actionText}</Button>
          </Link>
        ) : null}
      </Empty>
    </div>
  );
};

export default EmptyState;
