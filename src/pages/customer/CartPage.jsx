import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Popconfirm, Tag, message } from 'antd';
import {
  DeleteOutlined,
  ShoppingOutlined,
  ArrowRightOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import EmptyState from '../../components/common/EmptyState';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';
import formatCurrency from '../../utils/formatCurrency';

const CartPage = () => {
  const { cartItems, removeItem, updateQuantity, clearCart, itemCount, subtotal } = useCart();
  const { settings } = useSettings();
  const navigate = useNavigate();

  const deliveryFee = settings.deliveryFee || 0;
  const isFreeDelivery =
    settings.freeDeliveryThreshold > 0 && subtotal >= settings.freeDeliveryThreshold;
  const effectiveDeliveryFee = isFreeDelivery ? 0 : deliveryFee;
  const estimatedGrandTotal = subtotal + effectiveDeliveryFee;

  if (cartItems.length === 0) {
    return (
      <div className="container py-4">
        <Breadcrumbs items={[{ label: 'Cart' }]} />
        <div className="card border-0 shadow-sm rounded-4 p-5 my-3 bg-white text-center">
          <EmptyState
            title="Your Shopping Cart is Empty"
            description="Explore our wide range of products across electronics, fashion, mobile accessories, and home goods."
            actionText="Start Shopping"
            actionLink="/shop"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-wrapper py-3">
      <div className="container">
        <Breadcrumbs items={[{ label: 'Cart' }]} />

        <div className="cart-page-heading d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold mb-0">Shopping Cart ({itemCount} items)</h2>
          <Popconfirm
            title="Clear all items?"
            description="Are you sure you want to remove all products from your cart?"
            onConfirm={() => {
              clearCart();
              message.info('Cart cleared');
            }}
            okText="Yes, Clear"
            cancelText="Cancel"
          >
            <Button danger size="small" icon={<DeleteOutlined />}>
              Clear Cart
            </Button>
          </Popconfirm>
        </div>

        <div className="row g-4">
          {/* Left: Cart Items List */}
          <div className="col-12 col-lg-8">
            <div className="cart-items-card card border-0 shadow-sm rounded-4 p-3 bg-white">
              <div className="cart-items-table table-responsive">
                <table className="table align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th scope="col" style={{ width: '45%' }}>
                        Product
                      </th>
                      <th scope="col" className="text-center">
                        Price
                      </th>
                      <th scope="col" className="text-center" style={{ width: '130px' }}>
                        Quantity
                      </th>
                      <th scope="col" className="text-end">
                        Total
                      </th>
                      <th scope="col" style={{ width: '40px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => {
                      const itemTotal = (item.price || 0) * (item.quantity || 1);
                      return (
                        <tr key={item.key || `${item.product}_${item.name}`}>
                          {/* Image & Title */}
                          <td data-label="Product">
                            <div className="d-flex align-items-center gap-3">
                              <Link to={`/product/${item.slug || item.product}`}>
                                <img
                                  src={
                                    item.image ||
                                    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=60'
                                  }
                                  alt={item.name}
                                  className="rounded-3 border"
                                  style={{
                                    width: '64px',
                                    height: '64px',
                                    objectFit: 'cover',
                                  }}
                                />
                              </Link>
                              <div>
                                <Link
                                  to={`/product/${item.slug || item.product}`}
                                  className="cart-item-name text-dark fw-semibold text-decoration-none d-block"
                                >
                                  {item.name}
                                </Link>

                                {/* Selected Variants */}
                                {item.variants && item.variants.length > 0 && (
                                  <div className="d-flex gap-1 flex-wrap mt-1">
                                    {item.variants.map((v, vIdx) => (
                                      <Tag key={vIdx} color="default" className="small">
                                        {v.name}: {v.value}
                                      </Tag>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Unit Price */}
                          <td data-label="Price" className="text-center fw-medium">{formatCurrency(item.price)}</td>

                          {/* Quantity Controls */}
                          <td data-label="Quantity" className="text-center">
                            <div className="btn-group btn-group-sm border rounded-2" role="group">
                              <button
                                type="button"
                                className="btn btn-light px-2"
                                onClick={() =>
                                  updateQuantity(item.product, item.quantity - 1, item.variants)
                                }
                              >
                                –
                              </button>
                              <span className="btn btn-white px-2 fw-bold disabled text-dark">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                className="btn btn-light px-2"
                                disabled={item.stockQuantity && item.quantity >= item.stockQuantity}
                                onClick={() =>
                                  updateQuantity(item.product, item.quantity + 1, item.variants)
                                }
                              >
                                +
                              </button>
                            </div>
                          </td>

                          {/* Item Subtotal */}
                          <td data-label="Total" className="text-end fw-bold text-primary">
                            {formatCurrency(itemTotal)}
                          </td>

                          {/* Remove Button */}
                          <td data-label="Remove" className="text-end">
                            <button
                              type="button"
                              className="btn btn-link text-danger p-0 border-0"
                              onClick={() => removeItem(item.product, item.variants)}
                              title="Remove item"
                            >
                              <DeleteOutlined />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-3">
              <Link to="/shop" className="text-decoration-none text-primary small fw-semibold">
                &larr; Continue Shopping
              </Link>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="col-12 col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white position-sticky" style={{ top: '85px' }}>
              <h5 className="fw-bold mb-3">Order Summary</h5>

              <div className="d-flex justify-content-between mb-2">
                <span className="text-secondary">Subtotal ({itemCount} items)</span>
                <span className="fw-semibold">{formatCurrency(subtotal)}</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span className="text-secondary">Delivery Fee</span>
                <span className="fw-semibold">
                  {isFreeDelivery ? (
                    <span className="text-success fw-bold">FREE</span>
                  ) : (
                    formatCurrency(effectiveDeliveryFee)
                  )}
                </span>
              </div>

              {settings.freeDeliveryThreshold > 0 && !isFreeDelivery && (
                <div className="alert alert-info py-2 px-3 small my-2">
                  Add{' '}
                  <strong>{formatCurrency(settings.freeDeliveryThreshold - subtotal)}</strong>{' '}
                  more to get <strong>Free Delivery</strong>!
                </div>
              )}

              <hr className="my-3" />

              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="h6 fw-bold mb-0">Estimated Total</span>
                <span className="h4 fw-bold text-primary mb-0">
                  {formatCurrency(estimatedGrandTotal)}
                </span>
              </div>

              <div className="p-3 bg-light rounded-3 mb-4 small text-secondary">
                <div className="d-flex align-items-center gap-2 mb-1 text-dark fw-semibold">
                  <SafetyCertificateOutlined className="text-success" />
                  <span>Cash on Delivery (COD)</span>
                </div>
                <span>Pay securely in cash at your doorstep when your order arrives.</span>
              </div>

              <Button
                type="primary"
                size="large"
                block
                className="btn-accent-store border-0 fw-semibold"
                style={{ height: '50px', fontSize: '1.05rem' }}
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout <ArrowRightOutlined />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
