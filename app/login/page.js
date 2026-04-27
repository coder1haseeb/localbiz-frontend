'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Load remembered email on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `http://localhost:5000/api/v1/auth/login`,
        {
          email: email,
          password: password,
        }
      );

      const { data } = response.data;

      // Store token
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Store remember me preference
      if (rememberMe) {
        localStorage.setItem('rememberEmail', email);
      } else {
        localStorage.removeItem('rememberEmail');
      }

      setSuccess(true);

      // Redirect based on role
      setTimeout(() => {
        if (data.role === 'seller') {
          router.push('/seller/dashboard');
        } else if (data.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/home');
        }
      }, 1500);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Login failed. Please try again.';
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-bright font-body text-on-surface antialiased flex items-center justify-center p-4">
      <main className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-[2rem] bg-surface-container-lowest shadow-2xl shadow-primary/10 min-h-[650px]">
        {/* Left Side: Login Form */}
        <section className="flex flex-col justify-center px-8 md:px-16 py-12 relative z-10 bg-white">
          {/* Logo */}
          <div className="mb-10 flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                storefront
              </span>
            </div>
            <span className="font-headline text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              LocalBiz
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-2 mb-8">
            <h1 className="font-headline text-3xl font-bold text-on-surface tracking-tight">
              Welcome Back
            </h1>
            <p className="text-on-surface-variant text-base">
              Enter your credentials to access your Digital Atelier.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-error/10 border border-error rounded-xl">
              <p className="text-error font-semibold text-sm">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500 rounded-xl">
              <p className="text-green-700 font-semibold text-sm">
                Login successful! Redirecting...
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="floating-label-group">
              <input
                type="email"
                id="email"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-14 px-4 bg-surface-container-lowest border-2 border-surface-container-high rounded-xl focus:border-primary focus:ring-0 outline-none transition-all text-on-surface"
                required
              />
              <label
                htmlFor="email"
                className="text-on-surface-variant font-label font-semibold"
              >
                Email Address
              </label>
            </div>

            {/* Password Input */}
            <div className="floating-label-group">
              <input
                type="password"
                id="password"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-14 px-4 bg-surface-container-lowest border-2 border-surface-container-high rounded-xl focus:border-primary focus:ring-0 outline-none transition-all text-on-surface"
                required
              />
              <label
                htmlFor="password"
                className="text-on-surface-variant font-label font-semibold"
              >
                Password
              </label>
            </div>

            {/* Checkbox & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-5 h-5 rounded border-surface-container-high text-primary focus:ring-primary/20"
                />
                <span className="text-on-surface-variant group-hover:text-primary transition-colors">
                  Remember me
                </span>
              </label>
              <Link
                href="#"
                className="text-primary font-semibold hover:underline decoration-2 underline-offset-4"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || success}
              className="cursor-pointer w-full h-14 bg-blue-600 text-white font-headline font-bold rounded-xl shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-transform flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="animate-spin">
                    <span className="material-symbols-outlined">loading</span>
                  </span>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  Sign In
                  <span className="material-symbols-outlined text-xl">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Divider & Google Sign-In */}
          <div className="mt-8 pt-8 border-t border-surface-container flex flex-col gap-4">
            <button
              type="button"
              className="w-full h-12 border-2 border-surface-container text-on-surface font-semibold rounded-xl flex items-center justify-center gap-3 hover:bg-surface-container-low transition-colors"
            >
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0qKqVFCARakyPydAodc4wUQDgwqVE-6aMBLYLbQv6i5N5y7bC5SajqSjHPzt8UJUqbZ8a_IJZzHEZ2_G5GmuqatqJigDGAXvxYplrT8ooMvjzT43LXYX1QNQxxek-GNMPFdGeHhPx3xJjZlGxJfxdMF5FopnK6HmPOo2QA00TK1r8TfaN9b4WXyM48IC2kpa_cRTQnj4NQIlO8q4d7_YHrvIOwBr3IhD4oyzsWb9oj7aSBXNJp10uYBc5VYPSLNi_XEsTmf3jvSY"
                alt="Google logo"
                className="w-5 h-5"
              />
              <span className="hidden sm:inline">Continue with Google</span>
              <span className="sm:hidden">Google</span>
            </button>

            <p className="text-center text-sm text-on-surface-variant">
              Don't have an account?{' '}
              <Link href="/register" className="text-primary font-bold hover:underline">
                Start free trial
              </Link>
            </p>
          </div>
        </section>

        {/* Right Side: Editorial Pattern (Hidden on Mobile) */}
        <section className="hidden md:flex relative items-center justify-center bg-surface-container-low overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDviIPulVo6FROSVXGoBAM7wxy3NzGTXEdSVb9FijeNskm0lNH6MYu6YywVLzHO3QmPDFqLReIKppCchV9_FbGlSLq1DtuW6AiDyM2F9OWS6J7Ptu7yK8TjUzPzyzraNNIWq6mk2-HPPrgyBmGF538Rx6QZLVWh1rEYVz46pfiZhouTTlO6oDlyiIcxVBWSbbmrBwofVB4RBehoDQFNnObwBrtTO4MFvhfKWIGgcMRd51HvSo7QT0YcCKI7D0t1hpLaYicK6XKwKGw"
              alt="Background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-secondary/60 mix-blend-multiply"></div>
          </div>

          {/* Glassmorphic Overlay */}
          <div className="relative z-10 p-8 rounded-3xl border border-white/20 max-w-sm mx-auto shadow-2xl">
            <div className="mb-6">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/30 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider mb-4 border border-white/20">
                AI Insights Enabled
              </div>
              <h2 className="font-headline text-2xl font-bold text-white leading-tight mb-4">
                Revolutionizing Local Commerce.
              </h2>
              <p className="text-white/80 text-base leading-relaxed">
                Join over 2,000 Pakistani businesses scaling their operations with our Digital Atelier dashboard.
              </p>
            </div>

            {/* Stats */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-white/10 p-3 rounded-2xl border border-white/10">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <span
                    className="material-symbols-outlined text-white text-xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    trending_up
                  </span>
                </div>
                <div>
                  <p className="text-white font-bold text-sm">+24% Revenue Growth</p>
                  <p className="text-white/60 text-xs">Average user first month</p>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Shapes */}
          {/* <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 backdrop-blur-2xl rounded-full border border-white/10"></div> */}
          <div className="absolute bottom-20 -left-10 w-48 h-48 bg-white/5 backdrop-blur-3xl rounded-full border border-white/5"></div>
        </section>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-6 left-0 w-full flex justify-center px-4">
        <nav className="flex flex-col sm:flex-row gap-4 sm:gap-6 text-on-surface-variant font-label text-xs font-semibold text-center">
          <Link href="#" className="hover:text-primary transition-colors">
            Privacy Policy
          </Link>
          <Link href="#" className="hover:text-primary transition-colors">
            Terms of Service
          </Link>
          <Link href="#" className="hover:text-primary transition-colors">
            Contact Support
          </Link>
        </nav>
      </footer>
    </div>
  );
}
