'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Spinner from '@/components/Spinner';

export default function StoreDetailsPage() {
  const router = useRouter();
  const [ownerData, setOwnerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    storeName: '',
    category: '',
    storeCity: '',
    storeAddress: '',
    description: '',
    logo: null
  });

  useEffect(() => {
    const savedOwnerData = localStorage.getItem('businessOwnerData');
    if (savedOwnerData) {
      setOwnerData(JSON.parse(savedOwnerData));
    }

    const fetchCategories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/categories`);
        const data = await res.json();
        if (data.success) {
          setCategories(data.data.categories);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          logo: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveDraft = () => {
    const draftData = {
      owner: ownerData,
      storeDetails: formData,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('businessRegistrationDraft', JSON.stringify(draftData));
    alert('Draft saved successfully!');
  };

  const handleCompleteSetup = async (e) => {
    e.preventDefault();

    if (!formData.storeName || !formData.category || !formData.storeCity || !formData.storeAddress || !formData.description) {
      alert('Please fill in all fields');
      return;
    }

    if (!ownerData) {
      alert('Owner data not found. Please start from the beginning.');
      return;
    }

    setLoading(true);

    try {
      const submitData = {
        fullName: ownerData.fullName,
        email: ownerData.email,
        password: ownerData.password,
        phone: ownerData.phone,
        storeName: formData.storeName,
        categoryId: formData.category,
        city: formData.storeCity,
        address: formData.storeAddress,
        description: formData.description,
        storePhone: ownerData.phone,
        logo: formData.logo || null
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/register/business`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      });

      const data = await response.json();

      if (response.ok || response.status === 201) {
        localStorage.removeItem('businessOwnerData');
        localStorage.removeItem('businessRegistrationDraft');
        alert('Business registered successfully! Awaiting admin approval.');
        router.push('/login');
      } else if (data.errors && data.errors.length > 0) {
        const messages = data.errors.map(e => `${e.field}: ${e.message}`).join('\n');
        alert(`Validation errors:\n${messages}`);
      } else {
        alert(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style jsx>{`
        .glass-panel {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .gradient-text {
          background: linear-gradient(135deg, #4648d4 0%, #6b38d4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .gradient-bg {
          background: linear-gradient(135deg, #4648d4 0%, #6b38d4 100%);
        }
      `}</style>

      <div className="bg-background font-body text-on-surface min-h-screen selection:bg-primary-fixed selection:text-on-primary-fixed">
        {/* Navigation */}
        <nav className="bg-[#f7f9fb]/80 backdrop-blur-xl sticky top-0 z-50 shadow-[0_4px_24px_rgba(70,72,212,0.07)] px-8 py-4 flex justify-between items-center w-full">
          <div className="text-xl font-bold bg-gradient-to-br from-[#4648d4] to-[#6b38d4] bg-clip-text text-transparent font-headline">
            LocalBiz
          </div>
          <div className="hidden md:flex items-center space-x-8 font-headline text-sm font-semibold tracking-tight">
            <span className="text-slate-500 hover:text-[#6b38d4] transition-colors duration-200 cursor-pointer">Support Center</span>
            <div className="flex items-center space-x-3">
              <span className="material-symbols-outlined text-slate-500">help_outline</span>
              <span className="material-symbols-outlined text-slate-500">language</span>
            </div>
          </div>
        </nav>

        <main className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-12">
          {/* Sidebar */}
          <aside className="md:w-1/3 space-y-12">
            <div>
              <h1 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface mb-4">
                The Digital <span className="gradient-text">Atelier</span>
              </h1>
              <p className="text-on-surface-variant text-lg leading-relaxed">
                Set the foundation for your premium business presence. Every detail you provide crafts a unique experience for your local customers.
              </p>
            </div>

            {/* Progress Steps */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold shadow-sm">
                  <span className="material-symbols-outlined text-xl" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                </div>
                <div>
                  <p className="text-sm font-label font-semibold uppercase tracking-wider text-outline">Step 1</p>
                  <p className="font-headline font-bold text-on-surface">Owner Information</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full gradient-bg text-on-primary flex items-center justify-center font-bold shadow-[0_4px_12px_rgba(70,72,212,0.3)]">
                  2
                </div>
                <div>
                  <p className="text-sm font-label font-semibold uppercase tracking-wider text-primary">Step 2</p>
                  <p className="font-headline font-bold text-on-surface">Store Details</p>
                </div>
              </div>

              <div className="flex items-center gap-4 opacity-50">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center font-bold text-on-surface-variant">
                  3
                </div>
                <div>
                  <p className="text-sm font-label font-semibold uppercase tracking-wider text-outline">Step 3</p>
                  <p className="font-headline font-bold text-on-surface">Verification</p>
                </div>
              </div>
            </div>

            {/* AI Insight */}
            <div className="p-6 bg-primary-fixed/30 rounded-2xl border border-primary/10">
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-primary mt-1">auto_awesome</span>
                <p className="text-sm text-on-primary-fixed-variant leading-relaxed">
                  <span className="font-bold">AI Insight:</span> Businesses with detailed descriptions and high-quality logos see 40% higher customer engagement on LocalBiz.
                </p>
              </div>
            </div>
          </aside>

          {/* Main Form */}
          <section className="md:w-2/3">
            <div className="glass-panel rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/40 overflow-hidden">
              {/* Progress Bar */}
              <div className="h-2 w-full bg-surface-container">
                <div className="h-full w-2/3 gradient-bg"></div>
              </div>

              <form onSubmit={handleCompleteSetup} className="p-8 md:p-12 space-y-10">
                {/* Store Name and Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-label font-semibold text-on-surface-variant flex items-center gap-2">
                      Store Name
                      <span className="material-symbols-outlined text-[14px] text-primary">info</span>
                    </label>
                    <input
                      className="w-full bg-surface-container-lowest border-outline-variant/30 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-outline/50"
                      placeholder="e.g. Sapphire Boutique"
                      type="text"
                      name="storeName"
                      value={formData.storeName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-label font-semibold text-on-surface-variant">Category</label>
                    <div className="relative">
                      <select
                        className="w-full appearance-none bg-surface-container-lowest border-outline-variant/30 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select a category</option>
                        {categories.map(cat => (
                          <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                      </select>
                      <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline">expand_more</span>
                    </div>
                  </div>
                </div>

                {/* Store City */}
                <div className="space-y-2">
                  <label className="text-sm font-label font-semibold text-on-surface-variant">Store City</label>
                  <div className="relative">
                    <input
                      className="w-full bg-surface-container-lowest border-outline-variant/30 rounded-xl px-4 py-3 pl-12 focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-outline/50"
                      placeholder="e.g. Lahore"
                      type="text"
                      name="storeCity"
                      value={formData.storeCity}
                      onChange={handleInputChange}
                      required
                    />
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary">location_city</span>
                  </div>
                </div>

                {/* Store Address */}
                <div className="space-y-2">
                  <label className="text-sm font-label font-semibold text-on-surface-variant">Store Address</label>
                  <div className="relative">
                    <input
                      className="w-full bg-surface-container-lowest border-outline-variant/30 rounded-xl px-4 py-3 pl-12 focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-outline/50"
                      placeholder="Street, Building, Floor..."
                      type="text"
                      name="storeAddress"
                      value={formData.storeAddress}
                      onChange={handleInputChange}
                      required
                    />
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary">location_on</span>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm font-label font-semibold text-on-surface-variant">Description</label>
                  <textarea
                    className="w-full bg-surface-container-lowest border-outline-variant/30 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-outline/50"
                    placeholder="Tell us about your craft and heritage..."
                    rows="4"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>

                {/* Logo Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-label font-semibold text-on-surface-variant">Brand Logo</label>
                  <div className="group relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-outline-variant/50 rounded-2xl bg-surface-container-low/30 hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 cursor-pointer">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-surface-container-lowest flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                        <span className="material-symbols-outlined text-primary text-2xl">upload_file</span>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-on-surface">Click to upload or drag & drop</p>
                        <p className="text-xs text-on-surface-variant mt-1">SVG, PNG, JPG (max. 800x800px)</p>
                      </div>
                    </div>
                    <input
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-surface-container">
                  <Link href="/business-register">
                    <button className="text-primary font-semibold flex items-center gap-2 hover:translate-x-[-4px] transition-transform" type="button">
                      <span className="material-symbols-outlined">arrow_back</span>
                      Previous Step
                    </button>
                  </Link>

                  <div className="flex gap-4 w-full sm:w-auto">
                    <button
                      className="px-8 py-4 bg-surface-container-lowest text-on-surface-variant rounded-xl border border-outline-variant/30 font-headline font-semibold hover:bg-surface-container-low transition-colors"
                      type="button"
                      onClick={handleSaveDraft}
                      disabled={loading}
                    >
                      Save Draft
                    </button>

                    <button
                      className="flex-1 sm:flex-none gradient-bg text-on-primary font-bold px-10 py-4 rounded-xl shadow-[0_10px_25px_rgba(70,72,212,0.2)] hover:shadow-[0_15px_30px_rgba(70,72,212,0.3)] active:scale-95 transition-all disabled:opacity-50"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? <Spinner /> : 'Complete Setup'}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Feature Cards */}
            <div className="mt-8 flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              <div className="min-w-[200px] p-4 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
                    <span className="material-symbols-outlined text-lg">verified</span>
                  </div>
                  <span className="text-xs font-label font-bold text-on-surface-variant">TRUST</span>
                </div>
                <p className="text-[13px] font-semibold text-on-surface">Verified Badge</p>
                <p className="text-[11px] text-outline mt-1 leading-tight">Unlocked after step 3 validation.</p>
              </div>

              <div className="min-w-[200px] p-4 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center">
                    <span className="material-symbols-outlined text-lg">analytics</span>
                  </div>
                  <span className="text-xs font-label font-bold text-on-surface-variant">INSIGHTS</span>
                </div>
                <p className="text-[13px] font-semibold text-on-surface">Market Analytics</p>
                <p className="text-[11px] text-outline mt-1 leading-tight">Pre-configured for your category.</p>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="mt-auto border-t border-surface-container-high py-8 px-8">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-outline">© 2024 LocalBiz. All rights reserved. Crafting Pakistani digital futures.</p>
            <div className="flex gap-6 text-sm font-semibold text-on-surface-variant">
              <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
              <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
              <a className="hover:text-primary transition-colors" href="#">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
