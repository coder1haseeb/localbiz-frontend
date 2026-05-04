'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Spinner from '@/components/Spinner';

export default function BusinessOwnerRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContinue = () => {
    if (!formData.fullName || !formData.email || !formData.password || !formData.phone) {
      alert('Please fill in all fields');
      return;
    }
    localStorage.setItem('businessOwnerData', JSON.stringify(formData));
    router.push('/business-register/store-details');
  };

  return (
    <>
      <style jsx>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .glass-morphism {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .body-lg {
          font-size: 1.125rem;
          line-height: 1.75rem;
        }
        .body-md {
          font-size: 1rem;
          line-height: 1.5rem;
        }
      `}</style>

      <div className="bg-surface font-body text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed">
        <header className="bg-[#f7f9fb]/80 backdrop-blur-xl sticky top-0 z-50 shadow-[0_4px_24px_rgba(70,72,212,0.07)]">
          <div className="flex justify-between items-center w-full px-8 py-4">
            <div className="flex items-center gap-4">
              <span className="text-xl font-bold bg-gradient-to-br from-[#4648d4] to-[#6b38d4] bg-clip-text text-transparent font-headline">LocalBiz</span>
            </div>
            <div className="hidden md:flex items-center gap-8 font-headline text-sm font-semibold tracking-tight text-slate-500">
              <a className="hover:text-[#6b38d4] transition-colors duration-200" href="#">Registration Portal</a>
              <a className="hover:text-[#6b38d4] transition-colors duration-200" href="#">Help Center</a>
            </div>
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-slate-500">notifications</span>
              <span className="material-symbols-outlined text-slate-500">settings</span>
            </div>
          </div>
        </header>

        <main className="min-h-screen flex flex-col items-center justify-start pt-12 pb-24 px-4 md:px-8">
          <div className="w-full max-w-4xl mb-12">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface mb-2">Register Your Business</h1>
                <p className="text-on-surface-variant body-lg">Step 1: Business Owner Information</p>
              </div>
              <div className="text-right hidden md:block">
                <span className="text-primary font-bold text-sm tracking-wider uppercase font-label">Completion: 25%</span>
              </div>
            </div>
            <div className="relative w-full h-2 bg-surface-container rounded-full overflow-hidden">
              <div className="absolute top-0 left-0 h-full w-1/4 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
            </div>
            <div className="flex justify-between mt-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm shadow-lg shadow-primary/20">1</div>
                <span className="text-[10px] mt-2 font-bold text-primary uppercase tracking-widest font-label">Owner</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center font-bold text-sm">2</div>
                <span className="text-[10px] mt-2 font-bold text-on-surface-variant uppercase tracking-widest font-label">Details</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center font-bold text-sm">3</div>
                <span className="text-[10px] mt-2 font-bold text-on-surface-variant uppercase tracking-widest font-label">Verification</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center font-bold text-sm">4</div>
                <span className="text-[10px] mt-2 font-bold text-on-surface-variant uppercase tracking-widest font-label">Launch</span>
              </div>
            </div>
          </div>

          <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 glass-morphism rounded-[2rem] p-8 md:p-12 shadow-[0_24px_48px_rgba(70,72,212,0.06)] border border-white/40">
              <div className="mb-10">
                <h2 className="font-headline text-2xl font-bold text-on-surface mb-2">Owner Information</h2>
                <p className="text-on-surface-variant body-md">Please provide the primary contact details for the legal business owner.</p>
              </div>

              <form className="space-y-8">
                <div className="group">
                  <label className="block text-sm font-semibold text-on-surface-variant mb-2 ml-1 font-label">Owner Name</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">person</span>
                    <input 
                      className="w-full pl-12 pr-4 py-4 bg-surface-container-lowest rounded-xl border border-outline-variant/30 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none font-body text-on-surface placeholder:text-outline/50" 
                      placeholder="e.g. Haris Ahmed" 
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-on-surface-variant mb-2 ml-1 font-label">Email Address</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">mail</span>
                    <input 
                      className="w-full pl-12 pr-4 py-4 bg-surface-container-lowest rounded-xl border border-outline-variant/30 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none font-body text-on-surface placeholder:text-outline/50" 
                      placeholder="owner@domain.pk" 
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-on-surface-variant mb-2 ml-1 font-label">Password</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">lock</span>
                    <input 
                      className="w-full pl-12 pr-4 py-4 bg-surface-container-lowest rounded-xl border border-outline-variant/30 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none font-body text-on-surface placeholder:text-outline/50" 
                      placeholder="Enter a strong password" 
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-on-surface-variant mb-2 ml-1 font-label">Phone Number</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">call</span>
                    <input 
                      className="w-full pl-12 pr-4 py-4 bg-surface-container-lowest rounded-xl border border-outline-variant/30 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none font-body text-on-surface placeholder:text-outline/50" 
                      placeholder="+92 300 0000000" 
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="pt-6 flex flex-col md:flex-row gap-4">
                  <button 
                    className="flex-1 bg-gradient-to-br from-primary to-secondary text-on-primary py-4 px-8 rounded-xl font-headline font-bold text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-transform" 
                    type="button"
                    onClick={handleContinue}
                    disabled={loading}
                  >
                    {loading ? <Spinner /> : 'Continue to Details'}
                  </button>
                </div>
              </form>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <div className="bg-primary-container text-on-primary-container p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                <div className="relative z-10">
                  <span className="material-symbols-outlined text-4xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                  <h3 className="font-headline text-xl font-bold mb-3">Why this matters?</h3>
                  <p className="text-sm leading-relaxed opacity-90">We use this information to verify business ownership and ensure secure access to your LocalBiz Atelier dashboard. Your data is encrypted and never shared with third parties.</p>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-8 rounded-[2rem] border border-outline-variant/10">
                <h3 className="font-headline text-lg font-bold text-on-surface mb-6">Application Support</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 hover:bg-surface-container-low rounded-xl transition-colors cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center">
                      <span className="material-symbols-outlined text-xl">chat_bubble</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold font-headline">Live Assistant</p>
                      <p className="text-xs text-on-surface-variant">Available now</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 hover:bg-surface-container-low rounded-xl transition-colors cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-tertiary/10 text-tertiary flex items-center justify-center">
                      <span className="material-symbols-outlined text-xl">auto_awesome</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold font-headline">AI Form Helper</p>
                      <p className="text-xs text-on-surface-variant">Analyze my entries</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative h-48 rounded-[2rem] overflow-hidden group">
                <img
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOyKRVhIwqIcd5rVDpYpzbuVnRXBTQ22K-7x-FjP4JmQ1Eg9iXIDEKjSa7pSGhgN1_M25eFussIuxMTRnIGRuE_1_TZd9Af3ycFPx7OBu5SMqtM0sYxPf8JsryGFEMYzA6JiVbYKyI8arj7ycF9PxOjp3j0jOTqsq9cjOGnG9GNGQPBSGd8_MkB9tXKiZJQQBsODXAJLogcw-zVPsNl1n-jQuLSu1lAe26rn0RBnZgtafbHgvuZqfy85E37cuj4hneqHL8LwfeZbM"
                  alt="a collaborative modern office space with minimalist furniture large windows and warm morning sunlight creating a professional atmosphere"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 to-transparent flex items-end p-6">
                  <p className="text-white text-xs font-medium italic">"Join 2,000+ local businesses scaling with LocalBiz Atelier."</p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className="w-full bg-surface-container-low py-12 px-8 mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <span className="font-headline font-bold text-on-surface">LocalBiz</span>
              <span className="text-outline text-sm">© 2024 Digital Atelier</span>
            </div>
            <div className="flex gap-8 text-sm font-medium text-on-surface-variant">
              <a className="hover:text-primary transition-colors" href="#">Privacy</a>
              <a className="hover:text-primary transition-colors" href="#">Terms</a>
              <a className="hover:text-primary transition-colors" href="#">Support</a>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-outline hover:text-primary transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-lg">public</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-outline hover:text-primary transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-lg">share</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
        