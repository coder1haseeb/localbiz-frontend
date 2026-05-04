'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CustomerDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [userName, setUserName] = useState('there');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) { router.push('/login'); return; }

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user?.fullName) setUserName(user.fullName.split(' ')[0]);

    const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products/public?limit=100`;
    console.log('Fetching all products from:', apiUrl);
    
    fetch(apiUrl)
      .then(r => {
        console.log('Response status:', r.status);
        return r.json();
      })
      .then(data => {
        console.log('Products response:', data);
        if (data.success && data.data && data.data.products) {
          setProducts(data.data.products);
        } else {
          console.log('No products in response or error');
          setProducts([]);
        }
      })
      .catch(err => console.error('Failed to fetch products:', err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <>
      <style>{`
        .glass-card {
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>
      <div className="flex">
          {/* SideNavBar - Shared Layout */}
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
              <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-800 text-[#4648d4] shadow-sm rounded-lg font-semibold hover:translate-x-1 transition-all duration-300 cursor-pointer">
                <span className="material-symbols-outlined">dashboard</span>
                <span>Dashboard</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-[#eceef0] dark:hover:bg-slate-800/50 hover:translate-x-1 transition-all duration-300 rounded-lg cursor-pointer">
                <span className="material-symbols-outlined">storefront</span>
                <span>Marketplace</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-[#eceef0] dark:hover:bg-slate-800/50 hover:translate-x-1 transition-all duration-300 rounded-lg cursor-pointer">
                <span className="material-symbols-outlined">insights</span>
                <span>Analytics</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-[#eceef0] dark:hover:bg-slate-800/50 hover:translate-x-1 transition-all duration-300 rounded-lg cursor-pointer">
                <span className="material-symbols-outlined">shopping_cart</span>
                <span>My Cart</span>
              </div>
            </nav>
            <div className="mt-auto p-4 bg-primary/5 rounded-2xl">
              <p className="text-primary font-semibold mb-2">Support Center</p>
              <p className="text-[11px] text-slate-500 mb-4">Need help with your purchase?</p>
              <button className="w-full py-2 bg-white text-primary text-[12px] font-bold rounded-lg shadow-sm border border-primary/10">Contact Support</button>
            </div>
            <button onClick={handleLogout} className="w-full py-3 px-4 text-red-600 font-bold text-sm hover:bg-red-50 rounded-lg transition-all">
              <span className="material-symbols-outlined mr-2">logout</span>
              Logout
            </button>
          </aside>

          {/* Main Content Area */}
          <main className="ml-72 min-h-screen relative flex flex-col w-full bg-[#f7f9fb] p-8">
            <div className="space-y-10">
              {/* Hero Greeting */}
              <section className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-headline font-bold tracking-tight text-on-surface">Welcome back, {userName}</h2>
                <p className="text-on-surface-variant font-body">Here is what's happening with your local shopping today.</p>
              </section>

              {/* KPI Cards */}
              <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Orders Card */}
                <div className="glass-card p-6 rounded-2xl shadow-sm hover:shadow-indigo-500/10 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary transition-transform group-hover:scale-110">
                      <span className="material-symbols-outlined">shopping_bag</span>
                    </div>
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">+12%</span>
                  </div>
                  <p className="text-sm font-semibold text-on-surface-variant font-label uppercase tracking-wider mb-1">Total Orders</p>
                  <h3 className="text-3xl font-headline font-bold text-on-surface">24</h3>
                  <p className="text-xs text-slate-400 mt-2">Active orders this week</p>
                </div>

                {/* Spent Month */}
                <div className="glass-card p-6 rounded-2xl shadow-sm hover:shadow-indigo-500/10 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary transition-transform group-hover:scale-110">
                      <span className="material-symbols-outlined">calendar_month</span>
                    </div>
                    <span className="text-xs font-bold text-secondary bg-secondary/10 px-2 py-1 rounded-full">PKR</span>
                  </div>
                  <p className="text-sm font-semibold text-on-surface-variant font-label uppercase tracking-wider mb-1">Spent This Month</p>
                  <h3 className="text-3xl font-headline font-bold text-on-surface">12,450</h3>
                  <p className="text-xs text-slate-400 mt-2">Saved 1,200 via LocalBiz Rewards</p>
                </div>

                {/* Spent Year */}
                <div className="glass-card p-6 rounded-2xl shadow-sm hover:shadow-indigo-500/10 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-full bg-tertiary-container/10 flex items-center justify-center text-tertiary-container transition-transform group-hover:scale-110">
                      <span className="material-symbols-outlined">payments</span>
                    </div>
                    <span className="text-xs font-bold text-tertiary-container bg-tertiary-container/10 px-2 py-1 rounded-full">Annual</span>
                  </div>
                  <p className="text-sm font-semibold text-on-surface-variant font-label uppercase tracking-wider mb-1">Total Annual Spent</p>
                  <h3 className="text-3xl font-headline font-bold text-on-surface">158,200</h3>
                  <p className="text-xs text-slate-400 mt-2">Top 5% shopper in Islamabad</p>
                </div>
              </section>

              {/* AI Recommended Horizontal Scroll Row */}
              <section className="space-y-6">
                <div className="flex justify-between items-end">
                  <div>
                    <h4 className="text-lg font-headline font-bold text-on-surface flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                      Atelier Insights
                    </h4>
                    <p className="text-sm text-on-surface-variant">AI-curated recommendations based on your habits</p>
                  </div>
                  <button className="text-primary text-sm font-bold hover:underline">Refine AI</button>
                </div>
                <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4 -mx-2 px-2">
                  {/* AI Card 1 */}
                  <div className="min-w-[320px] bg-indigo-600 rounded-2xl p-6 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/20 transition-all"></div>
                    <span className="bg-white/20 backdrop-blur-sm text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-widest mb-4 inline-block">Smart Match</span>
                    <h5 className="text-xl font-headline font-bold mb-2">Restock Alert: Organic Flour</h5>
                    <p className="text-indigo-100 text-sm mb-6">Based on your baking frequency, you might need a refill. "Grain & Co" has it in stock today.</p>
                    <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-black/10">Order Now</button>
                  </div>

                  {/* AI Card 2 */}
                  <div className="min-w-[320px] bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden group">
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-violet-600/30 rounded-full -mb-16 -mr-16 blur-3xl"></div>
                    <span className="bg-violet-600/40 backdrop-blur-sm text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-widest mb-4 inline-block">Flash Deal</span>
                    <h5 className="text-xl font-headline font-bold mb-2">20% Off at Artisan Teas</h5>
                    <p className="text-slate-400 text-sm mb-6">Your favorite Jasmine blend is on sale for the next 4 hours. Exclusive to LocalBiz members.</p>
                    <button className="bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-violet-600/20">Claim Discount</button>
                  </div>

                  {/* AI Card 3 */}
                  <div className="min-w-[320px] glass-card border-indigo-100 rounded-2xl p-6 relative overflow-hidden">
                    <span className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-widest mb-4 inline-block">New Entry</span>
                    <h5 className="text-xl font-headline font-bold text-on-surface mb-2">Copper Craft Atelier</h5>
                    <p className="text-on-surface-variant text-sm mb-6">A new artisanal shop opened 0.4km from you. Their aesthetics match your saved pins.</p>
                    <button className="bg-surface-container-highest text-on-surface px-4 py-2 rounded-lg text-sm font-bold">Explore Store</button>
                  </div>
                </div>
              </section>

              {/* Products Section */}
              <section className="space-y-6">
                <div className="flex justify-between items-end">
                  <h4 className="text-lg font-headline font-bold text-on-surface">All Products</h4>
                  <Link href="/cart" className="text-primary text-sm font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">shopping_cart</span> My Cart
                  </Link>
                </div>
                {products.length === 0 ? (
                  <p className="text-on-surface-variant text-sm">No products available yet.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map(product => (
                      <Link key={product._id} href={`/product/${product._id}`} className="glass-card rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-indigo-500/5 transition-all block">
                        <div className="h-40 w-full bg-surface-container relative">
                          {product.images && product.images.length > 0 ? (
                            <img alt={product.name} className="w-full h-full object-cover" src={product.images[0]} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <span className="material-symbols-outlined text-4xl">inventory_2</span>
                            </div>
                          )}
                          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold">
                            {product.category || 'Product'}
                          </div>
                        </div>
                        <div className="p-4 space-y-2">
                          <h6 className="font-headline font-bold text-on-surface truncate">{product.name}</h6>
                          <p className="text-xs text-on-surface-variant truncate">{product.business?.storeName || 'Local Store'}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-primary font-bold text-sm">PKR {product.price?.toLocaleString()}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${product.stockQty > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                              {product.stockQty > 0 ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </main>
        </div>
      </>
    );
  }
