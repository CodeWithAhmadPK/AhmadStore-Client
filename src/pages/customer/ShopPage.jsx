import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Select,
  Input,
  Checkbox,
  Button,
  Drawer,
  Pagination,
  Skeleton,
  Slider,
} from 'antd';
import {
  FilterOutlined,
  ReloadOutlined,
  SearchOutlined,
  ClearOutlined,
} from '@ant-design/icons';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import ProductCard from '../../components/common/ProductCard';
import EmptyState from '../../components/common/EmptyState';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import formatCurrency from '../../utils/formatCurrency';

const { Option } = Select;

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State from URL parameters
  const searchQuery = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || '';
  const subcategoryParam = searchParams.get('subcategory') || '';
  const minPriceParam = searchParams.get('minPrice') || '';
  const maxPriceParam = searchParams.get('maxPrice') || '';
  const inStockParam = searchParams.get('inStock') === 'true';
  const sortParam = searchParams.get('sort') || 'newest';
  const pageParam = parseInt(searchParams.get('page'), 10) || 1;

  // Local filter states
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Price slider state
  const [priceRange, setPriceRange] = useState([
    minPriceParam ? Number(minPriceParam) : 0,
    maxPriceParam ? Number(maxPriceParam) : 50000,
  ]);

  // Load categories list for sidebar
  useEffect(() => {
    let isMounted = true;
    const loadCategories = async () => {
      try {
        const res = await categoryService.getCategories();
        if (isMounted && res?.categories) {
          setCategories(res.categories);
        }
      } catch (err) {
        console.warn('Failed to load categories for shop filter:', err.message);
      }
    };
    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync local search when URL changes
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  // Fetch products from API whenever search params change
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: pageParam,
        limit: 12,
        sort: sortParam,
      };

      if (searchQuery) params.search = searchQuery;
      if (categoryParam) params.category = categoryParam;
      if (subcategoryParam) params.subcategory = subcategoryParam;
      if (minPriceParam) params.minPrice = minPriceParam;
      if (maxPriceParam) params.maxPrice = maxPriceParam;
      if (inStockParam) params.inStock = true;

      const res = await productService.getProducts(params);
      if (res?.success) {
        setProducts(res.products || []);
        setPagination(res.pagination || { page: 1, limit: 12, total: 0, pages: 0 });
      }
    } catch (err) {
      console.error('Error fetching products:', err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, categoryParam, subcategoryParam, minPriceParam, maxPriceParam, inStockParam, sortParam, pageParam]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Update query params helper
  const updateQueryParam = (updates) => {
    const current = Object.fromEntries(searchParams.entries());
    const merged = { ...current, ...updates };

    // Remove empty keys
    Object.keys(merged).forEach((k) => {
      if (merged[k] === '' || merged[k] === null || merged[k] === undefined) {
        delete merged[k];
      }
    });

    // Reset page to 1 whenever filters other than page change
    if (!updates.page) {
      delete merged.page;
    }

    setSearchParams(merged);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateQueryParam({ search: localSearch.trim() });
  };

  const handleCategorySelect = (slug) => {
    if (categoryParam === slug) {
      // Toggle off
      updateQueryParam({ category: '', subcategory: '' });
    } else {
      updateQueryParam({ category: slug, subcategory: '' });
    }
  };

  const handleSubcategorySelect = (subSlug) => {
    if (subcategoryParam === subSlug) {
      updateQueryParam({ subcategory: '' });
    } else {
      updateQueryParam({ subcategory: subSlug });
    }
  };

  const handlePriceApply = () => {
    updateQueryParam({
      minPrice: priceRange[0] > 0 ? priceRange[0] : '',
      maxPrice: priceRange[1] < 50000 ? priceRange[1] : '',
    });
    setFilterDrawerOpen(false);
  };

  const handleResetFilters = () => {
    setLocalSearch('');
    setPriceRange([0, 50000]);
    setSearchParams({});
    setFilterDrawerOpen(false);
  };

  const activeCategoryDoc = categories.find((c) => c.slug === categoryParam);

  // Common Filter Sidebar Component
  const FilterContent = (
    <div className="filter-sidebar-wrapper">
      {/* Search Input Filter */}
      <div className="filter-group mb-4">
        <h6 className="fw-bold mb-2">Search Catalog</h6>
        <form onSubmit={handleSearchSubmit}>
          <Input
            placeholder="Keyword, brand, title..."
            prefix={<SearchOutlined className="text-muted" />}
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            onPressEnter={handleSearchSubmit}
            allowClear
            size="middle"
          />
        </form>
      </div>

      {/* Category Filter */}
      <div className="filter-group mb-4">
        <h6 className="fw-bold mb-2">Departments & Categories</h6>
        <div
          className="category-filter-list"
          style={{ maxHeight: '240px', overflowY: 'auto' }}
        >
          <div
            className={`p-2 rounded-2 cursor-pointer small mb-1 ${
              !categoryParam ? 'bg-primary text-white fw-bold' : 'text-dark'
            }`}
            onClick={() => updateQueryParam({ category: '', subcategory: '' })}
            style={{ cursor: 'pointer' }}
          >
            All Departments
          </div>
          {categories.map((cat) => (
            <div
              key={cat._id}
              className={`p-2 rounded-2 small mb-1 d-flex justify-content-between align-items-center ${
                categoryParam === cat.slug
                  ? 'bg-primary text-white fw-bold'
                  : 'text-dark hover-bg-light'
              }`}
              onClick={() => handleCategorySelect(cat.slug)}
              style={{ cursor: 'pointer' }}
            >
              <span>{cat.name}</span>
              {cat.subcategories?.length > 0 && (
                <span
                  className={`badge ${
                    categoryParam === cat.slug ? 'bg-light text-dark' : 'bg-secondary'
                  } rounded-pill`}
                  style={{ fontSize: '0.65rem' }}
                >
                  {cat.subcategories.length}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Subcategory Filter (If active category has subcategories) */}
      {activeCategoryDoc && activeCategoryDoc.subcategories?.length > 0 && (
        <div className="filter-group mb-4 p-3 bg-light rounded-3">
          <h6 className="fw-bold mb-2 small text-uppercase text-secondary">
            {activeCategoryDoc.name} Subcategories
          </h6>
          <div className="d-flex flex-wrap gap-1">
            <span
              className={`badge ${
                !subcategoryParam ? 'bg-primary text-white' : 'bg-white text-dark border'
              } p-2 cursor-pointer`}
              onClick={() => updateQueryParam({ subcategory: '' })}
              style={{ cursor: 'pointer' }}
            >
              All
            </span>
            {activeCategoryDoc.subcategories.map((sub) => (
              <span
                key={sub.slug}
                className={`badge ${
                  subcategoryParam === sub.slug
                    ? 'bg-primary text-white'
                    : 'bg-white text-dark border'
                } p-2 cursor-pointer`}
                onClick={() => handleSubcategorySelect(sub.slug)}
                style={{ cursor: 'pointer' }}
              >
                {sub.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Price Range Filter */}
      <div className="filter-group mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="fw-bold mb-0">Price Range</h6>
          <span className="small text-muted">
            {formatCurrency(priceRange[0])} – {formatCurrency(priceRange[1])}
          </span>
        </div>
        <Slider
          range
          min={0}
          max={50000}
          step={500}
          value={priceRange}
          onChange={(val) => setPriceRange(val)}
        />
        <Button size="small" type="default" block onClick={handlePriceApply} className="mt-2">
          Apply Price Filter
        </Button>
      </div>

      {/* In-Stock Filter */}
      <div className="filter-group mb-4">
        <Checkbox
          checked={inStockParam}
          onChange={(e) => updateQueryParam({ inStock: e.target.checked ? 'true' : '' })}
        >
          <span className="fw-semibold">In Stock Items Only</span>
        </Checkbox>
      </div>

      {/* Reset Filters */}
      <Button
        danger
        icon={<ClearOutlined />}
        block
        onClick={handleResetFilters}
      >
        Clear All Filters
      </Button>
    </div>
  );

  return (
    <div className="shop-page-wrapper">
      <div className="container py-3">
        <Breadcrumbs
          items={[
            { label: 'Shop All', link: '/shop' },
            ...(activeCategoryDoc ? [{ label: activeCategoryDoc.name }] : []),
          ]}
        />

        {/* Top Control Bar */}
        <div className="card border-0 shadow-sm rounded-3 p-3 mb-4 bg-white">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <h4 className="fw-bold mb-1">
                {activeCategoryDoc ? activeCategoryDoc.name : 'All Products'}
              </h4>
              <p className="text-secondary small mb-0">
                {loading
                  ? 'Loading products...'
                  : `Showing ${products.length} of ${pagination.total} product${
                      pagination.total === 1 ? '' : 's'
                    }`}
                {searchQuery && (
                  <span className="ms-2 badge bg-light text-dark border">
                    Query: "{searchQuery}"
                  </span>
                )}
              </p>
            </div>

            <div className="d-flex align-items-center gap-2">
              {/* Mobile Filter Button */}
              <Button
                className="d-lg-none"
                icon={<FilterOutlined />}
                onClick={() => setFilterDrawerOpen(true)}
              >
                Filters
              </Button>

              {/* Sorting Selector */}
              <div className="d-flex align-items-center gap-2">
                <span className="text-muted small d-none d-sm-inline">Sort:</span>
                <Select
                  value={sortParam}
                  style={{ width: 170 }}
                  onChange={(val) => updateQueryParam({ sort: val })}
                >
                  <Option value="newest">Newest Arrivals</Option>
                  <Option value="price-asc">Price: Low to High</Option>
                  <Option value="price-desc">Price: High to Low</Option>
                  <Option value="featured">Featured First</Option>
                  <Option value="oldest">Oldest</Option>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="row g-4">
          {/* Desktop Filter Sidebar */}
          <div className="col-lg-3 d-none d-lg-block">
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white position-sticky" style={{ top: '85px' }}>
              {FilterContent}
            </div>
          </div>

          {/* Product Grid Area */}
          <div className="col-12 col-lg-9">
            {loading ? (
              <div className="row g-4">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="col-12 col-sm-6 col-md-4">
                    <Skeleton active paragraph={{ rows: 3 }} />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <EmptyState
                title="No Products Match Your Criteria"
                description="Try clearing filters or searching for another term like 'shoes', 'watch', or 'cable'."
                actionText="Reset All Filters"
                onAction={handleResetFilters}
              />
            ) : (
              <>
                <div className="row g-4">
                  {products.map((product) => (
                    <div key={product._id} className="col-12 col-sm-6 col-md-4">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="d-flex justify-content-center mt-5 mb-3">
                    <Pagination
                      current={pagination.page}
                      total={pagination.total}
                      pageSize={pagination.limit}
                      onChange={(page) => updateQueryParam({ page })}
                      showSizeChanger={false}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <Drawer
        title="Filter Products"
        placement="right"
        width="min(360px, 100vw)"
        onClose={() => setFilterDrawerOpen(false)}
        open={filterDrawerOpen}
      >
        {FilterContent}
      </Drawer>
    </div>
  );
};

export default ShopPage;
