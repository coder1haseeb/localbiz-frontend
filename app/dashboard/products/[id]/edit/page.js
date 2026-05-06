'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Spinner from '@/components/Spinner';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [token, setToken] = useState(null);
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

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (!storedToken) {
      router.push('/login');
      return;
    }

    setToken(storedToken);
    fetchProduct(storedToken);
  }, []);

  const fetchProduct = async (authToken) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products/${productId}/edit`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const data = await res.json();
      if (data.success) {
        setProduct(data.data);
        setFormData({
          name: data.data.name,
          description: data.data.description,
          price: data.data.price,
          category: data.data.category,
          stockQty: data.data.stockQty,
          status: data.data.status,
          images: data.data.images || [],
        });
        if (data.data.images && data.data.images.length > 0) {
          setImagePreviews(
            data.data.images.map((img, idx) => ({
              id: `existing-${idx}`,
              url: img,
              name: `Image ${idx + 1}`,
              existing: true,
            }))
          );
        }
      } else {
        alert(data.message || 'Failed to load product');
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      alert('An error occurred');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

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
            existing: false,
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
    setUpdating(true);

    try {
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        stockQty: parseInt(formData.stockQty) || 0,
        images: formData.images,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products/${productId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(submitData),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert('Product updated successfully!');
        router.push('/dashboard');
      } else if (data.errors) {
        alert(`Error: ${data.errors.map(e => e.message).join(', ')}`);
      } else {
        alert(data.message || 'Failed to update product');
      }
    } catch (err) {
      console.error('Error updating product:', err);
      alert('An error occurred. Please try again.');
    } finally {
      setUpdating(false);
    }
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
        .edit-input {
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
        .edit-input:focus {
          border-color: #4648d4;
          box-shadow: 0 0 0 3px rgba(70, 72, 212, 0.1);
          background: #fff;
        }
        .edit-label {
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
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-white text-[#4648d4] shadow-sm rounded-lg font-semibold">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
              <span>Products</span>
            </Link>
            <Link href="/home" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] hover:translate-x-1 transition-all duration-300 rounded-lg cursor-pointer">
              <span className="material-symbols-outlined">storefront</span>
              <span>Marketplace</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="ml-72 flex-1 p-8">
          {/* Back link */}
          <div className="mb-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#4648d4] font-semibold transition-colors"
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              Back to Products
            </Link>
          </div>

          {/* Product preview strip */}
          {product && (
            <div className="glass-card rounded-2xl p-5 mb-6 shadow-sm flex items-center gap-5">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                {product.images && product.images.length > 0 ? (
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <span className="material-symbols-outlined text-2xl">inventory_2</span>
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-0.5">Editing</p>
                <h2 className="text-xl font-bold text-[#191c1e]">{product.name}</h2>
                <p className="text-sm text-slate-500">PKR {product.price?.toLocaleString()}</p>
              </div>
            </div>
          )}

          {/* Form Card */}
          <div className="glass-card rounded-2xl p-8 shadow-sm max-w-2xl">
            <div className="flex items-center gap-3 mb-7">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4648d4] to-[#6b38d4] flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>edit</span>
              </div>
              <h3 className="text-lg font-bold text-[#191c1e]">Edit Product Details</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="edit-label">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="edit-input"
                  placeholder="e.g. Organic Cotton Shirt"
                />
              </div>

              <div>
                <label className="edit-label">Price (PKR) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  step="0.01"
                  className="edit-input"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="edit-label">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="edit-input resize-none"
                  placeholder="Describe your product..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="edit-label">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="edit-input"
                    placeholder="e.g. Clothing"
                  />
                </div>

                <div>
                  <label className="edit-label">Stock Quantity</label>
                  <input
                    type="number"
                    name="stockQty"
                    value={formData.stockQty}
                    onChange={handleChange}
                    className="edit-input"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="edit-label">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="edit-input"
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              {/* Images Upload Section */}
              <div className="md:col-span-2">
                <label className="edit-label">Product Images</label>
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
                        <p className="text-sm font-semibold text-[#191c1e]">Click to add more images</p>
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
                          {preview.existing && (
                            <div className="absolute bottom-1 right-1 bg-emerald-500 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">
                              Current
                            </div>
                          )}
                          <p className="text-xs text-slate-600 mt-1 truncate">{preview.name}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-6 py-2.5 bg-slate-100 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={updating}
                  className="flex items-center gap-2 px-8 py-2.5 bg-gradient-to-r from-[#4648d4] to-[#6b38d4] text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all disabled:opacity-50"
                >
                  {updating ? <Spinner /> : (
                    <>
                      <span className="material-symbols-outlined text-sm">save</span>
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </>
  );
}
