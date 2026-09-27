import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Button,
  Card,
  message,
  Space,
  Divider,
  Skeleton,
} from 'antd';
import {
  ArrowLeftOutlined,
  SaveOutlined,
  PlusOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';
import ImageUploader from '../../components/admin/ImageUploader';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';

const { Option } = Select;
const { TextArea } = Input;

const AdminProductFormPage = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [categories, setCategories] = useState([]);
  const [selectedCategoryDoc, setSelectedCategoryDoc] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);

  // Fetch categories list
  useEffect(() => {
    let isMounted = true;
    const fetchCats = async () => {
      try {
        const res = await categoryService.getAdminCategories();
        if (isMounted && res?.categories) {
          setCategories(res.categories);
        }
      } catch (err) {
        console.warn('Failed to load categories:', err.message);
      }
    };
    fetchCats();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch existing product data if editing
  useEffect(() => {
    let isMounted = true;
    if (isEditing) {
      const loadProduct = async () => {
        try {
          setFetching(true);
          const res = await productService.getProductBySlugOrId(id);
          if (isMounted && res?.product) {
            const p = res.product;
            form.setFieldsValue({
              name: p.name,
              brand: p.brand,
              category: p.category?._id || p.category,
              subcategory: p.subcategory,
              description: p.description,
              price: p.price,
              salePrice: p.salePrice,
              stockQuantity: p.stockQuantity,
              sku: p.sku,
              isActive: p.isActive,
              isFeatured: p.isFeatured,
              variants: p.variants || [],
              specifications: p.specifications || [],
            });
            setImages(p.images || []);
          }
        } catch (err) {
          message.error(err.message || 'Failed to load product details');
          navigate('/admin/products');
        } finally {
          if (isMounted) setFetching(false);
        }
      };
      loadProduct();
    }
    return () => {
      isMounted = false;
    };
  }, [id, isEditing, form, navigate]);

  // Handle Category selection change to update subcategories
  const handleCategoryChange = (catId) => {
    const found = categories.find((c) => c._id === catId);
    setSelectedCategoryDoc(found || null);
    form.setFieldsValue({ subcategory: undefined });
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);

      if (values.salePrice && values.salePrice > values.price) {
        message.error('Sale price cannot exceed the regular product price');
        setLoading(false);
        return;
      }

      const payload = {
        ...values,
        images,
        price: Number(values.price),
        salePrice: values.salePrice ? Number(values.salePrice) : null,
        stockQuantity: Number(values.stockQuantity) || 0,
      };

      if (isEditing) {
        await productService.updateProduct(id, payload);
        message.success('Product updated successfully!');
      } else {
        await productService.createProduct(payload);
        message.success('Product created successfully!');
      }

      navigate('/admin/products');
    } catch (err) {
      message.error(err.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="container-fluid py-4">
        <Skeleton active paragraph={{ rows: 12 }} />
      </div>
    );
  }

  const availableSubcategories =
    selectedCategoryDoc?.subcategories ||
    categories.find((c) => c._id === form.getFieldValue('category'))?.subcategories ||
    [];

  return (
    <div className="admin-product-form-wrapper" style={{ maxWidth: '980px' }}>
      <div className="d-flex align-items-center gap-3 mb-4">
        <Link to="/admin/products">
          <Button icon={<ArrowLeftOutlined />} />
        </Link>
        <div>
          <h3 className="fw-bold mb-1">{isEditing ? 'Edit Product' : 'Add New Product'}</h3>
          <p className="text-secondary small mb-0">
            Configure catalog item details, Cloudinary media, variants, and inventory.
          </p>
        </div>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          isActive: true,
          isFeatured: false,
          stockQuantity: 10,
          variants: [],
          specifications: [],
        }}
      >
        {/* Basic Information Card */}
        <Card title="General Information" className="shadow-sm border-0 rounded-4 mb-4">
          <Form.Item
            label="Product Title"
            name="name"
            rules={[{ required: true, message: 'Product title is required' }]}
          >
            <Input placeholder="e.g. Wireless Active Noise-Cancelling Headphones Pro" size="large" />
          </Form.Item>

          <div className="row g-3">
            <div className="col-12 col-md-6">
              <Form.Item
                label="Department / Category"
                name="category"
                rules={[{ required: true, message: 'Please select a category' }]}
              >
                <Select
                  placeholder="Select Department"
                  size="large"
                  onChange={handleCategoryChange}
                >
                  {categories.map((cat) => (
                    <Option key={cat._id} value={cat._id}>
                      {cat.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <div className="col-12 col-md-6">
              <Form.Item label="Subcategory" name="subcategory">
                <Select
                  placeholder={
                    availableSubcategories.length > 0
                      ? 'Select Subcategory'
                      : 'No subcategories in this category'
                  }
                  size="large"
                  allowClear
                  disabled={availableSubcategories.length === 0}
                >
                  {availableSubcategories.map((sub) => (
                    <Option key={sub.slug} value={sub.slug}>
                      {sub.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-12 col-md-6">
              <Form.Item label="Brand Name (Optional)" name="brand">
                <Input placeholder="e.g. SoundMaster, ChefLine, Sony" />
              </Form.Item>
            </div>

            <div className="col-12 col-md-6">
              <Form.Item label="SKU / Item Code" name="sku">
                <Input placeholder="e.g. ELEC-ANC-001" style={{ textTransform: 'uppercase' }} />
              </Form.Item>
            </div>
          </div>

          <Form.Item
            label="Detailed Description"
            name="description"
            rules={[{ required: true, message: 'Product description is required' }]}
          >
            <TextArea rows={5} placeholder="Describe product features, build materials, warranty, package contents..." />
          </Form.Item>
        </Card>

        {/* Pricing & Stock Card */}
        <Card title="Pricing & Inventory" className="shadow-sm border-0 rounded-4 mb-4">
          <div className="row g-3">
            <div className="col-12 col-md-4">
              <Form.Item
                label="Regular Price (PKR)"
                name="price"
                rules={[{ required: true, message: 'Price is required' }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  size="large"
                  placeholder="8500"
                  prefix="Rs."
                />
              </Form.Item>
            </div>

            <div className="col-12 col-md-4">
              <Form.Item
                label="Sale Price (PKR - Optional)"
                name="salePrice"
                extra="Leave blank if item is not on sale"
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  size="large"
                  placeholder="6999"
                  prefix="Rs."
                />
              </Form.Item>
            </div>

            <div className="col-12 col-md-4">
              <Form.Item
                label="Stock Quantity"
                name="stockQuantity"
                rules={[{ required: true, message: 'Stock quantity is required' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} size="large" placeholder="25" />
              </Form.Item>
            </div>
          </div>

          <div className="d-flex flex-wrap gap-3 gap-md-5 mt-2">
            <Form.Item label="Active in Store" name="isActive" valuePropName="checked">
              <Switch checkedChildren="Active" unCheckedChildren="Hidden" />
            </Form.Item>

            <Form.Item label="Featured Product" name="isFeatured" valuePropName="checked">
              <Switch checkedChildren="Featured" unCheckedChildren="Normal" />
            </Form.Item>
          </div>
        </Card>

        {/* Images Upload Card (Cloudinary) */}
        <Card title="Product Media (Cloudinary)" className="shadow-sm border-0 rounded-4 mb-4">
          <p className="text-secondary small mb-3">
            Upload images directly to Cloudinary or specify image URLs. The first or starred image is the primary thumbnail.
          </p>
          <ImageUploader value={images} onChange={(newImages) => setImages(newImages)} maxImages={6} />
        </Card>

        {/* Variants Builder Card (Size, Color, etc.) */}
        <Card title="Product Variants (Size, Color, etc.)" className="shadow-sm border-0 rounded-4 mb-4">
          <p className="text-secondary small mb-3">
            Add variant attributes and allowed options. Customers can choose between these when adding to cart.
          </p>

          <Form.List name="variants">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} className="p-3 bg-light rounded-3 mb-3 border">
                    <div className="row g-2 align-items-center">
                      <div className="col-12 col-md-4">
                        <Form.Item
                          {...restField}
                          name={[name, 'name']}
                          label="Variant Name"
                          rules={[{ required: true, message: 'Variant name required (e.g. Size)' }]}
                          className="mb-0"
                        >
                          <Input placeholder="e.g. Size, Color, Capacity" />
                        </Form.Item>
                      </div>

                      <div className="col-12 col-md-7">
                        <Form.Item
                          {...restField}
                          name={[name, 'options']}
                          label="Options (Type and press Enter)"
                          rules={[{ required: true, message: 'Provide at least one option' }]}
                          className="mb-0"
                        >
                          <Select
                            mode="tags"
                            placeholder="e.g. Small, Medium, Large"
                            tokenSeparators={[',']}
                          />
                        </Form.Item>
                      </div>

                      <div className="col-12 col-md-1 text-end pt-4">
                        <MinusCircleOutlined
                          className="text-danger"
                          style={{ fontSize: '1.25rem' }}
                          onClick={() => remove(name)}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add Product Variant
                </Button>
              </>
            )}
          </Form.List>
        </Card>

        {/* Specifications Builder Card */}
        <Card title="Product Specifications & Features" className="shadow-sm border-0 rounded-4 mb-4">
          <p className="text-secondary small mb-3">
            Technical attributes and key details (e.g. Material: Stainless Steel, Battery: 40 Hours).
          </p>

          <Form.List name="specifications">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} className="responsive-form-row" style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'key']}
                      rules={[{ required: true, message: 'Key required' }]}
                    >
                      <Input placeholder="e.g. Battery Life, Material" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'value']}
                      rules={[{ required: true, message: 'Value required' }]}
                    >
                      <Input placeholder="e.g. 40 Hours, 100% Cotton" />
                    </Form.Item>
                    <MinusCircleOutlined className="text-danger" onClick={() => remove(name)} />
                  </Space>
                ))}

                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Add Specification Item
                </Button>
              </>
            )}
          </Form.List>
        </Card>

        {/* Action Buttons */}
        <div className="d-flex justify-content-end gap-3 mb-5">
          <Link to="/admin/products">
            <Button size="large">Cancel</Button>
          </Link>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            icon={<SaveOutlined />}
            loading={loading}
            className="btn-accent-store border-0 px-4"
          >
            {isEditing ? 'Save Product Changes' : 'Publish Product'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AdminProductFormPage;
