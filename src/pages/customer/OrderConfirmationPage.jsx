import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button, Skeleton, Result, Tag, Divider } from 'antd';
import {
  CheckCircleFilled,
  ShoppingOutlined,
  PhoneOutlined,
  PrinterOutlined,
  CarOutlined,
} from '@ant-design/icons';
import orderService from '../../services/orderService';
import { useSettings } from '../../context/SettingsContext';
import formatCurrency from '../../utils/formatCurrency';
import formatDate from '../../utils/formatDate';

const OrderConfirmationPage = () => {
  const { orderReference } = useParams();
  const { settings } = useSettings();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await orderService.lookupOrder(orderReference);
        if (isMounted && res?.order) {
          setOrder(res.order);
        }
      } catch (err) {
        console.error('Order lookup failed:', err.message);
        if (isMounted) setError(err.message || 'Order reference not found');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (orderReference) {
      fetchOrder();
    }

    return () => {
      isMounted = false;
    };
  }, [orderReference]);

  const whatsappNumber = settings.contact?.whatsapp?.replace(/[^0-9]/g, '');

  if (loading) {
    return (
      <div className="container py-5 text-center" style={{ maxWidth: '650px' }}>
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container py-5">
        <Result
          status="warning"
          title="Order Not Found"
          subTitle={`We could not find an order matching reference "${orderReference}". Please check your order reference or contact support.`}
          extra={[
            <Link to="/shop" key="shop">
              <Button type="primary">Continue Shopping</Button>
            </Link>,
            <Link to="/contact" key="contact">
              <Button>Contact Support</Button>
            </Link>,
          ]}
        />
      </div>
    );
  }

  return (
    <div className="order-confirmation-wrapper py-4">
      <div className="container" style={{ maxWidth: '750px' }}>
        {/* Success Header */}
        <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 text-center bg-white">
          <CheckCircleFilled style={{ fontSize: '3.5rem', color: '#10b981' }} className="mb-3" />
          <h2 className="fw-bold mb-1">Thank You! Your Order is Confirmed</h2>
          <p className="text-secondary small mb-4">
            We have received your order and our fulfillment team is preparing it for shipment.
          </p>

          <div
            className="p-3 rounded-3 bg-light border mx-auto mb-3"
            style={{ maxWidth: '400px' }}
          >
            <span className="text-muted small text-uppercase fw-semibold">Order Reference Number:</span>
            <h3 className="fw-bold text-primary mb-0 mt-1 letter-spacing-1">
              {order.orderReference}
            </h3>
          </div>

          <p className="small text-muted mb-0">
            Placed on: <strong>{formatDate(order.createdAt)}</strong>
          </p>
        </div>

        {/* Order Details & Summary Card */}
        <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">Order Summary</h5>
            <Tag color="orange" className="fw-bold px-2 py-1">
              Status: {order.orderStatus || 'Pending'}
            </Tag>
          </div>

          {/* Purchased Items List */}
          <div className="table-responsive mb-4">
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
                          <span className="fw-semibold d-block">{item.name}</span>
                          {item.variants && item.variants.length > 0 && (
                            <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                              {item.variants.map((v) => `${v.name}: ${v.value}`).join(' | ')}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-end">{formatCurrency(item.price)}</td>
                    <td className="text-end fw-semibold">
                      {formatCurrency(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pricing Calculation Summary */}
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <div className="p-3 bg-light rounded-3 h-100">
                <h6 className="fw-bold mb-2 small text-uppercase text-secondary">
                  <CarOutlined className="me-1 text-primary" /> Delivery Details
                </h6>
                <p className="mb-1 fw-bold text-dark">{order.customer?.name}</p>
                <p className="mb-1 small text-secondary">{order.customer?.phone}</p>
                <p className="mb-1 small text-secondary">
                  {order.customer?.address}, {order.customer?.city}
                </p>
                {order.customer?.email && (
                  <p className="mb-0 small text-secondary">{order.customer.email}</p>
                )}
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="p-3 bg-light rounded-3 h-100">
                <div className="d-flex justify-content-between mb-2 small">
                  <span className="text-secondary">Subtotal:</span>
                  <span className="fw-semibold">{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2 small">
                  <span className="text-secondary">Delivery Fee:</span>
                  <span className="fw-semibold">
                    {order.deliveryFee === 0 ? 'FREE' : formatCurrency(order.deliveryFee)}
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-2 small">
                  <span className="text-secondary">Payment Method:</span>
                  <span className="badge bg-secondary">Cash on Delivery</span>
                </div>
                <Divider className="my-2" />
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold">Total Amount Payable:</span>
                  <span className="h5 fw-bold text-primary mb-0">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="d-flex justify-content-center gap-3 mb-5 flex-wrap">
          <Link to="/shop">
            <Button type="primary" size="large" icon={<ShoppingOutlined />}>
              Continue Shopping
            </Button>
          </Link>
          {whatsappNumber && (
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                `Hello AHMAD STORE, I would like to inquire about my order reference ${order.orderReference}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="large" style={{ backgroundColor: '#25d366', color: '#fff', borderColor: '#25d366' }}>
                <PhoneOutlined /> WhatsApp Support
              </Button>
            </a>
          )}
          <Button size="large" icon={<PrinterOutlined />} onClick={() => window.print()}>
            Print Receipt
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
