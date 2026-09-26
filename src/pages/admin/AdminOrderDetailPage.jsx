import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Card,
  Button,
  Select,
  Input,
  Tag,
  Divider,
  Timeline,
  message,
  Skeleton,
} from 'antd';
import {
  ArrowLeftOutlined,
  PrinterOutlined,
  UserOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import orderService from '../../services/orderService';
import formatCurrency from '../../utils/formatCurrency';
import formatDate from '../../utils/formatDate';

const { Option } = Select;

const STATUS_COLORS = {
  Pending: 'gold',
  Confirmed: 'cyan',
  Processing: 'blue',
  Shipped: 'purple',
  Delivered: 'green',
  Cancelled: 'red',
};

const AdminOrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');

  const loadOrder = async () => {
    try {
      setLoading(true);
      const res = await orderService.getOrderById(id);
      if (res?.success && res.order) {
        setOrder(res.order);
        setNewStatus(res.order.orderStatus);
      }
    } catch (err) {
      message.error(err.message || 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [id]);

  const handleStatusUpdate = async () => {
    if (!newStatus) return;
    try {
      setUpdating(true);
      const res = await orderService.updateOrderStatus(id, {
        status: newStatus,
        note: statusNote.trim() || undefined,
      });

      if (res?.success) {
        message.success(`Order status updated to ${newStatus}`);
        setStatusNote('');
        loadOrder();
      }
    } catch (err) {
      message.error(err.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <Skeleton active paragraph={{ rows: 10 }} />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container-fluid py-4">
        <p className="text-danger">Order not found.</p>
        <Link to="/admin/orders">
          <Button icon={<ArrowLeftOutlined />}>Back to Orders</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="admin-order-detail-wrapper" style={{ maxWidth: '980px' }}>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center gap-3">
          <Link to="/admin/orders">
            <Button icon={<ArrowLeftOutlined />} />
          </Link>
          <div>
            <h3 className="fw-bold mb-0">Order: {order.orderReference}</h3>
            <span className="small text-muted">Placed on: {formatDate(order.createdAt)}</span>
          </div>
        </div>
        <Button icon={<PrinterOutlined />} onClick={() => window.print()}>
          Print Order Slip
        </Button>
      </div>

      <div className="row g-4 mb-4">
        {/* Left: Customer & Items */}
        <div className="col-12 col-lg-8">
          {/* Customer Shipping Card */}
          <Card title="Customer & Delivery Details" className="shadow-sm border-0 rounded-4 mb-4">
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <span className="text-muted small d-block">Recipient Name</span>
                <span className="fw-bold text-dark">{order.customer?.name}</span>
              </div>
              <div className="col-12 col-md-6">
                <span className="text-muted small d-block">Contact Phone</span>
                <span className="fw-bold text-dark">{order.customer?.phone}</span>
              </div>
              <div className="col-12 col-md-6">
                <span className="text-muted small d-block">City</span>
                <span className="text-dark">{order.customer?.city}</span>
              </div>
              <div className="col-12 col-md-6">
                <span className="text-muted small d-block">Email Address</span>
                <span className="text-dark">{order.customer?.email || 'Not provided (Guest)'}</span>
              </div>
              <div className="col-12">
                <span className="text-muted small d-block">Full Street Address</span>
                <span className="text-dark">{order.customer?.address}</span>
              </div>
              {order.customer?.deliveryNote && (
                <div className="col-12">
                  <span className="text-muted small d-block">Delivery Note / Instructions</span>
                  <div className="p-2 bg-light rounded text-secondary small">
                    {order.customer.deliveryNote}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Purchased Items Card */}
          <Card title={`Purchased Products (${order.items?.length || 0})`} className="shadow-sm border-0 rounded-4">
            <div className="table-responsive">
              <table className="table align-middle small mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col">Product Item</th>
                    <th scope="col" className="text-center">Qty</th>
                    <th scope="col" className="text-end">Price</th>
                    <th scope="col" className="text-end">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items?.map((item, idx) => (
                    <tr key={idx}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="rounded-2 border"
                              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                            />
                          )}
                          <div>
                            <span className="fw-bold d-block text-dark">{item.name}</span>
                            {item.variants && item.variants.length > 0 && (
                              <div className="d-flex gap-1 flex-wrap mt-1">
                                {item.variants.map((v, vIdx) => (
                                  <Tag key={vIdx} className="small">
                                    {v.name}: {v.value}
                                  </Tag>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="text-center">{item.quantity}</td>
                      <td className="text-end">{formatCurrency(item.price)}</td>
                      <td className="text-end fw-bold">{formatCurrency(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Divider className="my-3" />

            {/* Subtotal & Delivery Breakdown */}
            <div className="d-flex justify-content-end">
              <div style={{ minWidth: '240px' }}>
                <div className="d-flex justify-content-between mb-1 small">
                  <span className="text-secondary">Subtotal:</span>
                  <span className="fw-semibold">{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="d-flex justify-content-between mb-1 small">
                  <span className="text-secondary">Delivery Fee:</span>
                  <span className="fw-semibold">
                    {order.deliveryFee === 0 ? 'FREE' : formatCurrency(order.deliveryFee)}
                  </span>
                </div>
                <Divider className="my-2" />
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold">Total Amount:</span>
                  <span className="h5 fw-bold text-primary mb-0">{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right: Status Workflow & Timeline */}
        <div className="col-12 col-lg-4">
          {/* Order Status Update Card */}
          <Card title="Update Order Status" className="shadow-sm border-0 rounded-4 mb-4">
            <div className="mb-3">
              <span className="text-muted small d-block mb-1">Current Status</span>
              <Tag color={STATUS_COLORS[order.orderStatus]} className="px-3 py-1 fw-bold">
                {order.orderStatus}
              </Tag>
            </div>

            <div className="mb-3">
              <label className="fw-semibold small d-block mb-1">Select New Status</label>
              <Select
                value={newStatus}
                onChange={(val) => setNewStatus(val)}
                style={{ width: '100%' }}
                size="large"
              >
                <Option value="Pending">Pending</Option>
                <Option value="Confirmed">Confirmed</Option>
                <Option value="Processing">Processing</Option>
                <Option value="Shipped">Shipped</Option>
                <Option value="Delivered">Delivered</Option>
                <Option value="Cancelled">Cancelled</Option>
              </Select>
            </div>

            <div className="mb-3">
              <label className="fw-semibold small d-block mb-1">Status Note (Optional)</label>
              <Input
                placeholder="e.g. Courier tracking code dispatched..."
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
              />
            </div>

            <Button
              type="primary"
              block
              size="large"
              loading={updating}
              disabled={newStatus === order.orderStatus && !statusNote.trim()}
              onClick={handleStatusUpdate}
              className="btn-accent-store border-0"
            >
              Update Status
            </Button>
          </Card>

          {/* Status Timeline History */}
          <Card title="Status History" className="shadow-sm border-0 rounded-4">
            {order.statusHistory && order.statusHistory.length > 0 ? (
              <Timeline
                items={order.statusHistory.map((h) => ({
                  color: STATUS_COLORS[h.status] || 'blue',
                  children: (
                    <div>
                      <span className="fw-bold">{h.status}</span>
                      <span className="text-muted small d-block">{formatDate(h.changedAt)}</span>
                      {h.note && <span className="small text-secondary">{h.note}</span>}
                    </div>
                  ),
                }))}
              />
            ) : (
              <p className="text-muted small">No history entries.</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetailPage;
