'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const fallbackFor = (pathname, role) => {
  if (pathname === '/admin/dashboard') return '/';
  if (pathname.startsWith('/admin/dashboard')) return '/admin/dashboard';
  if (pathname.startsWith('/admin')) return '/';
  if (pathname.startsWith('/dashboard/products/')) return '/dashboard';
  if (pathname.startsWith('/dashboard')) return '/home';
  if (pathname.startsWith('/orders/')) return '/orders';
  if (pathname.startsWith('/business-register/store-details')) return '/business-register';
  if (pathname.startsWith('/payment/')) return '/orders';
  if (pathname.startsWith('/store/') || pathname.startsWith('/product/')) return '/home';
  if (pathname === '/checkout') return '/cart';
  if (pathname === '/returns') return '/orders';
  if (pathname === '/notifications') return role === 'super_admin' ? '/admin/dashboard' : role === 'business_admin' ? '/dashboard' : '/home';
  if (pathname === '/profile' || pathname === '/orders' || pathname === '/cart') return '/home';
  if (pathname === '/verify-email') return '/register';
  if (pathname === '/reset-password') return '/forgot-password';
  return '/';
};

export default function BackButton() {
  const pathname = usePathname();
  const router = useRouter();
  const [previousPath, setPreviousPath] = useState(null);

  useEffect(() => {
    if (!pathname) return;
    try {
      const lastPath = sessionStorage.getItem('localbiz:lastPath');
      if (lastPath && lastPath !== pathname && lastPath.startsWith('/') && !lastPath.startsWith('//')) {
        setPreviousPath(lastPath);
      }
      sessionStorage.setItem('localbiz:lastPath', pathname);
    } catch {
      // Navigation still works through the route fallback when storage is unavailable.
    }
  }, [pathname]);

  if (!pathname || pathname === '/') return null;

  const goBack = () => {
    let role;
    try { role = JSON.parse(localStorage.getItem('user') || '{}').role; } catch { role = null; }
    const publicPath = path => path === '/' || ['/login', '/register', '/business-register', '/forgot-password', '/reset-password', '/verify-email', '/admin/login'].some(prefix => path === prefix || path.startsWith(`${prefix}/`));
    let hasSession = false;
    try { hasSession = Boolean(localStorage.getItem('authToken')); } catch { /* Use the public fallback. */ }
    const canReturn = previousPath && previousPath !== pathname && (hasSession || publicPath(previousPath)) && !(hasSession && previousPath !== '/' && publicPath(previousPath));
    const destination = canReturn ? previousPath : fallbackFor(pathname, role);
    router.push(destination === pathname ? '/' : destination);
  };

  return <button
    type="button"
    onClick={goBack}
    aria-label="Back to previous page"
    className="fixed bottom-24 right-4 md:bottom-6 md:right-6 z-[90] inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white/95 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur hover:border-[#806794] hover:text-[#806794] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#806794]"
  >
    <span className="material-symbols-outlined text-lg" aria-hidden="true">arrow_back</span>
    Back
  </button>;
}
