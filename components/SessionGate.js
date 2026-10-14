'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getSession, routeForRole } from '../lib/session';

const authPages = ['/login', '/register', '/business-register', '/admin/login'];
const customerPages = ['/home', '/cart', '/checkout', '/orders', '/profile', '/returns'];

export default function SessionGate({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(pathname === '/' || pathname === '/forgot-password' || pathname === '/verify-email' || pathname === '/reset-password');
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const update = () => setRevision(value => value + 1);
    window.addEventListener('storage', update);
    window.addEventListener('localbiz:session', update);
    return () => {
      window.removeEventListener('storage', update);
      window.removeEventListener('localbiz:session', update);
    };
  }, []);

  useEffect(() => {
    const session = getSession();
    const role = session?.user.role;
    const isAuthPage = authPages.some(path => pathname === path || pathname.startsWith(`${path}/`));
    const isAdmin = pathname.startsWith('/admin/dashboard');
    const isSeller = pathname.startsWith('/dashboard');
    const isCustomer = customerPages.some(path => pathname === path || pathname.startsWith(`${path}/`));

    let destination = null;
    if (session && isAuthPage) destination = routeForRole(role);
    else if (!session && (isAdmin || isSeller || isCustomer)) destination = isAdmin ? '/admin/login' : '/login';
    else if (session && isAdmin && role !== 'super_admin') destination = routeForRole(role);
    else if (session && isSeller && role !== 'business_admin') destination = routeForRole(role);
    else if (session && isCustomer && role !== 'customer') destination = routeForRole(role);

    if (destination && destination !== pathname) {
      setReady(false);
      router.replace(destination);
    } else setReady(true);
  }, [pathname, router, revision]);

  return ready ? children : <div className="min-h-screen grid place-items-center text-sm text-slate-500" role="status">Loading…</div>;
}
