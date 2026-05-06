'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [cartMsg, setCartMsg] = useState('');
  const [cartLoading, setCartLoading] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (!id) return;
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) setProduct(data.data);
        else router.push('/home');
      })
      .catch(() => router.push('/home'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) { 
      console.log('No auth token, redirecting to login');
      router.push('/login'); 
      return; 
    }

    setCartLoading(true);
    setCartMsg('');
    console.log('Adding to cart:', { productId: id, quantity });
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ productId: id, quantity }),
      });
      const data = await res.json();
      console.log('Cart response:', res.status, data);
      
      if (res.ok) {
        setCartMsg('✅ Added to cart!');
        setTimeout(() => setCartMsg(''), 3000);
      } else {
        setCartMsg(data.message || 'Failed to add to cart');
      }
    } catch (err) {
      console.error('Cart error:', err);
      setCartMsg('Error adding to cart');
    } finally {
      setCartLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f7f9fb]">
        <div className="w-8 h-8 border-4 border-[#4648d4] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) return null;

  const hasMultipleImages = product.images && product.images.length > 1;
  const currentImage = product.images?.[activeImageIndex] || null;

  const goToPreviousImage = () => {
    setActiveImageIndex(prev => (prev === 0 ? (product.images?.length || 1) - 1 : prev - 1));
  };

  const goToNextImage = () => {
    setActiveImageIndex(prev => (prev === (product.images?.length || 1) - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <style>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
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
              <p className="text-[11px] text-slate-500 font-normal">Marketplace</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            <Link href="/home" className="flex items-center gap-3 px-4 py-3 bg-white text-[#4648d4] shadow-sm rounded-lg font-semibold">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>storefront</span>
              <span>Browse</span>
            </Link>
            <Link href="/cart" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] hover:translate-x-1 transition-all rounded-lg relative">
              <span className="material-symbols-outlined">shopping_cart</span>
              <span>My Cart</span>
            </Link>
          </nav>

          <div className="p-4 bg-white/60 rounded-2xl border border-white/40">
            <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-1">Viewing</p>
            <p className="text-sm font-bold text-[#191c1e] truncate">{product.name}</p>
            <p className="text-xs text-slate-500 mt-2">From {product.business?.storeName}</p>
          </div>

          <Link href="/home" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] rounded-lg text-sm font-semibold">
            <span className="material-symbols-outlined">arrow_back</span>
            <span>Back to Browse</span>
          </Link>
        </aside>

        {/* Main Content */}
        <main className="ml-72 flex-1 p-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8 text-sm text-slate-500">
            <Link href="/home" className="hover:text-[#4648d4] font-semibold">Browse</Link>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <span className="text-[#4648d4] font-semibold">{product.category || 'Product'}</span>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <span className="text-[#191c1e] font-semibold truncate">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Image Section */}
            <div className="lg:col-span-1 space-y-4">
              {/* Main Image */}
              <div className="glass-card rounded-2xl overflow-hidden aspect-square flex items-center justify-center bg-slate-100 relative group">
                {currentImage ? (
                  <img
                    src={currentImage}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <span className="material-symbols-outlined text-6xl">inventory_2</span>
                    <p className="text-sm mt-2">No image</p>
                  </div>
                )}

                {/* Image Navigation Buttons */}
                {hasMultipleImages && (
                  <>
                    <button
                      onClick={goToPreviousImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center hover:bg-white shadow-lg transition-all"
                    >
                      <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <button
                      onClick={goToNextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center hover:bg-white shadow-lg transition-all"
                    >
                      <span className="material-symbols-outlined">chevron_right</span>
                    </button>

                    {/* Image Counter */}
                    <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full font-semibold">
                      {activeImageIndex + 1} / {product.images?.length || 1}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {hasMultipleImages && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`glass-card rounded-lg overflow-hidden aspect-square flex items-center justify-center border-2 transition-all ${
                        idx === activeImageIndex
                          ? 'border-[#4648d4] shadow-lg'
                          : 'border-slate-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
                    product.stockQty > 0
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {product.stockQty > 0 ? `${product.stockQty} In Stock` : 'Out of Stock'}
                  </span>
                  {product.category && (
                    <span className="px-3 py-1 text-xs font-bold bg-[#4648d4]/10 text-[#4648d4] rounded-full">
                      {product.category}
                    </span>
                  )}
                </div>
                <h1 className="text-4xl font-bold text-[#191c1e] mb-2">{product.name}</h1>
                {product.business && (
                  <p className="text-slate-600">
                    Sold by <span className="font-semibold text-[#191c1e]">{product.business.storeName}</span>
                    {product.business.city && ` · ${product.business.city}`}
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="glass-card rounded-2xl p-6">
                <p className="text-slate-500 text-sm uppercase tracking-wider font-semibold mb-2">Price</p>
                <p className="text-4xl font-bold text-[#4648d4]">PKR {product.price?.toLocaleString()}</p>
              </div>

              {/* Description */}
              {product.description && (
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="text-sm font-bold text-[#191c1e] uppercase tracking-wider mb-3">About This Product</h3>
                  <p className="text-slate-600 leading-relaxed">{product.description}</p>
                </div>
              )}

              {/* Purchase Section */}
              <div className="glass-card rounded-2xl p-6 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-[#191c1e] uppercase tracking-wider mb-3">Quantity</h3>
                  <div className="inline-flex items-center bg-slate-100 rounded-xl p-1 gap-2">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="w-10 h-10 flex items-center justify-center rounded-lg bg-white text-[#191c1e] hover:bg-slate-50 transition-colors"
                    >
                      <span className="material-symbols-outlined">remove</span>
                    </button>
                    <span className="px-6 font-bold text-[#191c1e] text-lg">{String(quantity).padStart(2, '0')}</span>
                    <button
                      onClick={() => setQuantity(q => Math.min(product.stockQty || 99, q + 1))}
                      disabled={product.stockQty === 0}
                      className="w-10 h-10 flex items-center justify-center rounded-lg bg-white text-[#191c1e] hover:bg-slate-50 transition-colors disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined">add</span>
                    </button>
                  </div>
                </div>

                {cartMsg && (
                  <div className={`p-3 rounded-lg text-sm font-semibold text-center ${
                    cartMsg.includes('✅')
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {cartMsg}
                  </div>
                )}

                <button
                  onClick={handleAddToCart}
                  disabled={cartLoading || !product || product.stockQty === 0}
                  className="w-full py-3 px-4 bg-gradient-to-r from-[#4648d4] to-[#6b38d4] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">shopping_cart</span>
                  {cartLoading ? 'Adding to Cart...' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
