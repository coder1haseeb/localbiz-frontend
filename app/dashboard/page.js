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
      <div className="min-h-screen flex items-center justify-center bg-[#f7f9fb]">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <style>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        .dash-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1.5px solid #e2e8f0;
          border-radius: 0.75rem;
          background: #f8fafc;
          font-size: 0.875rem;
          color: #191c1e;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .dash-input:focus {
          border-color: #4648d4;
          box-shadow: 0 0 0 3px rgba(70, 72, 212, 0.1);
          background: #fff;
        }
        .dash-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.4rem;
        }
      `}</style>

      <div className="flex min-h-screen bg-[#f7f9fb]">
        {/* Sidebar */}
        <aside className="h-screen w-72 fixed left-0 top-0 bg-[#f2f4f6] flex flex-col p-4 space-y-2 font-['Inter'] text-[13px] font-medium z-40">
          <div className="flex items-center gap-3 px-3 py-6 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4648d4] to-[#6b38d4] flex items-center justify-center text-white">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>diamond</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#191c1e] leading-none">LocalBiz</h1>
              <p className="text-[11px] text-slate-500 font-normal">Business Admin</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            <div className="flex items-center gap-3 px-4 py-3 bg-white text-[#4648d4] shadow-sm rounded-lg font-semibold">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
              <span>Products</span>
            </div>
            <Link href="/home" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] hover:translate-x-1 transition-all duration-300 rounded-lg cursor-pointer">
              <span className="material-symbols-outlined">storefront</span>
              <span>Marketplace</span>
            </Link>
          </nav>

          {/* Store info chip */}
          {business && (
            <div className="p-4 bg-white/60 rounded-2xl border border-white/40">
              <div className="flex items-center gap-3">
                {business.logo ? (
                  <img src={business.logo} alt={business.storeName} className="w-10 h-10 rounded-xl object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4648d4] to-[#6b38d4] flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>store</span>
                  </div>
                )}
                <div className="overflow-hidden">
                  <p className="text-[13px] font-bold text-[#191c1e] truncate">{business.storeName}</p>
                  <p className="text-[11px] text-slate-500">{business.city}</p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full py-3 px-4 text-red-500 font-bold text-sm hover:bg-red-50 rounded-lg transition-all"
          >
            <span className="material-symbols-outlined">logout</span>
            Logout
          </button>
        </aside>

        {/* Main Content */}
        <main className="ml-72 flex-1 p-8 space-y-8">

          {/* Page Header */}
          <section>
            <h2 className="text-3xl font-bold tracking-tight text-[#191c1e]">Products</h2>
            <p className="text-sm text-slate-500 mt-1">Manage your store&apos;s product catalogue</p>
          </section>

          {/* Store Info Card */}
          <section className="glass-card rounded-2xl p-6 shadow-sm">
            <div className="flex items-start justify-between gap-6">
              <div className="flex items-center gap-5">
                {business?.logo ? (
                  <img src={business.logo} alt={business.storeName} className="w-16 h-16 rounded-2xl object-cover shadow-md" />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4648d4] to-[#6b38d4] flex items-center justify-center text-white shadow-md">
                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>store</span>
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-[#191c1e]">{business?.storeName}</h3>
                  {business?.description && <p className="text-sm text-slate-500 mt-0.5 max-w-md">{business.description}</p>}
                  <div className="flex flex-wrap gap-4 mt-2">
                    {business?.city && (
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <span className="material-symbols-outlined text-base">location_on</span>
                        {business.city}{business.address ? `, ${business.address}` : ''}
                      </span>
                    )}
                    {business?.phone && (
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <span className="material-symbols-outlined text-base">call</span>
                        {business.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-[#4648d4]/10 px-3 py-1.5 rounded-full">
                <span className="material-symbols-outlined text-sm text-[#4648d4]" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
                <span className="text-xs font-bold text-[#4648d4]">{products.length} Products</span>
              </div>
            </div>
          </section>

          {/* Products Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#191c1e]">All Products</h3>
              <button
                onClick={() => setShowAddProduct(!showAddProduct)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#4648d4] to-[#6b38d4] text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
              >
                <span className="material-symbols-outlined text-base">{showAddProduct ? 'close' : 'add'}</span>
                {showAddProduct ? 'Cancel' : 'Add Product'}
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
              <div className="glass-card rounded-2xl p-16 text-center shadow-sm">
                <div className="w-16 h-16 bg-[#4648d4]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-3xl text-[#4648d4]">inventory_2</span>
                </div>
                <p className="text-[#191c1e] font-bold text-lg mb-1">No products yet</p>
                <p className="text-sm text-slate-500 mb-6">Start building your catalogue by adding your first product.</p>
                <button
                  onClick={() => setShowAddProduct(true)}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#4648d4] to-[#6b38d4] text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
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
          </section>
        </main>
      </div>
    </>
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
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageInput = async (e) => {
    const files = Array.from(e.target.files || []);
    const newImages = [];
    const newPreviews = [];

    for (const file of files) {
      try {
        const reader = new FileReader();
        reader.onload = (event) => {
          newImages.push(event.target.result);
          newPreviews.push({
            id: Date.now() + Math.random(),
            url: event.target.result,
            name: file.name,
          });

          if (newImages.length === files.length) {
            setFormData(prev => ({
              ...prev,
              images: [...prev.images, ...newImages],
            }));
            setImagePreviews(prev => [...prev, ...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      } catch (err) {
        console.error('Error reading file:', err);
      }
    }
  };

  const removeImage = (id) => {
    const index = imagePreviews.findIndex(img => img.id === id);
    if (index > -1) {
      setImagePreviews(prev => prev.filter((_, i) => i !== index));
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));
    }
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
    <div className="glass-card rounded-2xl p-8 shadow-sm border border-[#4648d4]/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4648d4] to-[#6b38d4] flex items-center justify-center text-white">
          <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>add_box</span>
        </div>
        <h4 className="text-lg font-bold text-[#191c1e]">Add New Product</h4>
      </div>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="dash-label">Product Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="dash-input"
            placeholder="e.g. Organic Cotton Shirt"
          />
        </div>

        <div>
          <label className="dash-label">Price (PKR) *</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            step="0.01"
            className="dash-input"
            placeholder="0.00"
          />
        </div>

        <div className="md:col-span-2">
          <label className="dash-label">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="dash-input resize-none"
            placeholder="Describe your product..."
          />
        </div>

        <div>
          <label className="dash-label">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="dash-input"
            placeholder="e.g. Clothing"
          />
        </div>

        <div>
          <label className="dash-label">Stock Quantity</label>
          <input
            type="number"
            name="stockQty"
            value={formData.stockQty}
            onChange={handleChange}
            className="dash-input"
            placeholder="0"
          />
        </div>

        <div>
          <label className="dash-label">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="dash-input"
          >
            <option value="active">Active</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {/* Images Upload Section */}
        <div className="md:col-span-2">
          <label className="dash-label">Product Images</label>
          <div className="flex flex-col gap-4">
            <label className="cursor-pointer">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageInput}
                className="hidden"
              />
              <div className="flex items-center justify-center gap-3 p-6 border-2 border-dashed border-slate-300 rounded-xl hover:border-[#4648d4] hover:bg-[#4648d4]/5 transition-colors">
                <span className="material-symbols-outlined text-2xl text-slate-400">image</span>
                <div className="text-left">
                  <p className="text-sm font-semibold text-[#191c1e]">Click to upload images</p>
                  <p className="text-xs text-slate-500">PNG, JPG, GIF up to 5MB each</p>
                </div>
              </div>
            </label>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {imagePreviews.map((preview) => (
                  <div key={preview.id} className="relative group">
                    <div className="w-full h-24 bg-slate-100 rounded-lg overflow-hidden">
                      <img
                        src={preview.url}
                        alt={preview.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(preview.id)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                    <p className="text-xs text-slate-600 mt-1 truncate">{preview.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-2 flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-8 py-2.5 bg-gradient-to-r from-[#4648d4] to-[#6b38d4] text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all disabled:opacity-50"
          >
            {loading ? <Spinner /> : (
              <>
                <span className="material-symbols-outlined text-base">add</span>
                Add Product
              </>
            )}
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
    <div className="glass-card rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-indigo-500/10 transition-all group">
      {/* Product Image */}
      <div className="h-44 w-full bg-slate-100 relative overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <span className="material-symbols-outlined text-5xl">inventory_2</span>
          </div>
        )}
        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] font-bold text-[#191c1e]">
          {product.category || 'Product'}
        </div>
        {/* Status Badge */}
        <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-bold backdrop-blur-sm ${
          product.status === 'active'
            ? 'bg-emerald-100/90 text-emerald-700'
            : 'bg-amber-100/90 text-amber-700'
        }`}>
          {product.status === 'active' ? 'Active' : 'Draft'}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5">
        <h4 className="font-bold text-[#191c1e] truncate mb-1">{product.name}</h4>
        {product.description && (
          <p className="text-xs text-slate-500 line-clamp-2 mb-3">{product.description}</p>
        )}

        <div className="flex items-center justify-between mb-4">
          <span className="text-[#4648d4] font-bold text-lg">PKR {product.price?.toLocaleString()}</span>
          <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
            product.stockQty > 0
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-red-100 text-red-600'
          }`}>
            <span className="material-symbols-outlined text-xs">{product.stockQty > 0 ? 'check_circle' : 'cancel'}</span>
            {product.stockQty > 0 ? `${product.stockQty} in stock` : 'Out of stock'}
          </span>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/dashboard/products/${product._id}/edit`}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#4648d4] text-white text-xs font-bold rounded-xl hover:bg-[#3a3bb8] transition-colors"
          >
            <span className="material-symbols-outlined text-sm">edit</span>
            Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-red-50 text-red-500 text-xs font-bold rounded-xl hover:bg-red-100 transition-colors border border-red-100 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-sm">delete</span>
            {isDeleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
