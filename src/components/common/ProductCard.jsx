import React from 'react';
import { Link } from 'react-router-dom';
import { Button, message } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useCart } from '../../context/CartContext';
import formatCurrency from '../../utils/formatCurrency';

const ProductCard = ({ product }) => {
  const { addItem } = useCart();

  if (!product) return null;

  const hasDiscount =
    product.salePrice !== null &&
    product.salePrice !== undefined &&
    product.salePrice > 0 &&
    product.salePrice < product.price;

  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const primaryImage =
    product.images && product.images.length > 0
      ? (product.images.find((img) => img.isPrimary) || product.images[0]).url
      : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60';

  const isOutOfStock = product.stockQuantity <= 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    addItem(product, 1);
    message.success(`${product.name} added to cart!`);
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product.slug || product._id}`}>
        <div className="product-image-wrap">
          {hasDiscount && <span className="badge-corner badge-sale">{discountPercent}% OFF</span>}
          <img src={primaryImage} alt={product.name} loading="lazy" />
        </div>
      </Link>

      <div className="product-body">
        {product.category?.name && (
          <span className="product-category-name">{product.category.name}</span>
        )}

        <Link to={`/product/${product.slug || product._id}`}>
          <h4 className="product-title" title={product.name}>
            {product.name}
          </h4>
        </Link>

        <div className="product-price-stock-row d-flex align-items-center justify-content-between mb-3">
          <div className="product-price-row">
            <span className="current-price">
              {formatCurrency(hasDiscount ? product.salePrice : product.price)}
            </span>
            {hasDiscount && (
              <span className="old-price">{formatCurrency(product.price)}</span>
            )}
          </div>

          <span className={`badge-stock ${isOutOfStock ? 'out-of-stock' : 'in-stock'}`}>
            {isOutOfStock ? 'Out of Stock' : 'In Stock'}
          </span>
        </div>

        <Button
          type="primary"
          icon={<ShoppingCartOutlined />}
          disabled={isOutOfStock}
          onClick={handleAddToCart}
          className="w-100 mt-auto"
        >
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
