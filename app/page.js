'use client';

import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-surface font-body text-on-surface antialiased">
      {/* TopAppBar */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm shadow-indigo-500/5 h-16 flex justify-between items-center px-6 w-full sticky top-0 z-40">
        <div className="flex items-center gap-8">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 font-headline tracking-tight">LocalBiz</span>
          <div className="hidden md:flex items-center bg-surface-container-low px-4 py-2 rounded-full w-64">
            <span className="material-symbols-outlined text-outline text-sm mr-2">search</span>
            <input className="bg-transparent border-none text-sm focus:ring-0 p-0 w-full placeholder:text-outline" placeholder="Search businesses..." type="text"/>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link className="text-indigo-600 font-semibold text-sm font-headline" href="/login">Login</Link>
          <Link className="text-slate-500 dark:text-slate-400 hover:text-indigo-500 text-sm font-headline transition-colors" href="/register">Register</Link>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="hero-gradient relative overflow-hidden py-24 md:py-32">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
          </div>
          <div className="max-w-7xl mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl md:text-7xl font-headline font-extrabold text-white leading-tight tracking-[-0.02em]">
                Shop Local, <br/><span className="opacity-80">Smarter</span>.
              </h1>
              <p className="text-lg md:text-xl text-white/80 max-w-lg leading-relaxed">
                Discover the finest local craftsmanship across Pakistan. Empowering community commerce with AI-driven curation and effortless digital payments.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="px-8 py-4 bg-white text-primary font-bold rounded-lg shadow-xl shadow-indigo-900/20 hover:scale-105 transition-transform active:scale-95">
                  Shop Now
                </button>
                <Link href="/business-register">
                  <button className="px-8 py-4 bg-transparent border-2 border-white/30 text-white font-bold rounded-lg hover:bg-white/10 transition-colors active:scale-95">
                    Register Your Store
                  </button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block relative">
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl shadow-black/20 transform rotate-3">
                <img alt="Premium shopping experience" className="w-full aspect-[4/5] object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdh9RqFfuuRbYkgMMN8nzVXY34ByO0O4QsYDpP7A3fN_C_ValRwRbwzX-OX5zeS4cVq1_kD-4M7B43F1asHqfZepgiWbJ4gx-YYTjM1y0rzvDG_xtD1k-DRPp-reZ6ahnmpWlXKjE69pf9-AFECDIiHWaEgj3zvmXoWPyc3s2IiSmasY2ELHagmq-xM-7P7Xlc5pyMmVAMSqnZkESNJ-YvlteQhuQwQSK1A-glvzWFZ_tGBJ0XwrvfDcnKQ05ymiviiW1oiX6l-Ag"/>
              </div>
              <div className="absolute -top-6 -right-6 w-full h-full border-2 border-white/20 rounded-3xl -z-10 transform -rotate-3"></div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="mb-16">
            <span className="text-primary font-bold tracking-widest text-sm uppercase">The Digital Atelier</span>
            <h2 className="text-4xl font-headline font-bold text-on-surface mt-4">Elevating Local Commerce</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Feature 1 */}
            <div className="md:col-span-7 bg-surface-container-lowest p-8 rounded-xl flex flex-col justify-between min-h-[320px] shadow-sm shadow-indigo-500/5 border border-outline-variant/10">
              <div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-primary">location_on</span>
                </div>
                <h3 className="text-2xl font-headline font-bold mb-4">Discover Nearby</h3>
                <p className="text-on-surface-variant max-w-md leading-relaxed">
                  Connect with artisans and businesses in your immediate vicinity. Our geolocation mapping brings the bazaar to your screen.
                </p>
              </div>
              <div className="mt-8 overflow-hidden rounded-xl h-32 w-full">
                <img alt="Local discovery" className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmrboaJuNPuoyBRZ45iZKlcW6wE6zK-x1MZmjcmh0alvv0uHGWFMsodYfL1pZv1FT9nWiCd1TlfRPgX1lUZRMh1HoVr9W5RE9pGyUUcY5jUlLIk9AbrGm4qyMmbBbj53qaka3lhnkIyf8-GHLJB_5KllD0IQGvXyMoftHHAhGKQScYqUlCkeaF75R566ilQPAv95K0lWRNZKDcfvIhuhzlAXBCi9mzGlVsFtI6pDMd9x-9Bl3ezfsMFSNYOyVwtwCKdJ67llA1St4"/>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="md:col-span-5 bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/10 shadow-sm shadow-indigo-500/5 relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-secondary">auto_awesome</span>
                </div>
                <h3 className="text-2xl font-headline font-bold mb-4">AI Recommendations</h3>
                <p className="text-on-surface-variant leading-relaxed">
                  Personalized curation that learns your style. From handmade leather to organic spices, we find exactly what you love.
                </p>
              </div>
              <div className="absolute -right-16 -bottom-16 w-48 h-48 bg-secondary/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
            </div>

            {/* Feature 3 */}
            <div className="md:col-span-4 bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/10 shadow-sm shadow-indigo-500/5">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-green-600">payments</span>
              </div>
              <h3 className="text-2xl font-headline font-bold mb-4">Seamless Payments</h3>
              <p className="text-on-surface-variant leading-relaxed">
                Secure, integrated checkouts supporting local banking and mobile wallets.
              </p>
            </div>

            {/* Decorative Card */}
            <div className="md:col-span-8 bg-surface-container-low rounded-xl overflow-hidden relative min-h-[280px]">
              <div className="absolute inset-0 bg-gradient-to-r from-surface-container-low via-surface-container-low/40 to-transparent z-10 p-12 flex flex-col justify-center">
                <h4 className="text-3xl font-headline font-bold text-on-surface mb-2">Join the Movement</h4>
                <p className="text-on-surface-variant max-w-sm">Support over 10,000 verified local artisans across Pakistan.</p>
                <a className="mt-6 flex items-center gap-2 text-primary font-bold" href="#">Explore the directory <span className="material-symbols-outlined">arrow_forward</span></a>
              </div>
              <img alt="Community" className="absolute inset-0 w-full h-full object-cover opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjSbWhBrvegSZgDZtrd0ktHKKNhDtklViv6RQ3J6bxeXjd-IdU3V_HMgzRmwh-wKOLaofOMJ0TX65NDSn-A3upHA2eXNjcAcN83x2BchKsgJMshXuI7-XH7PG74GoJDdKwcZIjGffrjDHHftocj5WWUXDxUaOeXvvasSPOKenTfqdpES_9jHagStTiJXhVHDO7Cyrd9d3FBFcHlnerr2oReXjrNPrjn2LwTuAEM4HJzrZYJupMtwE2jJFKkMAxhTsYtVxJ46V1tmg"/>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-t border-outline-variant/20 py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 font-headline tracking-tight mb-6 block">LocalBiz</span>
            <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
              Redefining local commerce through technology and design. Pakistan's first digital atelier for the community.
            </p>
            <div className="flex gap-4">
              <a className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-primary/10 transition-colors" href="#">
                <span className="material-symbols-outlined text-on-surface-variant text-lg">public</span>
              </a>
              <a className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-primary/10 transition-colors" href="#">
                <span className="material-symbols-outlined text-on-surface-variant text-lg">share</span>
              </a>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-headline font-bold text-on-surface">Marketplace</h4>
            <nav className="flex flex-col gap-3">
              <a className="text-on-surface-variant hover:text-primary text-sm transition-colors" href="#">Find Stores</a>
              <a className="text-on-surface-variant hover:text-primary text-sm transition-colors" href="#">Handcrafted Goods</a>
              <a className="text-on-surface-variant hover:text-primary text-sm transition-colors" href="#">Digital Vouchers</a>
              <a className="text-on-surface-variant hover:text-primary text-sm transition-colors" href="#">Bulk Orders</a>
            </nav>
          </div>
          <div className="space-y-4">
            <h4 className="font-headline font-bold text-on-surface">Company</h4>
            <nav className="flex flex-col gap-3">
              <a className="text-on-surface-variant hover:text-primary text-sm transition-colors" href="#">Our Story</a>
              <a className="text-on-surface-variant hover:text-primary text-sm transition-colors" href="#">Impact Report</a>
              <a className="text-on-surface-variant hover:text-primary text-sm transition-colors" href="#">Careers</a>
              <a className="text-on-surface-variant hover:text-primary text-sm transition-colors" href="#">Legal</a>
            </nav>
          </div>
          <div className="space-y-6">
            <h4 className="font-headline font-bold text-on-surface">Stay Updated</h4>
            <p className="text-sm text-on-surface-variant">Join our newsletter for weekly artisan spotlights.</p>
            <div className="flex gap-2">
              <input className="bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 w-full" placeholder="email@example.com" type="email"/>
              <button className="bg-primary text-white p-3 rounded-lg hover:bg-secondary transition-colors">
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-outline text-xs">© 2024 LocalBiz. Digital Atelier Pakistan.</p>
          <div className="flex gap-6">
            <a className="text-outline text-xs hover:text-primary" href="#">Privacy Policy</a>
            <a className="text-outline text-xs hover:text-primary" href="#">Terms of Service</a>
            <a className="text-outline text-xs hover:text-primary" href="#">Cookie Settings</a>
          </div>
        </div>
      </footer>

      {/* Mobile Nav */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 md:hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-[0_-4px_20px_rgba(99,102,241,0.08)] rounded-t-2xl border-t border-slate-100">
        <div className="flex flex-col items-center justify-center text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl px-3 py-1.5 active:scale-95 transition-transform">
          <span className="material-symbols-outlined">home</span>
          <span className="text-[10px] font-bold font-headline">Home</span>
        </div>
        <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 active:scale-95 transition-transform">
          <span className="material-symbols-outlined">search</span>
          <span className="text-[10px] font-bold font-headline">Search</span>
        </div>
        <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 active:scale-95 transition-transform">
          <span className="material-symbols-outlined">leaderboard</span>
          <span className="text-[10px] font-bold font-headline">Stats</span>
        </div>
        <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 active:scale-95 transition-transform">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-bold font-headline">Profile</span>
        </div>
      </nav>
    </div>
  );
}
