import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Alert, Tag, Divider, message } from 'antd';
import {
  SafetyCertificateOutlined,
  CheckCircleOutlined,
  CarOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';
import orderService from '../../services/orderService';
import formatCurrency from '../../utils/formatCurrency';

const { TextArea } = Input;

const CheckoutPage = () => {
  const { cartItems, subtotal, clearCart } = useCart();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const deliveryFee = settings.deliveryFee || 0;
  const isFreeDelivery =
    settings.freeDeliveryThreshold > 0 && subtotal >= settings.freeDeliveryThreshold;
  const effectiveDeliveryFee = isFreeDelivery ? 0 : deliveryFee;
  const estimatedGrandTotal = subtotal + effectiveDeliveryFee;

  // Redirect if cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="card border-0 shadow-sm rounded-4 p-5 mx-auto" style={{ maxWidth: '500px' }}>
          <ShoppingOutlined style={{ fontSize: '3rem', color: '#64748b' }} className="mb-3" />
          <h4 className="fw-bold mb-2">Your Cart is Empty</h4>
          <p className="text-secondary small mb-4">
            You must add items to your cart before proceeding to checkout.
          </p>
          <Link to="/shop">
            <Button type="primary">Explore Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmitOrder = async (values) => {
    try {
      setSubmitting(true);
      setErrorMessage(null);

      // Format payload strictly matching Order model
      const orderPayload = {
        customer: {
          name: values.name.trim(),
          phone: values.phone.trim(),
          email: values.email ? values.email.trim().toLowerCase() : '',
          address: values.address.trim(),
          city: values.city.trim(),
          deliveryNote: values.deliveryNote ? values.deliveryNote.trim() : '',
        },
        items: cartItems.map((item) => ({
          product: item.product,
          quantity: item.quantity,
          variants: item.variants || [],
        })),
      };

      const res = await orderService.createOrder(orderPayload);

      if (res?.success && res.orderReference) {
        // Clear local shopping cart upon successful creation
        clearCart();
        message.success('Order placed successfully!');
        navigate(`/order-confirmation/${res.orderReference}`, { replace: true });
      } else {
        throw new Error(res?.message || 'Could not place order. Please try again.');
      }
    } catch (err) {
      console.error('Order placement error:', err);
      setErrorMessage(
        err.message || 'An error occurred while creating your order. Please review your cart.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="checkout-page-wrapper py-3">
      <div className="container">
        <Breadcrumbs
          items={[
            { label: 'Cart', link: '/cart' },
            { label: 'Guest Checkout (COD)' },
          ]}
        />

        <div className="checkout-page-heading d-flex align-items-center justify-content-between mb-4">
          <div>
            <h2 className="fw-bold mb-1">Guest Checkout</h2>
            <p className="text-secondary small mb-0">
              No account or registration required. Fill in your delivery details below.
            </p>
          </div>
          <span className="badge bg-success px-3 py-2 fw-semibold">
            Cash on Delivery (COD) Only
          </span>
        </div>

        {errorMessage && (
          <Alert
            message="Order Processing Error"
            description={errorMessage}
            type="error"
            showIcon
            className="mb-4"
          />
        )}

        <div className="row g-4">
          {/* Left: Customer Delivery Details Form */}
          <div className="col-12 col-lg-7">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
              <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <CarOutlined className="text-primary" />
                <span>Shipping & Delivery Address</span>
              </h5>

              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmitOrder}
                requiredMark="optional"
                autoComplete="on"
              >
                {/* Full Name */}
                <Form.Item
                  label="Full Name"
                  name="name"
                  rules={[
                    { required: true, message: 'Please provide your full name' },
                    { min: 3, message: 'Name must be at least 3 characters' },
                  ]}
                >
                  <Input
                    placeholder="e.g. Ahmad Hassan"
                    size="large"
                    autoComplete="name"
                  />
                </Form.Item>

                {/* Phone & Optional Email */}
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <Form.Item
                      label="Phone Number"
                      name="phone"
                      extra="For delivery coordination and courier SMS updates"
                      rules={[
                        { required: true, message: 'Please provide a valid phone number' },
                        {
                          pattern: /^[0-9+-\s]{10,15}$/,
                          message: 'Please enter a valid phone number (e.g. 03001234567)',
                        },
                      ]}
                    >
                      <Input
                        type="tel"
                        placeholder="0300 1234567"
                        size="large"
                        autoComplete="tel"
                      />
                    </Form.Item>
                  </div>

                  <div className="col-12 col-md-6">
                    <Form.Item
                      label="Email Address (Optional)"
                      name="email"
                      extra="Optional: for order confirmation receipt"
                      rules={[{ type: 'email', message: 'Please enter a valid email format' }]}
                    >
                      <Input
                        type="email"
                        placeholder="ahmad@example.com"
                        size="large"
                        autoComplete="email"
                      />
                    </Form.Item>
                  </div>
                </div>

                {/* City */}
                <Form.Item
                  label="City"
                  name="city"
                  rules={[{ required: true, message: 'Please enter your city name' }]}
                >
                  <Input
                    placeholder="e.g. Lahore, Karachi, Islamabad, Faisalabad"
                    size="large"
                    autoComplete="address-level2"
                  />
                </Form.Item>

                {/* Full Street Address */}
                <Form.Item
                  label="Complete Delivery Address"
                  name="address"
                  rules={[
                    { required: true, message: 'Please provide complete delivery address' },
                    { min: 10, message: 'Please specify house/shop no, street, and area' },
                  ]}
                >
                  <TextArea
                    rows={3}
                    placeholder="House/Plot/Apartment No, Street, Landmark, Area name"
                    autoComplete="street-address"
                  />
                </Form.Item>

                {/* Delivery Note */}
                <Form.Item
                  label="Special Instructions / Delivery Note (Optional)"
                  name="deliveryNote"
                >
                  <Input placeholder="e.g. Please call before arriving or deliver between 2 PM - 5 PM" />
                </Form.Item>

                {/* Payment Method Notice */}
                <div className="p-3 rounded-3 bg-light border mb-4">
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <SafetyCertificateOutlined className="text-success" style={{ fontSize: '1.2rem' }} />
                    <span className="fw-bold text-dark">Payment Method: Cash on Delivery (COD)</span>
                  </div>
                  <p className="text-secondary small mb-0">
                    No online credit card or prepayment required. Pay the exact amount in cash directly to the courier representative when the parcel is delivered to your address.
                  </p>
                </div>

                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={submitting}
                  className="btn-accent-store border-0 fw-semibold"
                  style={{ height: '52px', fontSize: '1.1rem' }}
                >
                  Confirm & Place COD Order ({formatCurrency(estimatedGrandTotal)})
                </Button>
              </Form>
            </div>
          </div>

          {/* Right: Order Summary Sidebar */}
          <div className="col-12 col-lg-5">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white position-sticky" style={{ top: '85px' }}>
              <h5 className="fw-bold mb-3">Order Items ({cartItems.length})</h5>

              <div
                className="checkout-items-list mb-3"
                style={{ maxHeight: '280px', overflowY: 'auto' }}
              >
                {cartItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="checkout-order-item d-flex align-items-center justify-content-between py-2 border-bottom"
                  >
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={
                          item.image ||
                          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&auto=format&fit=crop&q=60'
                        }
                        alt={item.name}
                        className="rounded-2 border"
                        style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                      />
                      <div className="checkout-order-item-details">
                        <span className="fw-semibold small d-block text-truncate" style={{ maxWidth: '180px' }}>
                          {item.name}
                        </span>
                        <span className="text-muted small">
                          Qty: {item.quantity} × {formatCurrency(item.price)}
                        </span>
                        {item.variants && item.variants.length > 0 && (
                          <div className="d-flex gap-1 mt-1">
                            {item.variants.map((v, vIdx) => (
                              <span key={vIdx} className="badge bg-light text-dark border" style={{ fontSize: '0.65rem' }}>
                                {v.name}: {v.value}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="checkout-order-item-total fw-bold small text-dark">
                      {formatCurrency((item.price || 0) * (item.quantity || 1))}
                    </span>
                  </div>
                ))}
              </div>

              {/* Pricing Breakdown */}
              <div className="d-flex justify-content-between mb-2">
                <span className="text-secondary small">Items Subtotal:</span>
                <span className="fw-semibold">{formatCurrency(subtotal)}</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span className="text-secondary small">Delivery Charges:</span>
                <span className="fw-semibold">
                  {isFreeDelivery ? (
                    <span className="text-success fw-bold">FREE</span>
                  ) : (
                    formatCurrency(effectiveDeliveryFee)
                  )}
                </span>
              </div>

              <Divider className="my-2" />

              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="fw-bold">Total Payable:</span>
                <span className="h4 fw-bold text-primary mb-0">
                  {formatCurrency(estimatedGrandTotal)}
                </span>
              </div>

              <div className="text-muted small text-center">
                <span>By placing this order you agree to our Terms & Conditions.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
