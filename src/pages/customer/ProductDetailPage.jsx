import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button, message, Tag, Skeleton, Divider } from 'antd';
import {
  ShoppingCartOutlined,
  ThunderboltOutlined,
  CheckOutlined,
  SafetyCertificateOutlined,
  CarOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import ProductCard from '../../components/common/ProductCard';
import EmptyState from '../../components/common/EmptyState';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';
import productService from '../../services/productService';
import formatCurrency from '../../utils/formatCurrency';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { settings } = useSettings();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedVariants, setSelectedVariants] = useState({});
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    let isMounted = true;
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const res = await productService.getProductBySlugOrId(slug);
        if (isMounted && res?.product) {
          const prod = res.product;
          setProduct(prod);

          // Default primary image
          const primary =
            prod.images && prod.images.length > 0
              ? (prod.images.find((img) => img.isPrimary) || prod.images[0]).url
              : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=70';
          setSelectedImage(primary);

          // Default initial variants selection
          if (prod.variants && prod.variants.length > 0) {
            const initialVars = {};
            prod.variants.forEach((v) => {
              if (v.options && v.options.length > 0) {
                initialVars[v.name] = v.options[0];
              }
            });
            setSelectedVariants(initialVars);
          }

          // Fetch related products
          if (prod._id) {
            const relRes = await productService.getRelatedProducts(prod._id, 4);
            if (isMounted && relRes?.products) {
              setRelatedProducts(relRes.products);
            }
          }
        }
      } catch (err) {
        console.error('Error loading product details:', err.message);
        setProduct(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProductData();
    window.scrollTo(0, 0);

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const handleVariantSelect = (variantName, option) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [variantName]: option,
    }));
  };

  const getFormattedVariantsList = () => {
    return Object.entries(selectedVariants).map(([name, value]) => ({ name, value }));
  };

  const isOutOfStock = !product || product.stockQuantity <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem(product, quantity, getFormattedVariantsList());
    message.success(`${product.name} added to your cart!`);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addItem(product, quantity, getFormattedVariantsList());
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="container py-5">
        <Skeleton active paragraph={{ rows: 10 }} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-5">
        <EmptyState
          title="Product Not Found"
          description="The product you are looking for may have been removed or is temporarily unavailable."
          actionText="Browse Catalog"
          actionLink="/shop"
        />
      </div>
    );
  }

  const hasDiscount =
    product.salePrice !== null &&
    product.salePrice !== undefined &&
    product.salePrice > 0 &&
    product.salePrice < product.price;

  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const productImages =
    product.images && product.images.length > 0
      ? product.images
      : [{ url: selectedImage, isPrimary: true }];

  return (
    <div className="product-details-wrapper py-3">
      <div className="container">
        <Breadcrumbs
          items={[
            { label: 'Shop', link: '/shop' },
            ...(product.category
              ? [{ label: product.category.name, link: `/category/${product.category.slug}` }]
              : []),
            { label: product.name },
          ]}
        />

        <div className="card border-0 shadow-sm rounded-4 p-4 mb-5 bg-white">
          <div className="row g-5">
            {/* Left: Product Image Gallery */}
            <div className="col-12 col-md-6">
              <div className="product-gallery-container">
                {/* Main Active Image */}
                <div
                  className="main-image-frame rounded-4 overflow-hidden mb-3 position-relative bg-light d-flex align-items-center justify-content-center"
                >
                  {hasDiscount && (
                    <span
                      className="badge bg-danger position-absolute top-0 start-0 m-3 px-3 py-2 fw-bold"
                      style={{ fontSize: '0.85rem' }}
                    >
                      {discountPercent}% OFF
                    </span>
                  )}
                  <img
                    src={selectedImage}
                    alt={product.name}
                    className="img-fluid rounded-3"
                    style={{ maxHeight: '480px', objectFit: 'contain' }}
                  />
                </div>

                {/* Thumbnails Row */}
                {productImages.length > 1 && (
                  <div className="d-flex gap-2 overflow-auto py-2">
                    {productImages.map((img, idx) => (
                      <div
                        key={idx}
                        className={`thumbnail-box p-1 border rounded-3 cursor-pointer ${
                          selectedImage === img.url ? 'border-primary border-2' : 'border-light'
                        }`}
                        onClick={() => setSelectedImage(img.url)}
                        style={{
                          width: '70px',
                          height: '70px',
                          cursor: 'pointer',
                          flexShrink: 0,
                        }}
                      >
                        <img
                          src={img.url}
                          alt={`${product.name} thumb ${idx}`}
                          className="w-100 h-100 rounded-2"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Product Info & Actions */}
            <div className="col-12 col-md-6">
              {product.brand && (
                <span className="text-secondary small fw-bold text-uppercase letter-spacing-1">
                  Brand: {product.brand}
                </span>
              )}

              <h1 className="h2 fw-bold text-dark mt-1 mb-2">{product.name}</h1>

              {/* Category & SKU row */}
              <div className="product-info-meta d-flex align-items-center gap-3 mb-3 text-secondary small">
                {product.category && (
                  <span>
                    Category:{' '}
                    <Link
                      to={`/category/${product.category.slug}`}
                      className="text-primary fw-semibold"
                    >
                      {product.category.name}
                    </Link>
                  </span>
                )}
                {product.sku && <span>SKU: {product.sku}</span>}
              </div>

              {/* Price & Stock Badge */}
              <div className="product-price-stock-row d-flex align-items-center gap-3 my-3">
                <span className="h2 fw-bold text-primary mb-0">
                  {formatCurrency(hasDiscount ? product.salePrice : product.price)}
                </span>
                {hasDiscount && (
                  <span className="h4 text-muted text-decoration-line-through mb-0">
                    {formatCurrency(product.price)}
                  </span>
                )}
                <Tag
                  color={isOutOfStock ? 'red' : 'green'}
                  className="px-3 py-1 fw-bold"
                  style={{ fontSize: '0.85rem' }}
                >
                  {isOutOfStock ? 'Out of Stock' : `In Stock (${product.stockQuantity} available)`}
                </Tag>
              </div>

              <Divider className="my-3" />

              {/* Dynamic Product Variants (Size, Color, etc.) */}
              {product.variants && product.variants.length > 0 && (
                <div className="product-variants-wrap mb-4">
                  {product.variants.map((v, idx) => (
                    <div key={idx} className="mb-3">
                      <label className="fw-semibold small text-dark d-block mb-2">
                        Select {v.name}:{' '}
                        <span className="text-primary">{selectedVariants[v.name]}</span>
                      </label>
                      <div className="d-flex gap-2 flex-wrap">
                        {v.options.map((opt) => {
                          const isSelected = selectedVariants[v.name] === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              className={`btn btn-sm ${
                                isSelected
                                  ? 'btn-primary'
                                  : 'btn-outline-secondary bg-white'
                              } px-3 py-1 rounded-2 fw-medium`}
                              onClick={() => handleVariantSelect(v.name, opt)}
                            >
                              {isSelected && <CheckOutlined className="me-1" />}
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Quantity Selector & Action Buttons */}
              <div className="purchase-action-group mb-4">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <span className="fw-semibold small">Quantity:</span>
                  <div className="btn-group border rounded-3" role="group">
                    <button
                      type="button"
                      className="btn btn-sm btn-light px-3"
                      disabled={isOutOfStock || quantity <= 1}
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    >
                      –
                    </button>
                    <span className="btn btn-sm btn-white px-3 fw-bold disabled text-dark">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      className="btn btn-sm btn-light px-3"
                      disabled={isOutOfStock || quantity >= product.stockQuantity}
                      onClick={() => setQuantity((q) => Math.min(product.stockQuantity, q + 1))}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="row g-2">
                  <div className="col-12 col-sm-6">
                    <Button
                      type="default"
                      size="large"
                      block
                      icon={<ShoppingCartOutlined />}
                      disabled={isOutOfStock}
                      onClick={handleAddToCart}
                      className="fw-semibold"
                      style={{ height: '48px' }}
                    >
                      Add to Cart
                    </Button>
                  </div>
                  <div className="col-12 col-sm-6">
                    <Button
                      type="primary"
                      size="large"
                      block
                      icon={<ThunderboltOutlined />}
                      disabled={isOutOfStock}
                      onClick={handleBuyNow}
                      className="btn-accent-store border-0 fw-semibold"
                      style={{ height: '48px' }}
                    >
                      Buy Now (COD)
                    </Button>
                  </div>
                </div>
              </div>

              {/* Trust Badges in Detail Page */}
              <div className="bg-light p-3 rounded-3 mt-4">
                <div className="trust-badges-row row g-2 text-secondary small">
                  <div className="col-6 d-flex align-items-center gap-2">
                    <CarOutlined className="text-primary" />
                    <span>Cash on Delivery Nationwide</span>
                  </div>
                  <div className="col-6 d-flex align-items-center gap-2">
                    <SafetyCertificateOutlined className="text-success" />
                    <span>Doorstep Parcel Inspection</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description & Technical Specifications */}
          <div className="mt-5 pt-4 border-top">
            <h4 className="fw-bold mb-3">Product Description</h4>
            <div
              className="text-secondary leading-relaxed mb-4"
              style={{ whiteSpace: 'pre-line', lineHeight: '1.7' }}
            >
              {product.description}
            </div>

            {/* Specifications Table */}
            {product.specifications && product.specifications.length > 0 && (
              <div className="mt-4">
                <h5 className="fw-bold mb-3">Specifications & Features</h5>
                <div className="table-responsive" style={{ maxWidth: '650px' }}>
                  <table className="table table-bordered table-striped small mb-0">
                    <tbody>
                      {product.specifications.map((spec, sIdx) => (
                        <tr key={sIdx}>
                          <td className="fw-semibold bg-light" style={{ width: '40%' }}>
                            {spec.key}
                          </td>
                          <td>{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="related-products-section my-5">
            <h3 className="fw-bold mb-4">Related Products</h3>
            <div className="row g-4">
              {relatedProducts.map((relProd) => (
                <div key={relProd._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                  <ProductCard product={relProd} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
