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

  return (
    <>
      <style>{`
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        body {
            background-color: #f7f9fb;
        }
      `}</style>
      <div className="flex">
        {/* SideNavBar (Shared Component JSON Implementation) */}
        <aside className="h-screen w-72 fixed left-0 top-0 bg-[#f2f4f6] dark:bg-slate-900 flex flex-col h-full p-4 space-y-2 font-['Inter'] text-[13px] font-medium z-40">
          <div className="flex items-center gap-3 px-3 py-6 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4648d4] to-[#6b38d4] flex items-center justify-center text-white">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>diamond</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#191c1e] dark:text-white leading-none">LocalBiz</h1>
              <p className="text-[11px] text-slate-500 font-normal">Digital Atelier</p>
            </div>
          </div>
          <nav className="flex-1 space-y-1">
            <div className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-[#eceef0] dark:hover:bg-slate-800/50 hover:translate-x-1 transition-all duration-300 rounded-lg cursor-pointer">
              <span className="material-symbols-outlined">dashboard</span>
              <span>Overview</span>
            </div>
            {/* ACTIVE TAB: Marketplace (Matches Product Detail Intent) */}
            <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-800 text-[#4648d4] shadow-sm rounded-lg font-semibold hover:translate-x-1 transition-all duration-300 cursor-pointer">
              <span className="material-symbols-outlined">storefront</span>
              <span>Marketplace</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-[#eceef0] dark:hover:bg-slate-800/50 hover:translate-x-1 transition-all duration-300 rounded-lg cursor-pointer">
              <span className="material-symbols-outlined">precision_manufacturing</span>
              <span>Operations</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-[#eceef0] dark:hover:bg-slate-800/50 hover:translate-x-1 transition-all duration-300 rounded-lg cursor-pointer">
              <span className="material-symbols-outlined">insights</span>
              <span>Analytics</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-[#eceef0] dark:hover:bg-slate-800/50 hover:translate-x-1 transition-all duration-300 rounded-lg cursor-pointer">
              <span className="material-symbols-outlined">admin_panel_settings</span>
              <span>Administration</span>
            </div>
          </nav>
          <div className="mt-auto p-4 bg-primary/5 rounded-2xl">
            <p className="text-primary font-semibold mb-2">Support Center</p>
            <p className="text-[11px] text-slate-500 mb-4">Need help with your atelier setup?</p>
            <button className="w-full py-2 bg-white text-primary text-[12px] font-bold rounded-lg shadow-sm border border-primary/10">Contact Support</button>
          </div>
        </aside>

        {/* Main Content Canvas */}
        <main className="ml-72 min-h-screen p-8 pb-32">
          {/* Header / Breadcrumbs */}
          <header className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-2 text-label-sm text-on-surface-variant font-medium tracking-wide uppercase">
              <span>Marketplace</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span>Ceramics</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-primary">Artisan Vase</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-lowest shadow-[0_4px_24px_rgba(70,72,212,0.07)] text-on-surface-variant">
                <span className="material-symbols-outlined">favorite</span>
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-lowest shadow-[0_4px_24px_rgba(70,72,212,0.07)] text-on-surface-variant">
                <span className="material-symbols-outlined">share</span>
              </button>
            </div>
          </header>

          {/* Product Hero Section (Asymmetrical Layout) */}
          <div className="grid grid-cols-12 gap-12">
            {/* Left: Image Gallery (7 Columns) */}
            <div className="col-span-7 flex gap-6">
              {/* Vertical Thumbnails */}
              <div className="flex flex-col gap-4 w-24">
                {product.images && product.images.length > 0 ? (
                  product.images.slice(0, 4).map((img, i) => (
                    <div key={i} className={`aspect-square rounded-xl bg-surface-container-lowest overflow-hidden cursor-pointer ${
                      i === 0 ? 'border-2 border-primary' : 'opacity-60 hover:opacity-100 transition-opacity'
                    }`}>
                      <img alt={`Product image ${i + 1}`} className="w-full h-full object-cover" src={img} />
                    </div>
                  ))
                ) : (
                  <div className="aspect-square rounded-xl bg-surface-container-lowest border-2 border-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl text-slate-400">inventory_2</span>
                  </div>
                )}
              </div>
              {/* Large Image */}
              <div className="flex-1 rounded-[2rem] overflow-hidden bg-surface-container-lowest shadow-[0_24px_48px_rgba(70,72,212,0.05)] flex items-center justify-center">
                {product.images && product.images.length > 0 ? (
                  <img alt={product.name} className="w-full h-full object-cover" src={product.images[0]} />
                ) : (
                  <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center text-slate-400 gap-4">
                    <span className="material-symbols-outlined text-6xl">inventory_2</span>
                    <p className="text-sm font-medium">No image available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Product Information (5 Columns) */}
            <div className="col-span-5 flex flex-col pt-4">
              <div className="mb-4">
                <span className={`px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-widest ${
                  product.stockQty > 0 ? 'bg-[#4648d4]/10 text-primary' : 'bg-red-100 text-red-600'
                }`}>{product.stockQty > 0 ? 'In Stock' : 'Out of Stock'}</span>
              </div>
              <h1 className="font-headline text-4xl font-extrabold text-on-surface tracking-tight mb-2 leading-tight">{product.name}</h1>
              <div className="flex items-center gap-2 mb-6">
                <div className="flex text-[#FFB800]">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined">star_half</span>
                </div>
                <span className="text-sm text-on-surface-variant font-medium">(128 Reviews)</span>
              </div>
              <div className="mb-8">
                <span className="text-3xl font-extrabold text-primary tracking-tight">PKR {product.price?.toLocaleString()}</span>
              </div>
              <div className="mb-8">
                <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider mb-3">About this Product</h3>
                <p className="text-body-md text-on-surface-variant leading-relaxed">
                  {product.description || 'No description available.'}
                </p>
                {product.business && (
                  <p className="mt-3 text-sm text-on-surface-variant">
                    Sold by <span className="font-semibold text-on-surface">{product.business.storeName}</span>
                    {product.business.city && ` · ${product.business.city}`}
                  </p>
                )}
              </div>

              {/* Product Configurator */}
              <div className="space-y-6 mb-10">
                <div>
                  <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider mb-3">Quantity</h3>
                  <div className="inline-flex items-center p-1 bg-surface-container rounded-xl">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center rounded-lg bg-surface-container-lowest shadow-sm text-on-surface">
                      <span className="material-symbols-outlined">remove</span>
                    </button>
                    <span className="px-6 font-bold text-on-surface">{String(quantity).padStart(2, '0')}</span>
                    <button onClick={() => setQuantity(q => Math.min(product.stockQty || 99, q + 1))} className="w-10 h-10 flex items-center justify-center rounded-lg bg-surface-container-lowest shadow-sm text-on-surface">
                      <span className="material-symbols-outlined">add</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-4 mt-8 w-full">
                {cartMsg && (
                  <div className={`p-3 rounded-lg text-center font-semibold text-sm ${cartMsg.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                    {cartMsg}
                  </div>
                )}
                <button
                  onClick={handleAddToCart}
                  disabled={cartLoading || !product || product.stockQty === 0}
                  className="w-full py-3 px-4 bg-blue-600 text-white font-bold text-base rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cartLoading ? 'Adding to Cart...' : 'Add to Cart'}
                </button>
              </div>

              {/* Mini Perks */}
              <div className="mt-12 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-surface-container-low">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-on-surface uppercase">Free Delivery</p>
                    <p className="text-[10px] text-on-surface-variant">Across Pakistan</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-surface-container-low">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[20px]">verified</span>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-on-surface uppercase">Certified Art</p>
                    <p className="text-[10px] text-on-surface-variant">Authentic Build</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* "You May Also Like" Section */}
          <section className="mt-24">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="font-headline text-3xl font-extrabold text-on-surface tracking-tight mb-2">You May Also Like</h2>
                <p className="text-on-surface-variant">Curated pairings from the same atelier series.</p>
              </div>
              <button className="flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
                View Gallery <span className="material-symbols-outlined">arrow_right_alt</span>
              </button>
            </div>

            {/* Bento Grid - Like Items */}
            <div className="grid grid-cols-4 gap-6">
              {/* Item 1 */}
              <div className="group bg-surface-container-lowest p-4 rounded-[1.5rem] shadow-[0_4px_24px_rgba(70,72,212,0.03)] hover:shadow-[0_12px_48px_rgba(70,72,212,0.08)] transition-all cursor-pointer">
                <div className="aspect-[4/5] rounded-xl overflow-hidden mb-4 bg-surface-container">
                  <img alt="Related Item 1" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdky8_d0Mu1u_TshZLPyTm-MYZLUVFr3jLJnsMpz9EHZleWSWJFvHbc4nPun93UIuTdy9wbOut09PLMpVU0oQ_Qx7O9wJjvswUN8KAjGDz7EJpZ-CJGkYodjtSwqeRkaSGjN1Caytm2EtiCcQV7h1Gs-DmrueMaYc6X-Jq7nBck8sGrsjj8ZHNpddhMS5nLjCPki8jlmWcejbQfcg2Fp7jNRCV3OR3A_ZYeARz6Kdy0MZPpE6_Neqvf6jtYURrM3ABJ5OgYyQ1OKQ" />
                </div>
                <h3 className="font-bold text-on-surface mb-1">Textured Table Lamp</h3>
                <p className="text-xs text-on-surface-variant mb-3">Lighting / Atelier</p>
                <div className="flex items-center justify-between">
                  <span className="text-primary font-bold">PKR 12,900</span>
                  <button className="w-8 h-8 rounded-full bg-primary/5 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">add</span>
                  </button>
                </div>
              </div>

              {/* Item 2 */}
              <div className="group bg-surface-container-lowest p-4 rounded-[1.5rem] shadow-[0_4px_24px_rgba(70,72,212,0.03)] hover:shadow-[0_12px_48px_rgba(70,72,212,0.08)] transition-all cursor-pointer">
                <div className="aspect-[4/5] rounded-xl overflow-hidden mb-4 bg-surface-container">
                  <img alt="Related Item 2" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqM6EGdGl6RrhCQmMPy4aN23A2n2p98DK3DrhmcrI_0gv7Dm0ocdkEKgqVqRPOIf6uO7JoCsDNB40-oDB1n3Dh1_jAl4wNAXM7j6EAiLcDQd4CWvihFwbEsclvukkeTLhJMkbF2NjnSjYofVRPR03L2Djr38q3IGbpbKtg9H-E7soy3bs5dBCGRVAZBCQfN07Q-KpdpLXGF6C_EB_R6rfxjC7QfFSrrgvHpbBimwG-PE_-bpjK9Sd2ZsgU3f1KD4hU15QCRubHaMQ" />
                </div>
                <h3 className="font-bold text-on-surface mb-1">Gilded Nesting Bowls</h3>
                <p className="text-xs text-on-surface-variant mb-3">Kitchen / Luxury</p>
                <div className="flex items-center justify-between">
                  <span className="text-primary font-bold">PKR 8,500</span>
                  <button className="w-8 h-8 rounded-full bg-primary/5 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">add</span>
                  </button>
                </div>
              </div>

              {/* Item 3 */}
              <div className="group bg-surface-container-lowest p-4 rounded-[1.5rem] shadow-[0_4px_24px_rgba(70,72,212,0.03)] hover:shadow-[0_12px_48px_rgba(70,72,212,0.08)] transition-all cursor-pointer">
                <div className="aspect-[4/5] rounded-xl overflow-hidden mb-4 bg-surface-container">
                  <img alt="Related Item 3" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA42FWUOdecxyGT2_5M90ulT9HyB8VZc9rDoJh3-O99CJrc3Rnojv_c77VAzMIJh96p0toD_G7EwdG-Pe_i89SU44oqpMQjrnVkiePXNc9FddhoPK0KAEwJsOpA0An9K2Za0XiGY8lc18gI_9tOIN0YHV5C25J2X3WjcXmg-qrBPp6xo0RMQD9o3hILpwlGrj7XhhqWR6baYeZDw8BpayRJV8yBiHzCLm56imDOUmAz4cVKYHy6afm98L1SRpsabL4UvW50wbOnbEc" />
                </div>
                <h3 className="font-bold text-on-surface mb-1">Monolith Wall Piece</h3>
                <p className="text-xs text-on-surface-variant mb-3">Decor / Abstract</p>
                <div className="flex items-center justify-between">
                  <span className="text-primary font-bold">PKR 22,000</span>
                  <button className="w-8 h-8 rounded-full bg-primary/5 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">add</span>
                  </button>
                </div>
              </div>

              {/* Item 4 */}
              <div className="group bg-surface-container-lowest p-4 rounded-[1.5rem] shadow-[0_4px_24px_rgba(70,72,212,0.03)] hover:shadow-[0_12px_48px_rgba(70,72,212,0.08)] transition-all cursor-pointer">
                <div className="aspect-[4/5] rounded-xl overflow-hidden mb-4 bg-surface-container">
                  <img alt="Related Item 4" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCy4YAF2kRfm5Am5YM2Rv_ARM_6H3VV-J_jeER2N1nwuI-enREibo4Jqz7f3Wl00yGgAdD8sGq002ENzwrfhu4u0B8QKiQh0Br-oOpXxmQC5uBZnze4WEKIiYu6rOP-v4FHA9DVFhbWMI3JAqVtS836nDD7ZdOkUA2azo8Snp13zUQDgwqVE-6aMBLYLbQv6i5N5y7bC5SajqSjHPzt8UJUqbZ8a-1L8zO-04wjXYjoEH6gN-4XpqukyC4FakiSCwfpz_VTD7JOcSs" />
                </div>
                <h3 className="font-bold text-on-surface mb-1">Signature Spice Jars</h3>
                <p className="text-xs text-on-surface-variant mb-3">Kitchen / Organization</p>
                <div className="flex items-center justify-between">
                  <span className="text-primary font-bold">PKR 5,400</span>
                  <button className="w-8 h-8 rounded-full bg-primary/5 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">add</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* BottomNavBar for Mobile (Shared Component JSON Implementation) */}
        <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-white/95 backdrop-blur-lg dark:bg-slate-950/95 shadow-[0_-8px_30px_rgba(70,72,212,0.1)] rounded-t-3xl border-t-0 font-['Inter'] text-[10px] font-semibold uppercase tracking-wider">
          <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 px-5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined">home</span>
            <span className="mt-1">Home</span>
          </div>
          <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 px-5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined">search_insights</span>
            <span className="mt-1">Explore</span>
          </div>
          <div className="flex flex-col items-center justify-center bg-[#4648d4]/10 text-[#4648d4] rounded-2xl px-5 py-2">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>task_alt</span>
            <span className="mt-1">Tasks</span>
          </div>
          <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 px-5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined">account_circle</span>
            <span className="mt-1">Profile</span>
          </div>
        </nav>
      </div>
    </>
  );
}
