import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Switch,
  Popconfirm,
  Tag,
  message,
  Space,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';
import categoryService from '../../services/categoryService';

const { TextArea } = Input;

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await categoryService.getAdminCategories();
      if (res?.success) {
        setCategories(res.categories || []);
      }
    } catch (err) {
      message.error(err.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleOpenModal = (cat = null) => {
    setEditingCategory(cat);
    if (cat) {
      form.setFieldsValue({
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: cat.image,
        isActive: cat.isActive !== false,
        subcategories: cat.subcategories || [],
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        isActive: true,
        subcategories: [],
      });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingCategory(null);
    form.resetFields();
  };

  const onFinish = async (values) => {
    try {
      setSaving(true);
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory._id, values);
        message.success('Category updated successfully');
      } else {
        await categoryService.createCategory(values);
        message.success('Category created successfully');
      }
      handleCloseModal();
      loadCategories();
    } catch (err) {
      message.error(err.message || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await categoryService.deleteCategory(id);
      message.success('Category deleted successfully');
      loadCategories();
    } catch (err) {
      message.error(err.message || 'Failed to delete category');
    }
  };

  const columns = [
    {
      title: 'Department Name',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div>
          <span className="fw-bold d-block text-dark">{name}</span>
          <span className="small text-muted font-monospace">{record.slug}</span>
        </div>
      ),
    },
    {
      title: 'Products Linked',
      dataIndex: 'productCount',
      key: 'productCount',
      render: (count) => (
        <Tag color={count > 0 ? 'blue' : 'default'}>{count || 0} products</Tag>
      ),
    },
    {
      title: 'Subcategories',
      dataIndex: 'subcategories',
      key: 'subcategories',
      render: (subs) => (
        <div className="d-flex gap-1 flex-wrap" style={{ maxWidth: '350px' }}>
          {subs && subs.length > 0 ? (
            subs.map((s, idx) => (
              <Tag key={idx} color="geekblue" className="small">
                {s.name}
              </Tag>
            ))
          ) : (
            <span className="text-muted small">None</span>
          )}
        </div>
      ),
    },
    {
      title: 'Active State',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>{isActive ? 'Active' : 'Hidden'}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button size="small" icon={<EditOutlined />} onClick={() => handleOpenModal(record)} />
          <Popconfirm
            title="Delete category?"
            description={
              record.productCount > 0
                ? `Warning: This category has ${record.productCount} linked products. You must reassign them first.`
                : 'Are you sure you want to permanently delete this category?'
            }
            onConfirm={() => handleDelete(record._id)}
            disabled={record.productCount > 0}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button size="small" danger icon={<DeleteOutlined />} disabled={record.productCount > 0} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-categories-wrapper">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Categories Management</h3>
          <p className="text-secondary small mb-0">
            Manage store departments and embedded subcategories in single-source model
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => handleOpenModal(null)}
        >
          Add New Category
        </Button>
      </div>

      <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
        <Table
          dataSource={categories}
          columns={columns}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 15 }}
          size="middle"
        />
      </div>

      {/* Add / Edit Category Modal */}
      <Modal
        title={editingCategory ? 'Edit Category' : 'Add New Category'}
        open={modalOpen}
        onCancel={handleCloseModal}
        footer={null}
        destroyOnClose
        width={650}
      >
        <Form form={form} layout="vertical" onFinish={onFinish} className="mt-3">
          <Form.Item
            label="Category Name"
            name="name"
            rules={[{ required: true, message: 'Category name is required' }]}
          >
            <Input placeholder="e.g. Mobiles & Mobile Accessories" />
          </Form.Item>

          <Form.Item
            label="Category Slug (Optional)"
            name="slug"
            extra="Leave blank to automatically generate from name"
          >
            <Input placeholder="e.g. mobiles-accessories" />
          </Form.Item>

          <Form.Item label="Category Image URL (Optional)" name="image">
            <Input placeholder="https://images.unsplash.com/..." />
          </Form.Item>

          <Form.Item label="Description (Optional)" name="description">
            <TextArea rows={2} placeholder="Brief department description..." />
          </Form.Item>

          <Form.Item label="Active in Store" name="isActive" valuePropName="checked">
            <Switch checkedChildren="Active" unCheckedChildren="Hidden" />
          </Form.Item>

          <hr className="my-3" />

          {/* Subcategories Embedded List */}
          <h6 className="fw-bold mb-2">Embedded Subcategories</h6>
          <p className="text-secondary small mb-3">
            Add subcategories directly within this category document (Single-source approach).
          </p>

          <Form.List name="subcategories">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'name']}
                      rules={[{ required: true, message: 'Subcategory name required' }]}
                    >
                      <Input placeholder="e.g. Smartphones, Cases" />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, 'slug']}>
                      <Input placeholder="Slug (optional)" />
                    </Form.Item>
                    <MinusCircleOutlined className="text-danger" onClick={() => remove(name)} />
                  </Space>
                ))}

                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} className="mb-4">
                  Add Subcategory
                </Button>
              </>
            )}
          </Form.List>

          <div className="d-flex justify-content-end gap-2">
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={saving} className="btn-accent-store border-0">
              {editingCategory ? 'Save Changes' : 'Create Category'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminCategoriesPage;
