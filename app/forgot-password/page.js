'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Spinner from '../../components/Spinner';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/forgot-password`,
        {
          email: email,
        }
      );

      setSuccess(true);
      setLoading(false);

      // Redirect to reset password page after 2 seconds
      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
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
              Forgot Password
            </h1>
            <p className="text-on-surface-variant text-base">
              Enter your email address and we'll send you a reset OTP.
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
                Password reset OTP sent to your email! Redirecting to reset page...
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || success}
              className="cursor-pointer w-full h-14 bg-blue-600 text-white font-headline font-bold rounded-xl shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-transform flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Spinner size="md" />
                  <span>Sending...</span>
                </>
              ) : success ? (
                <>
                  <span className="material-symbols-outlined">check_circle</span>
                  <span>Sent!</span>
                </>
              ) : (
                <>
                  Send Reset OTP
                  <span className="material-symbols-outlined text-xl">send</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-8 text-center border-t pt-6">
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