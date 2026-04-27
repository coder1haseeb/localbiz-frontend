'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useSearchParams, useRouter } from 'next/navigation';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email') || '';

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Countdown timer for resend
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/v1/auth/verify-email`,
        {
          email: email,
          otp: otp,
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
        'Verification failed. Please try again.';
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setError('');

    try {
      await axios.post(`http://localhost:5000/api/v1/auth/resend-otp`, {
        email: email,
      });

      setResendTimer(60); // 60 seconds cooldown
      setOtp('');
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Failed to resend OTP. Please try again.';
      setError(errorMessage);
      setResendLoading(false);
    }
  };

  return (
    <div className="bg-surface font-body text-on-surface antialiased min-h-screen flex items-center justify-center p-4 md:p-8">
      <main className="w-full max-w-2xl">
        <div className="bg-surface-container-lowest rounded-[2rem] p-8 md:p-12 shadow-[0_24px_48px_rgba(70,72,212,0.04)] border border-white/20">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-full btn-gradient flex items-center justify-center mx-auto mb-6 shadow-lg">
              <span className="material-symbols-outlined text-white text-2xl">
                mark_email_unread
              </span>
            </div>
            <h1 className="font-headline text-4xl font-bold text-on-surface mb-3 tracking-tight">
              Verify Your Email
            </h1>
            <p className="text-on-surface-variant text-base max-w-md mx-auto leading-relaxed">
              We've sent a 6-digit verification code to <span className="font-semibold text-on-surface">{email}</span>. Enter it below to verify your account.
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
              <p className="text-green-700 font-semibold text-sm">
                Email verified successfully! Redirecting to login...
              </p>
            </div>
          )}

          {/* OTP Form */}
          <form onSubmit={handleVerify} className="space-y-6 mb-8">
            {/* OTP Input */}
            <div className="space-y-3">
              <label htmlFor="otp" className="block text-sm font-semibold text-on-surface ml-1">
                Enter Verification Code
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline group-focus-within:text-primary transition-colors">
                  <span className="material-symbols-outlined">vpn_key</span>
                </div>
                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  maxLength="6"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setOtp(value);
                    setError('');
                  }}
                  className="block w-full pl-12 pr-4 py-4 bg-surface-container-low border-transparent focus:border-primary focus:bg-white focus:ring-0 rounded-2xl text-on-surface placeholder:text-outline transition-all duration-300 text-center text-2xl tracking-widest font-semibold"
                  required
                />
              </div>
              <p className="text-xs text-on-surface-variant ml-1">
                {otp.length}/6 digits entered
              </p>
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={loading || success}
              className="w-full btn-gradient py-4 rounded-2xl text-white font-headline font-bold text-lg shadow-xl shadow-primary/20 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <span className="animate-spin">
                    <span className="material-symbols-outlined">loading</span>
                  </span>
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Verify Email</span>
                  <span className="material-symbols-outlined">done</span>
                </>
              )}
            </button>
          </form>

          {/* Resend OTP Section */}
          <div className="flex flex-col items-center gap-4 pt-6 border-t border-surface-container">
            <p className="text-sm text-on-surface-variant">
              Didn't receive the code?
            </p>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendTimer > 0 || resendLoading}
              className="text-primary font-bold hover:text-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span className="material-symbols-outlined">refresh</span>
              {resendTimer > 0 ? (
                <span>Resend in {resendTimer}s</span>
              ) : (
                <span>Resend OTP</span>
              )}
            </button>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-on-surface-variant">
              Wrong email?{' '}
              <Link href="/register" className="text-primary font-bold hover:text-secondary transition-colors ml-1">
                Go back
              </Link>
            </p>
          </div>
        </div>

        {/* Security Info */}
        <div className="bg-primary/5 rounded-2xl p-4 flex items-start space-x-4 border border-primary/10 mt-8">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shrink-0 shadow-sm">
            <span className="material-symbols-outlined">security</span>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">
              Secure Process
            </p>
            <p className="text-sm text-on-surface-variant font-medium leading-tight">
              Your verification code is valid for 10 minutes. Do not share it with anyone.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
