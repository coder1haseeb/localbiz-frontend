'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import Spinner from '../../components/Spinner';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [formData, setFormData] = useState({
    otp: '',
    newPassword: '',
    confirmPassword: '',
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
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password strength (basic check)
    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/reset-password`,
        {
          email: email,
          otp: formData.otp,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        }
      );

      setSuccess(true);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'An error occurred. Please try again.';
      setError(errorMessage);
      setLoading(false);
    }
  };

  // Redirect if no email provided
  useEffect(() => {
    if (!email) {
      router.push('/forgot-password');
    }
  }, [email, router]);

  if (!email) {
    return null; // or a loading state
  }

  return (
    <div className="min-h-screen bg-surface-bright font-body text-on-surface antialiased flex items-center justify-center p-4">
      <main className="w-full max-w-md overflow-hidden rounded-[2rem] bg-surface-container-lowest shadow-2xl shadow-primary/10">
        {/* Form Section */}
        <section className="flex flex-col justify-center px-8 md:px-12 py-12 relative z-10 bg-white">
          {/* Logo */}
          <div className="mb-10 flex items-center gap-2 justify-center">
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
          <div className="space-y-2 mb-8 text-center">
            <h1 className="font-headline text-3xl font-bold text-on-surface tracking-tight">
              Reset Password
            </h1>
            <p className="text-on-surface-variant text-base">
              Enter the OTP sent to your email and set a new password.
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
                Password reset successful! Redirecting to login...
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Display */}
            <div className="text-center">
              <p className="text-sm text-on-surface-variant mb-2">Resetting password for:</p>
              <p className="font-semibold text-on-surface bg-surface-container-lowest px-3 py-2 rounded-lg">
                {email}
              </p>
            </div>

            {/* OTP Input */}
            <div className="floating-label-group">
              <input
                type="text"
                id="otp"
                name="otp"
                placeholder=" "
                value={formData.otp}
                onChange={handleChange}
                className="w-full h-14 px-4 bg-surface-container-lowest border-2 border-surface-container-high rounded-xl focus:border-primary focus:ring-0 outline-none transition-all text-on-surface text-center text-2xl font-mono tracking-widest"
                maxLength="6"
                required
              />
              <label
                htmlFor="otp"
                className="text-on-surface-variant font-label font-semibold"
              >
                OTP Code
              </label>
            </div>

            {/* New Password Input */}
            <div className="floating-label-group">
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                placeholder=" "
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full h-14 px-4 bg-surface-container-lowest border-2 border-surface-container-high rounded-xl focus:border-primary focus:ring-0 outline-none transition-all text-on-surface"
                required
              />
              <label
                htmlFor="newPassword"
                className="text-on-surface-variant font-label font-semibold"
              >
                New Password
              </label>
            </div>

            {/* Confirm Password Input */}
            <div className="floating-label-group">
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder=" "
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full h-14 px-4 bg-surface-container-lowest border-2 border-surface-container-high rounded-xl focus:border-primary focus:ring-0 outline-none transition-all text-on-surface"
                required
              />
              <label
                htmlFor="confirmPassword"
                className="text-on-surface-variant font-label font-semibold"
              >
                Confirm New Password
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || success}
              className="cursor-pointer w-full h-14 bg-blue-600 text-white font-headline font-bold rounded-xl shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-transform flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Spinner size="md" />
                  <span>Resetting...</span>
                </>
              ) : success ? (
                <>
                  <span className="material-symbols-outlined">check_circle</span>
                  <span>Success!</span>
                </>
              ) : (
                <>
                  Reset Password
                  <span className="material-symbols-outlined text-xl">lock_reset</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-8 text-center border-t pt-6 space-y-2">
            <p className="text-sm font-medium text-on-surface-variant">
              Didn't receive OTP?{' '}
              <Link href="/forgot-password" className="text-primary font-bold hover:text-secondary transition-colors ml-1">
                Try again
              </Link>
            </p>
            <p className="text-sm font-medium text-on-surface-variant">
              Remember your password?{' '}
              <Link href="/login" className="text-primary font-bold hover:text-secondary transition-colors ml-1">
                Sign in here
              </Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}