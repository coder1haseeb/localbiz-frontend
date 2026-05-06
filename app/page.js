'use client';

import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-surface font-body text-on-surface antialiased">
      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
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
        <section className="hero-gradient relative overflow-hidden py-32 md:py-48">
          {/* Animated Background Orbs */}
          <div className="absolute inset-0">
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-400/5 rounded-full blur-3xl animate-pulse animation-delay-4000"></div>
          </div>

          {/* Gradient Mesh Background */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-indigo-500/5 to-violet-500/5"></div>
          </div>

          <div className="max-w-6xl mx-auto px-6 relative z-10 text-center space-y-12">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white/90 text-sm font-medium">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Join 50,000+ local entrepreneurs
            </div>

            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-6xl md:text-8xl font-headline font-extrabold text-white leading-tight tracking-[-0.03em]">
                Shop Local,
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 animate-gradient">
                  Smarter
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed font-light">
                Discover authentic local businesses, handpicked artisans, and community craftspeople. 
                <br className="hidden md:block" />
                Experience AI-powered recommendations & secure digital payments.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <button className="px-10 py-4 bg-white text-indigo-600 font-bold rounded-xl shadow-2xl shadow-indigo-900/30 hover:shadow-2xl hover:shadow-indigo-900/50 hover:scale-105 transition-all active:scale-95 text-lg">
                Explore Now
              </button>
              <Link href="/business-register">
                <button className="px-10 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/20 hover:border-white/50 transition-all active:scale-95 text-lg">
                  Sell Your Products
                </button>
              </Link>
            </div>

            {/* Feature Pills */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 max-w-4xl mx-auto">
              <div className="px-6 py-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 text-white/80 hover:bg-white/10 transition-all cursor-pointer">
                <div className="text-3xl mb-2">🚀</div>
                <p className="font-semibold text-sm">AI Powered</p>
                <p className="text-xs text-white/60 mt-1">Smart recommendations just for you</p>
              </div>
              <div className="px-6 py-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 text-white/80 hover:bg-white/10 transition-all cursor-pointer">
                <div className="text-3xl mb-2">🛡️</div>
                <p className="font-semibold text-sm">Secure & Fast</p>
                <p className="text-xs text-white/60 mt-1">Protected payments & instant delivery</p>
              </div>
              <div className="px-6 py-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 text-white/80 hover:bg-white/10 transition-all cursor-pointer">
                <div className="text-3xl mb-2">🤝</div>
                <p className="font-semibold text-sm">Support Local</p>
                <p className="text-xs text-white/60 mt-1">Empower your community</p>
              </div>
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
