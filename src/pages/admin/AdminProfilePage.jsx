import React, { useState } from 'react';
import { Card, Form, Input, Button, message, Tag, Divider, Alert } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import formatDate from '../../utils/formatDate';

const AdminProfilePage = () => {
  const { admin, updateProfile } = useAuth();
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleUpdateProfile = async (values) => {
    try {
      setSavingProfile(true);
      await updateProfile({
        name: values.name.trim(),
        email: values.email.trim(),
      });
      message.success('Admin profile updated successfully');
    } catch (err) {
      message.error(err.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (values) => {
    try {
      setSavingPassword(true);
      await authService.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      message.success('Password changed successfully');
      passwordForm.resetFields();
    } catch (err) {
      message.error(err.message || 'Failed to change password. Verify your current password.');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="admin-profile-wrapper" style={{ maxWidth: '850px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Administrator Profile & Security</h3>
          <p className="text-secondary small mb-0">
            Manage your administrator credentials and account security
          </p>
        </div>
      </div>

      <div className="row g-4 mb-4">
        {/* Account Overview Card */}
        <div className="col-12 col-md-4">
          <Card className="shadow-sm border-0 rounded-4 text-center p-3 h-100">
            <div
              className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{ width: '70px', height: '70px', fontSize: '2rem' }}
            >
              <UserOutlined />
            </div>
            <h5 className="fw-bold mb-1 text-dark">{admin?.name || 'Administrator'}</h5>
            <p className="text-muted small mb-2">{admin?.email}</p>
            <Tag color="geekblue" className="px-3 py-1 fw-bold text-uppercase mb-3">
              {admin?.role || 'admin'}
            </Tag>

            <Divider className="my-2" />

            <div className="text-start small text-secondary mt-3">
              <div className="d-flex align-items-center gap-2 mb-2">
                <SafetyCertificateOutlined className="text-success" />
                <span>Protected JWT Access</span>
              </div>
              <div>
                <span className="text-muted d-block">Account Role:</span>
                <span className="fw-semibold text-dark">Store Superadmin / Admin</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Update Profile Form */}
        <div className="col-12 col-md-8">
          <Card title="Update Profile Information" className="shadow-sm border-0 rounded-4 mb-4">
            <Form
              form={profileForm}
              layout="vertical"
              onFinish={handleUpdateProfile}
              initialValues={{
                name: admin?.name || '',
                email: admin?.email || '',
              }}
            >
              <Form.Item
                label="Full Name"
                name="name"
                rules={[{ required: true, message: 'Name is required' }]}
              >
                <Input prefix={<UserOutlined />} size="large" />
              </Form.Item>

              <Form.Item
                label="Email Address"
                name="email"
                rules={[
                  { required: true, message: 'Email is required' },
                  { type: 'email', message: 'Enter a valid email' },
                ]}
              >
                <Input prefix={<MailOutlined />} size="large" />
              </Form.Item>

              <div className="d-flex justify-content-end">
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={savingProfile}
                  className="btn-accent-store border-0"
                >
                  Save Profile Changes
                </Button>
              </div>
            </Form>
          </Card>

          {/* Change Password Form */}
          <Card title="Change Security Password" className="shadow-sm border-0 rounded-4">
            <Form form={passwordForm} layout="vertical" onFinish={handleChangePassword}>
              <Form.Item
                label="Current Password"
                name="currentPassword"
                rules={[{ required: true, message: 'Enter your current password' }]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="••••••••" size="large" />
              </Form.Item>

              <Form.Item
                label="New Password"
                name="newPassword"
                rules={[
                  { required: true, message: 'Enter a new password' },
                  { min: 6, message: 'Password must be at least 6 characters' },
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="••••••••" size="large" />
              </Form.Item>

              <Form.Item
                label="Confirm New Password"
                name="confirmPassword"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: 'Confirm your new password' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Passwords do not match'));
                    },
                  }),
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="••••••••" size="large" />
              </Form.Item>

              <div className="d-flex justify-content-end">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={savingPassword}
                  danger
                  className="px-4"
                >
                  Update Password
                </Button>
              </div>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;
