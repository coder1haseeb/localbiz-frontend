'use client';

import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    city: '',
    phone: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/v1/auth/register/customer`,
        {
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          city: formData.city,
          phone: formData.phone,
        }
      );

      setSuccess(true);

      // Redirect to verify email page after 1.5 seconds
      setTimeout(() => {
        window.location.href = `/verify-email?email=${encodeURIComponent(formData.email)}`;
      }, 1500);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'An error occurred. Please try again.';
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface font-body text-on-surface antialiased min-h-screen flex items-center justify-center p-4 md:p-8">
      <main className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch min-h-[870px]">
        {/* Left Column: Brand Visual */}
        <section className="md:col-span-5 relative hidden md:flex flex-col justify-between overflow-hidden rounded-[2rem] bg-on-primary-container p-12">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-container/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-container/20 rounded-full blur-3xl -ml-48 -mb-48"></div>

          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-12">
              <div className="w-10 h-10 rounded-xl btn-gradient flex items-center justify-center text-white shadow-lg">
                <span className="material-symbols-outlined">local_mall</span>
              </div>
              <span className="font-headline font-bold text-2xl tracking-tight text-white">LocalBiz</span>
            </div>
            <h1 className="font-headline text-5xl font-extrabold text-white leading-[1.1] tracking-tighter mb-6">
              Elevate Your <br />Local Experience.
            </h1>
            <p className="text-primary-fixed/80 text-lg max-w-md font-medium leading-relaxed text-white">
              Join the digital atelier connecting Pakistan's finest craftsmanship with modern technology.
            </p>
          </div>

          <div className="relative z-10 mt-auto">
            <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-white/5">
              <div className="flex items-center space-x-4">
                <div className="flex -space-x-2">
                  <img
                    className="w-10 h-10 rounded-full border-2 border-primary ring-2 ring-on-primary-container"
                    alt="User 1"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3CxI_9gTkwH8ASMoz4g3xe9uk2cQjuQFR86P4jgGkpvfSO-zkyPW6BdTjKNdhU38Wo0LmqOtn7gQdNAihg9uAU5W-e2hVJ2oOZ5isPjboVd5pk5mp5XCyRHO3FD8ngMUKA_q8YO4vuh-3SqtTmp2umh44J6LGdHFSBOlgsRrSzPpQT-OEWdJ0ptPMXGwc72C25qDObzzz-S42wmoAqBBpEqBTMh-FIyF3zRB9vzcxeEtinHo4RdiyRabN9F2l11Vq48b2HXwqQpc"
                  />
                  <img
                    className="w-10 h-10 rounded-full border-2 border-primary ring-2 ring-on-primary-container"
                    alt="User 2"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCygOLYnoDS9xa-CY6ZZkuFbLcsBhUSvqPUupilejrJhQ_cVuxq4eZZuEx-UxoJmkZVlwfzNJqijC5pz_LiDCwgReq60oAV7dnjsCf8PLn0EGUSVny83lUHzWYyxtCIuYttpy-TyXLu_sDUCr5mySPFaBgjrbX3WTKAwx63U6dZdldvdySLuqWFjXJHcz4XiTxypR4mYRUjdu4mDthDOFkgimdYL86RiUTdD3QltQv80_a-BRiKp5Bp9q8FhO0DrzcDlXPBJpHrCOg"
                  />
                  <div className="w-10 h-10 rounded-full bg-secondary-container border-2 border-primary ring-2 ring-on-primary-container flex items-center justify-center text-[10px] font-bold text-white">
                    +2k
                  </div>
                </div>
                <p className="text-sm text-primary-fixed/60 font-medium">Trusted by local entrepreneurs across the country.</p>
              </div>
            </div>
          </div>

          {/* Background Image */}
          <div className="absolute inset-0 z-0 opacity-90">
            <img
              className="w-full h-full object-cover"
              alt="Background"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8nXLIBIxOuy7sfuBtBiViQEkzA18G19Yz99gDWsWrh3KoN1IhujCKb9jr59JDMH1lraF4HjPmz_WEy74Dx4WypXJrYRdzbVl2VmRFXW2J6RXrTcT816GlYshDMET9NGo1itzB6s_jbrm6DLG6nM07xk1nYgXHrwUx42HaSDT7_3jiE24eTvb7FSqedc_Y519s2HZ8smy0pEQtX_F74KRmDMaOc7mouuGFP8IrgQOKaqTxZFF6SqyWLfZ1v46eSb1dKSxfKqMbS3g"
            />
          </div>
        </section>

        {/* Right Column: Registration Form */}
        <section className="md:col-span-7 flex flex-col justify-center">
          <div className="w-full max-w-xl mx-auto space-y-8">
            {/* Step Indicator */}
            <nav className="flex items-center justify-between px-2 mb-4">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center btn-gradient text-white shadow-lg shadow-primary/20 ring-4 ring-primary-fixed">
                  <span className="material-symbols-outlined">person_add</span>
                </div>
                <span className="text-[11px] font-bold tracking-wider uppercase text-primary">Register</span>
              </div>
              <div className="flex-1 h-[2px] mx-4 bg-surface-container-highest self-start mt-5"></div>
              <div className="flex flex-col items-center space-y-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container-high text-on-surface-variant">
                  <span className="material-symbols-outlined">mark_email_unread</span>
                </div>
                <span className="text-[11px] font-bold tracking-wider uppercase text-on-surface-variant">Verify Email</span>
              </div>
              <div className="flex-1 h-[2px] mx-4 bg-surface-container-highest self-start mt-5"></div>
              <div className="flex flex-col items-center space-y-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container-high text-on-surface-variant">
                  <span className="material-symbols-outlined">shopping_bag</span>
                </div>
                <span className="text-[11px] font-bold tracking-wider uppercase text-on-surface-variant">Start Shopping</span>
              </div>
            </nav>

            {/* Form Card */}
            <div className="bg-surface-container-lowest rounded-[2rem] p-8 md:p-12 shadow-[0_24px_48px_rgba(70,72,212,0.04)] border border-white/20">
              <div className="mb-10 text-center md:text-left">
                <h2 className="font-headline text-3xl font-bold text-on-surface mb-2 tracking-tight">
                  Create your account
                </h2>
                <p className="text-on-surface-variant text-base">
                  Enter your details to begin your journey with LocalBiz.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-error/10 border border-error rounded-2xl">
                  <p className="text-error font-semibold text-sm">{error}</p>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500 rounded-2xl">
                  <p className="text-green-700 font-semibold text-sm">Registration successful! Redirecting to email verification...</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <label htmlFor="fullName" className="block text-sm font-semibold text-on-surface ml-1">
                    Full Name
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline group-focus-within:text-primary transition-colors">
                      <span className="material-symbols-outlined">badge</span>
                    </div>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="Arsalan Khan"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="block w-full pl-12 pr-4 py-4 bg-surface-container-low border-transparent focus:border-primary focus:bg-white focus:ring-0 rounded-2xl text-on-surface placeholder:text-outline transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-semibold text-on-surface ml-1">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline group-focus-within:text-primary transition-colors">
                      <span className="material-symbols-outlined">alternate_email</span>
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="name@example.pk"
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full pl-12 pr-4 py-4 bg-surface-container-low border-transparent focus:border-primary focus:bg-white focus:ring-0 rounded-2xl text-on-surface placeholder:text-outline transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-semibold text-on-surface ml-1">
                    Phone Number
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline group-focus-within:text-primary transition-colors">
                      <span className="material-symbols-outlined">phone</span>
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="03001234567"
                      value={formData.phone}
                      onChange={handleChange}
                      className="block w-full pl-12 pr-4 py-4 bg-surface-container-low border-transparent focus:border-primary focus:bg-white focus:ring-0 rounded-2xl text-on-surface placeholder:text-outline transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                {/* Password Fields Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-semibold text-on-surface ml-1">
                      Password
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline group-focus-within:text-primary transition-colors">
                        <span className="material-symbols-outlined">lock</span>
                      </div>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        className="block w-full pl-12 pr-4 py-4 bg-surface-container-low border-transparent focus:border-primary focus:bg-white focus:ring-0 rounded-2xl text-on-surface placeholder:text-outline transition-all duration-300"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-on-surface ml-1">
                      Confirm Password
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline group-focus-within:text-primary transition-colors">
                        <span className="material-symbols-outlined">security</span>
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="block w-full pl-12 pr-4 py-4 bg-surface-container-low border-transparent focus:border-primary focus:bg-white focus:ring-0 rounded-2xl text-on-surface placeholder:text-outline transition-all duration-300"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* City Dropdown */}
                <div className="space-y-2">
                  <label htmlFor="city" className="block text-sm font-semibold text-on-surface ml-1">
                    City / Area
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline group-focus-within:text-primary transition-colors">
                      <span className="material-symbols-outlined">map</span>
                    </div>
                    <select
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="block w-full pl-12 pr-10 py-4 bg-surface-container-low border-transparent focus:border-primary focus:bg-white focus:ring-0 rounded-2xl text-on-surface appearance-none transition-all duration-300"
                      required
                    >
                      <option value="">Select your location</option>
                      <option value="karachi">Karachi</option>
                      <option value="lahore">Lahore</option>
                      <option value="islamabad">Islamabad</option>
                      <option value="faisalabad">Faisalabad</option>
                      <option value="multan">Multan</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-outline">
                      <span className="material-symbols-outlined">expand_more</span>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || success}
                  className="w-full btn-gradient py-4 rounded-2xl text-white font-headline font-bold text-lg shadow-xl shadow-primary/20 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center space-x-2 mt-8 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin">
                        <span className="material-symbols-outlined">loading</span>
                      </span>
                      <span>Registering...</span>
                    </>
                  ) : (
                    <>
                      <span>Register Account</span>
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </>
                  )}
                </button>
              </form>

              {/* Footer Link */}
              <div className="mt-8 text-center">
                <p className="text-sm font-medium text-on-surface-variant">
                  Already have an account?{' '}
                  <Link href="/login" className="text-primary font-bold hover:text-secondary transition-colors ml-1">
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>

            {/* AI Insight */}
            <div className="bg-primary/5 rounded-2xl p-4 flex items-start space-x-4 border border-primary/10">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shrink-0 shadow-sm">
                <span className="material-symbols-outlined">auto_awesome</span>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Local Insight</p>
                <p className="text-sm text-on-surface-variant font-medium leading-tight">
                  Your data is secured with AES-256 encryption using our regional servers in Karachi.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
