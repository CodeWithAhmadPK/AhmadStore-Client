import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Select, Pagination, Skeleton } from 'antd';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import ProductCard from '../../components/common/ProductCard';
import EmptyState from '../../components/common/EmptyState';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';

const { Option } = Select;

const CategoryPage = () => {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const subcategoryParam = searchParams.get('subcategory') || '';
  const sortParam = searchParams.get('sort') || 'newest';
  const pageParam = parseInt(searchParams.get('page'), 10) || 1;

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);

  // Load category details
  useEffect(() => {
    let isMounted = true;
    const fetchCategory = async () => {
      try {
        const res = await categoryService.getCategoryByIdOrSlug(slug);
        if (isMounted && res?.category) {
          setCategory(res.category);
        }
      } catch (err) {
        console.warn('Failed to load category metadata:', err.message);
      }
    };
    fetchCategory();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Load products in this category
  const fetchCategoryProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        category: slug,
        page: pageParam,
        limit: 12,
        sort: sortParam,
      };

      if (subcategoryParam) params.subcategory = subcategoryParam;

      const res = await productService.getProducts(params);
      if (res?.success) {
        setProducts(res.products || []);
        setPagination(res.pagination || { page: 1, limit: 12, total: 0, pages: 0 });
      }
    } catch (err) {
      console.error('Failed to load products for category:', err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [slug, subcategoryParam, sortParam, pageParam]);

  useEffect(() => {
    fetchCategoryProducts();
  }, [fetchCategoryProducts]);

  const updateSubcategory = (subSlug) => {
    const current = Object.fromEntries(searchParams.entries());
    if (subcategoryParam === subSlug) {
      delete current.subcategory;
    } else {
      current.subcategory = subSlug;
    }
    delete current.page;
    setSearchParams(current);
  };

  const updateSort = (sortVal) => {
    const current = Object.fromEntries(searchParams.entries());
    current.sort = sortVal;
    delete current.page;
    setSearchParams(current);
  };

  const updatePage = (newPage) => {
    const current = Object.fromEntries(searchParams.entries());
    current.page = newPage;
    setSearchParams(current);
  };

  const categoryTitle = category?.name || slug?.replace(/-/g, ' ');

  return (
    <div className="category-page-wrapper">
      <div className="container py-3">
        <Breadcrumbs
          items={[
            { label: 'Shop', link: '/shop' },
            { label: categoryTitle },
          ]}
        />

        {/* Category Header Banner */}
        <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <h2 className="fw-bold mb-1 text-capitalize">{categoryTitle}</h2>
              <p className="text-secondary small mb-0">
                {category?.description ||
                  `Explore high-grade merchandise in ${categoryTitle} with Cash on Delivery.`}
              </p>
            </div>

            <div className="d-flex align-items-center gap-2">
              <span className="text-muted small">Sort:</span>
              <Select value={sortParam} style={{ width: 170 }} onChange={updateSort}>
                <Option value="newest">Newest Arrivals</Option>
                <Option value="price-asc">Price: Low to High</Option>
                <Option value="price-desc">Price: High to Low</Option>
                <Option value="featured">Featured First</Option>
              </Select>
            </div>
          </div>

          {/* Subcategories Filter Chips */}
          {category?.subcategories && category.subcategories.length > 0 && (
            <div className="mt-3 pt-3 border-top d-flex align-items-center gap-2 flex-wrap">
              <span className="small text-muted fw-semibold me-1">Subcategories:</span>
              <button
                type="button"
                className={`btn btn-sm ${
                  !subcategoryParam ? 'btn-primary' : 'btn-outline-secondary'
                } rounded-pill px-3`}
                onClick={() => updateSubcategory('')}
              >
                All
              </button>
              {category.subcategories.map((sub) => (
                <button
                  key={sub.slug}
                  type="button"
                  className={`btn btn-sm ${
                    subcategoryParam === sub.slug ? 'btn-primary' : 'btn-outline-secondary'
                  } rounded-pill px-3`}
                  onClick={() => updateSubcategory(sub.slug)}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="row g-4">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <Skeleton active paragraph={{ rows: 3 }} />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            title={`No Products in ${categoryTitle}`}
            description="We are regularly updating our inventory. Check back soon or explore other departments."
            actionText="Browse All Departments"
            actionLink="/shop"
          />
        ) : (
          <>
            <div className="row g-4">
              {products.map((product) => (
                <div key={product._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {pagination.pages > 1 && (
              <div className="d-flex justify-content-center mt-5 mb-3">
                <Pagination
                  current={pagination.page}
                  total={pagination.total}
                  pageSize={pagination.limit}
                  onChange={updatePage}
                  showSizeChanger={false}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
