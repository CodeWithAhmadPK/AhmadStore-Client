import React from 'react';
import { Spin } from 'antd';

const LoadingSpinner = ({ tip = 'Loading...', fullPage = false, size = 'large' }) => {
  if (fullPage) {
    return (
      <div
        className="d-flex flex-column align-items-center justify-content-center"
        style={{ minHeight: '60vh', width: '100%' }}
      >
        <Spin size={size} tip={tip} />
      </div>
    );
  }

  return (
    <div className="d-flex align-items-center justify-content-center p-4 w-100">
      <Spin size={size} tip={tip} />
    </div>
  );
};

export default LoadingSpinner;
