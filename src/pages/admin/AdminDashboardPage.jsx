import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Tag, Button, Skeleton } from 'antd';
import {
  ShoppingOutlined,
  AppstoreOutlined,
  OrderedListOutlined,
  ClockCircleOutlined,
  DollarCircleOutlined,
  ArrowRightOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import StatsCard from '../../components/admin/StatsCard';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import orderService from '../../services/orderService';
import formatCurrency from '../../utils/formatCurrency';
import formatDate from '../../utils/formatDate';

const STATUS_COLORS = {
  Pending: '#f59e0b',
  Confirmed: '#0284c7',
  Processing: '#6366f1',
  Shipped: '#8b5cf6',
  Delivered: '#10b981',
  Cancelled: '#ef4444',
};

const AdminDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [statusDistribution, setStatusDistribution] = useState([]);
  const [categoryDistribution, setCategoryDistribution] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes, orderRes] = await Promise.all([
          productService.getAdminProducts({ limit: 100 }),
          categoryService.getAdminCategories(),
          orderService.getOrders({ limit: 50 }),
        ]);

        if (!isMounted) return;

        const allOrders = orderRes?.orders || [];
        const allProducts = prodRes?.products || [];
        const allCategories = catRes?.categories || [];

        const pendingCount = allOrders.filter((o) => o.orderStatus === 'Pending').length;
        const revenue = allOrders
          .filter((o) => o.orderStatus !== 'Cancelled')
          .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

        setStats({
          totalProducts: prodRes?.pagination?.total || allProducts.length,
          totalCategories: allCategories.length,
          totalOrders: orderRes?.pagination?.total || allOrders.length,
          pendingOrders: pendingCount,
          totalRevenue: revenue,
        });

        setRecentOrders(allOrders.slice(0, 5));

        // Group status counts for Pie Chart
        const statusCounts = {};
        allOrders.forEach((o) => {
          const st = o.orderStatus || 'Pending';
          statusCounts[st] = (statusCounts[st] || 0) + 1;
        });

        const statusChartData = Object.entries(statusCounts).map(([status, count]) => ({
          name: status,
          value: count,
          color: STATUS_COLORS[status] || '#64748b',
        }));
        setStatusDistribution(statusChartData);

        // Group categories with product counts for Bar Chart
        const catChartData = allCategories.slice(0, 6).map((c) => ({
          name: c.name.length > 12 ? `${c.name.slice(0, 10)}...` : c.name,
          products: c.productCount || 0,
        }));
        setCategoryDistribution(catChartData);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadDashboardData();
    return () => {
      isMounted = false;
    };
  }, []);

  const orderColumns = [
    {
      title: 'Order Ref',
      dataIndex: 'orderReference',
      key: 'orderReference',
      render: (ref, record) => (
        <Link to={`/admin/orders/${record._id}`} className="fw-bold text-primary">
          {ref}
        </Link>
      ),
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
      render: (c) => (
        <div>
          <span className="fw-semibold d-block">{c?.name}</span>
          <span className="text-muted small">{c?.city}</span>
        </div>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amt) => <span className="fw-bold">{formatCurrency(amt)}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      render: (status) => (
        <Tag
          color={
            status === 'Delivered'
              ? 'green'
              : status === 'Cancelled'
              ? 'red'
              : status === 'Pending'
              ? 'gold'
              : 'blue'
          }
        >
          {status}
        </Tag>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (d) => <span className="small text-muted">{formatDate(d, false)}</span>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Link to={`/admin/orders/${record._id}`}>
          <Button size="small" icon={<EyeOutlined />}>
            View
          </Button>
        </Link>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  return (
    <div className="admin-dashboard-wrapper">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h3 className="fw-bold mb-1">Store Dashboard</h3>
          <p className="text-secondary small mb-0">
            Real-time catalog performance and customer order statistics
          </p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/admin/products/new">
            <Button type="primary">+ Add Product</Button>
          </Link>
          <Link to="/admin/orders">
            <Button>Manage Orders</Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl">
          <StatsCard
            title="Total Revenue (COD)"
            value={formatCurrency(stats.totalRevenue)}
            icon={<DollarCircleOutlined style={{ fontSize: '1.25rem', color: '#10b981' }} />}
            subtitle="Delivered & active orders"
            color="success"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl">
          <StatsCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={<OrderedListOutlined style={{ fontSize: '1.25rem', color: '#2563eb' }} />}
            subtitle="Customer orders placed"
            color="primary"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl">
          <StatsCard
            title="Pending Orders"
            value={stats.pendingOrders}
            icon={<ClockCircleOutlined style={{ fontSize: '1.25rem', color: '#f59e0b' }} />}
            subtitle="Awaiting fulfillment"
            color="warning"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl">
          <StatsCard
            title="Products"
            value={stats.totalProducts}
            icon={<ShoppingOutlined style={{ fontSize: '1.25rem', color: '#0f172a' }} />}
            subtitle="Active items in store"
            color="dark"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl">
          <StatsCard
            title="Categories"
            value={stats.totalCategories}
            icon={<AppstoreOutlined style={{ fontSize: '1.25rem', color: '#6366f1' }} />}
            subtitle="Departments organized"
            color="info"
          />
        </div>
      </div>

      {/* Charts Row */}
      <div className="row g-4 mb-4">
        {/* Left: Products per Category Bar Chart */}
        <div className="col-12 col-lg-7">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
            <h5 className="fw-bold mb-3">Inventory by Department</h5>
            {categoryDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={categoryDistribution}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} />
                  <Tooltip formatter={(value) => [`${value} products`, 'Inventory']} />
                  <Bar dataKey="products" fill="#2563eb" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-5 text-muted small">No department data yet.</div>
            )}
          </div>
        </div>

        {/* Right: Order Status Distribution Pie Chart */}
        <div className="col-12 col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
            <h5 className="fw-bold mb-3">Order Status Distribution</h5>
            {statusDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-5 text-muted small">No orders recorded yet.</div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders Preview */}
      <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h5 className="fw-bold mb-0">Recent Customer Orders</h5>
          <Link to="/admin/orders" className="text-primary fw-semibold small text-decoration-none">
            View All Orders <ArrowRightOutlined />
          </Link>
        </div>

        <Table
          dataSource={recentOrders}
          columns={orderColumns}
          rowKey="_id"
          pagination={false}
          size="middle"
        />
      </div>
    </div>
  );
};

export default AdminDashboardPage;
