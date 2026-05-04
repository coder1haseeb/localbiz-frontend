'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Spinner from '@/components/Spinner';

export default function DashboardPage() {
  const router = useRouter();
  const [business, setBusiness] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedBusiness = localStorage.getItem('userBusiness');

    if (!storedToken || !storedBusiness) {
      router.push('/login');
      return;
    }

    setToken(storedToken);
    setBusiness(JSON.parse(storedBusiness));
    fetchProducts(storedToken, JSON.parse(storedBusiness)._id);
  }, []);

  const fetchProducts = async (authToken, businessId) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products/business/${businessId}/products`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const data = await res.json();
      if (data.success) {
        setProducts(data.data.products || []);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userBusiness');
    localStorage.removeItem('businessOwnerData');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              LocalBiz
            </h1>
            <p className="text-sm text-gray-600">Business Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold text-gray-800">{business?.storeName}</p>
              <p className="text-xs text-gray-500">{business?.city}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-blue-600">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">{business?.storeName}</h2>
                <p className="text-gray-600 mb-4">{business?.description}</p>
                <div className="flex gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <span className="font-semibold">📍</span> {business?.city}, {business?.address}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="font-semibold">📞</span> {business?.phone}
                  </span>
                </div>
              </div>
              {business?.logo && (
                <div className="w-24 h-24 rounded-lg overflow-hidden shadow-md">
                  <img
                    src={business.logo}
                    alt={business.storeName}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Products ({products.length})</h3>
            <button
              onClick={() => setShowAddProduct(!showAddProduct)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
            >
              {showAddProduct ? '✕ Cancel' : '+ Add Product'}
            </button>
          </div>

          {/* Add Product Form */}
          {showAddProduct && (
            <AddProductForm
              businessId={business?._id}
              token={token}
              onSuccess={() => {
                setShowAddProduct(false);
                fetchProducts(token, business._id);
              }}
            />
          )}

          {/* Products Grid */}
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">No products yet.</p>
              <button
                onClick={() => setShowAddProduct(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Your First Product
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <ProductCard
                  key={product._id}
                  product={product}
                  token={token}
                  onDelete={() => fetchProducts(token, business._id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function AddProductForm({ businessId, token, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stockQty: '',
    status: 'active',
    images: [],
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        stockQty: parseInt(formData.stockQty) || 0,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products/business/${businessId}/products`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(submitData),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert('Product added successfully!');
        onSuccess();
      } else if (data.errors) {
        alert(`Error: ${data.errors.map(e => e.message).join(', ')}`);
      } else {
        alert(data.message || 'Failed to add product');
      }
    } catch (err) {
      console.error('Error adding product:', err);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-lg mb-8 border-2 border-blue-200">
      <h4 className="text-xl font-bold text-gray-800 mb-6">Add New Product</h4>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g. Organic Cotton Shirt"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Price (PKR) *</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            step="0.01"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0.00"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe your product..."
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g. Clothing"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Quantity</label>
          <input
            type="number"
            name="stockQty"
            value={formData.stockQty}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="active">Active</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        <div className="md:col-span-2 flex gap-4 justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? <Spinner /> : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
}

function ProductCard({ product, token, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    setIsDeleting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products/${product._id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        alert('Product deleted successfully');
        onDelete();
      } else {
        alert('Failed to delete product');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('An error occurred');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {product.images && product.images.length > 0 && (
        <div className="w-full h-40 bg-gray-200 overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <h4 className="text-lg font-bold text-gray-800 truncate">{product.name}</h4>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{product.description}</p>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-lg text-blue-600">Rs {product.price}</span>
            <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
              product.status === 'active'
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {product.status}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Stock: <span className="font-bold">{product.stockQty}</span></span>
            {product.category && <span className="text-gray-600">Category: <span className="font-bold">{product.category}</span></span>}
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/dashboard/products/${product._id}/edit`}
            className="flex-1 px-4 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-semibold disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
