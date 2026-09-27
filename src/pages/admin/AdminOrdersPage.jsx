import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Table,
  Button,
  Input,
  Select,
  Tag,
  Space,
  message,
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import orderService from '../../services/orderService';
import formatCurrency from '../../utils/formatCurrency';
import formatDate from '../../utils/formatDate';

const { Option } = Select;

const STATUS_TAG_COLORS = {
  Pending: 'gold',
  Confirmed: 'cyan',
  Processing: 'blue',
  Shipped: 'purple',
  Delivered: 'green',
  Cancelled: 'red',
};

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0 });

  const loadOrders = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 15,
        search: search.trim() || undefined,
        status: statusFilter || undefined,
      };

      const res = await orderService.getOrders(params);
      if (res?.success) {
        setOrders(res.orders || []);
        setPagination({
          page: res.pagination?.page || 1,
          limit: res.pagination?.limit || 15,
          total: res.pagination?.total || 0,
        });
      }
    } catch (err) {
      message.error(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    loadOrders(1);
  }, [loadOrders]);

  const handleQuickStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, {
        status: newStatus,
        note: `Status updated to ${newStatus} from orders table`,
      });
      message.success(`Order status updated to ${newStatus}`);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
      );
    } catch (err) {
      message.error(err.message || 'Failed to update order status');
    }
  };

  const columns = [
    {
      title: 'Order Reference',
      dataIndex: 'orderReference',
      key: 'orderReference',
      render: (ref, record) => (
        <Link to={`/admin/orders/${record._id}`} className="fw-bold text-primary font-monospace">
          {ref}
        </Link>
      ),
    },
    {
      title: 'Customer Name & City',
      dataIndex: 'customer',
      key: 'customer',
      render: (c) => (
        <div>
          <span className="fw-semibold d-block text-dark">{c?.name}</span>
          <span className="text-secondary small">{c?.city} • {c?.phone}</span>
        </div>
      ),
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
      render: (items) => (
        <span className="small text-muted">{items?.length || 0} product(s)</span>
      ),
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (total) => <span className="fw-bold text-dark">{formatCurrency(total)}</span>,
    },
    {
      title: 'Payment',
      dataIndex: 'paymentMethod',
      key: 'payment',
      render: (method, record) => (
        <span className="small">
          <Tag color="default">{method || 'COD'}</Tag>
          <Tag color={record.paymentStatus === 'Paid' ? 'green' : 'orange'}>
            {record.paymentStatus || 'Pending'}
          </Tag>
        </span>
      ),
    },
    {
      title: 'Order Status',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      render: (status, record) => (
        <Select
          value={status}
          size="small"
          style={{ width: 130 }}
          onChange={(newVal) => handleQuickStatusChange(record._id, newVal)}
        >
          <Option value="Pending">Pending</Option>
          <Option value="Confirmed">Confirmed</Option>
          <Option value="Processing">Processing</Option>
          <Option value="Shipped">Shipped</Option>
          <Option value="Delivered">Delivered</Option>
          <Option value="Cancelled">Cancelled</Option>
        </Select>
      ),
    },
    {
      title: 'Date Placed',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (d) => <span className="small text-muted">{formatDate(d)}</span>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Link to={`/admin/orders/${record._id}`}>
          <Button size="small" icon={<EyeOutlined />}>
            Details
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="admin-orders-wrapper">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-4">
        <div>
          <h3 className="fw-bold mb-1">Orders Management</h3>
          <p className="text-secondary small mb-0">
            Monitor and fulfill guest customer Cash on Delivery orders
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card border-0 shadow-sm rounded-4 p-3 bg-white mb-4">
        <div className="row g-2 align-items-center">
          <div className="col-12 col-md-5">
            <Input
              placeholder="Search reference, customer name, phone, or city..."
              prefix={<SearchOutlined className="text-muted" />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onPressEnter={() => loadOrders(1)}
              allowClear
            />
          </div>
          <div className="col-12 col-md-4">
            <Select
              placeholder="Filter by Order Status"
              allowClear
              style={{ width: '100%' }}
              value={statusFilter || undefined}
              onChange={(val) => setStatusFilter(val || '')}
            >
              <Option value="Pending">Pending</Option>
              <Option value="Confirmed">Confirmed</Option>
              <Option value="Processing">Processing</Option>
              <Option value="Shipped">Shipped</Option>
              <Option value="Delivered">Delivered</Option>
              <Option value="Cancelled">Cancelled</Option>
            </Select>
          </div>
          <div className="col-12 col-md-3 d-flex gap-2">
            <Button type="primary" onClick={() => loadOrders(1)} className="flex-grow-1">
              Filter
            </Button>
            <Button icon={<ReloadOutlined />} onClick={() => loadOrders(pagination.page)} />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
        <Table
          dataSource={orders}
          columns={columns}
          rowKey="_id"
          scroll={{ x: 'max-content' }}
          loading={loading}
          pagination={{
            current: pagination.page,
            pageSize: pagination.limit,
            total: pagination.total,
            onChange: (p) => loadOrders(p),
            showTotal: (total) => `Total ${total} orders`,
          }}
          size="middle"
        />
      </div>
    </div>
  );
};

export default AdminOrdersPage;
