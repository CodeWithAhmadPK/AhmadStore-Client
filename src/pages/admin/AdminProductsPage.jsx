import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Table,
  Button,
  Input,
  Select,
  Tag,
  Popconfirm,
  message,
  Switch,
  Space,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import formatCurrency from '../../utils/formatCurrency';

const { Option } = Select;

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0 });

  // Fetch categories for filter dropdown
  useEffect(() => {
    let isMounted = true;
    const loadCategories = async () => {
      try {
        const res = await categoryService.getAdminCategories();
        if (isMounted && res?.categories) {
          setCategories(res.categories);
        }
      } catch (err) {
        console.warn('Failed to load categories:', err.message);
      }
    };
    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  const loadProducts = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 15,
        search: search.trim(),
        category: selectedCategory || undefined,
      };

      const res = await productService.getAdminProducts(params);
      if (res?.success) {
        setProducts(res.products || []);
        setPagination({
          page: res.pagination?.page || 1,
          limit: res.pagination?.limit || 15,
          total: res.pagination?.total || 0,
        });
      }
    } catch (err) {
      message.error(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory]);

  useEffect(() => {
    loadProducts(1);
  }, [loadProducts]);

  const handleDelete = async (id) => {
    try {
      await productService.deleteProduct(id);
      message.success('Product deleted successfully');
      loadProducts(pagination.page);
    } catch (err) {
      message.error(err.message || 'Failed to delete product');
    }
  };

  const handleToggleActive = async (record, checked) => {
    try {
      await productService.updateProduct(record._id, { isActive: checked });
      message.success(`Product marked as ${checked ? 'Active' : 'Inactive'}`);
      setProducts((prev) =>
        prev.map((p) => (p._id === record._id ? { ...p, isActive: checked } : p))
      );
    } catch (err) {
      message.error(err.message || 'Failed to update product state');
    }
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'images',
      key: 'image',
      width: 70,
      render: (images) => {
        const primary =
          images && images.length > 0
            ? (images.find((img) => img.isPrimary) || images[0]).url
            : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&auto=format&fit=crop&q=60';
        return (
          <img
            src={primary}
            alt="Product thumb"
            className="rounded-2 border"
            style={{ width: '48px', height: '48px', objectFit: 'cover' }}
          />
        );
      },
    },
    {
      title: 'Product Title',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div>
          <Link to={`/admin/products/${record._id}/edit`} className="fw-semibold text-dark">
            {name}
          </Link>
          <div className="small text-muted">
            {record.brand && <span className="me-2">Brand: {record.brand}</span>}
            {record.sku && <span>SKU: {record.sku}</span>}
          </div>
        </div>
      ),
    },
    {
      title: 'Department',
      dataIndex: 'category',
      key: 'category',
      render: (cat) => <Tag color="blue">{cat?.name || 'Unassigned'}</Tag>,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price, record) => (
        <div>
          <span className="fw-bold">{formatCurrency(record.salePrice || price)}</span>
          {record.salePrice && (
            <span className="small text-muted text-decoration-line-through d-block">
              {formatCurrency(price)}
            </span>
          )}
        </div>
      ),
    },
    {
      title: 'Stock',
      dataIndex: 'stockQuantity',
      key: 'stockQuantity',
      render: (stock) => (
        <Tag color={stock > 10 ? 'green' : stock > 0 ? 'orange' : 'red'}>
          {stock > 0 ? `${stock} units` : 'Out of Stock'}
        </Tag>
      ),
    },
    {
      title: 'Active',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive, record) => (
        <Switch
          size="small"
          checked={isActive}
          onChange={(checked) => handleToggleActive(record, checked)}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 140,
      render: (_, record) => (
        <Space size="small">
          <Link to={`/admin/products/${record._id}/edit`}>
            <Button size="small" icon={<EditOutlined />} />
          </Link>
          <Popconfirm
            title="Delete this product?"
            description="Are you sure you want to permanently delete this product?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes, Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-products-wrapper">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h3 className="fw-bold mb-1">Products Management</h3>
          <p className="text-secondary small mb-0">
            Create, update, organize, and monitor catalog inventory
          </p>
        </div>
        <Link to="/admin/products/new">
          <Button type="primary" icon={<PlusOutlined />} size="large">
            Add New Product
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="card border-0 shadow-sm rounded-4 p-3 bg-white mb-4">
        <div className="row g-2 align-items-center">
          <div className="col-12 col-md-5">
            <Input
              placeholder="Search by title, SKU, or brand..."
              prefix={<SearchOutlined className="text-muted" />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onPressEnter={() => loadProducts(1)}
              allowClear
            />
          </div>
          <div className="col-12 col-md-4">
            <Select
              placeholder="Filter by Department"
              allowClear
              style={{ width: '100%' }}
              value={selectedCategory || undefined}
              onChange={(val) => setSelectedCategory(val || '')}
            >
              {categories.map((c) => (
                <Option key={c._id} value={c._id}>
                  {c.name}
                </Option>
              ))}
            </Select>
          </div>
          <div className="col-12 col-md-3 d-flex gap-2">
            <Button type="primary" onClick={() => loadProducts(1)} className="flex-grow-1">
              Apply
            </Button>
            <Button icon={<ReloadOutlined />} onClick={() => loadProducts(pagination.page)} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
        <Table
          dataSource={products}
          columns={columns}
          rowKey="_id"
          loading={loading}
          pagination={{
            current: pagination.page,
            pageSize: pagination.limit,
            total: pagination.total,
            onChange: (p) => loadProducts(p),
            showTotal: (total) => `Total ${total} products`,
          }}
          size="middle"
        />
      </div>
    </div>
  );
};

export default AdminProductsPage;
