import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Input, Button, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';

const AdminLoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const from = location.state?.from?.pathname || '/admin';

  const onFinish = async (values) => {
    try {
      setLoading(true);
      setErrorMsg(null);
      await login(values.email, values.password);
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h4 className="fw-bold mb-3 text-center">Administrator Sign In</h4>
      <p className="text-muted small text-center mb-4">
        Enter your authorized credentials to access the store management dashboard.
      </p>

      {errorMsg && <Alert message={errorMsg} type="error" showIcon className="mb-3" />}

      <Form layout="vertical" onFinish={onFinish} autoComplete="off">
        <Form.Item
          label="Admin Email"
          name="email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email!' },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="admin@ahmadstore.com" size="large" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="••••••••" size="large" />
        </Form.Item>

        <Form.Item className="mt-4 mb-0">
          <Button type="primary" htmlType="submit" size="large" block loading={loading}>
            Sign In to Dashboard
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AdminLoginPage;
