'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getSession, routeForRole } from '../lib/session';
import { guestCartCount } from '../lib/guestCart';

export default function SiteNavbar() {
  const pathname = usePathname();
  const [role, setRole] = useState(undefined);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let active = true;
    const update = async () => {
      const session = getSession();
      if (!active) return;
      setRole(session?.user?.role || null);
      if (!session || session.user.role !== 'customer') {
        setCount(guestCartCount());
        return;
      }
      try {
        const response = await fetch('/api/v1/cart', { headers: { Authorization: `Bearer ${session.token}` }, cache: 'no-store' });
        const data = await response.json();
        if (active && data.success) setCount(data.data?.items?.length || 0);
      } catch { if (active) setCount(0); }
    };
    update();
    window.addEventListener('localbiz:cart', update);
    window.addEventListener('localbiz:session', update);
    window.addEventListener('storage', update);
    return () => {
      active = false;
      window.removeEventListener('localbiz:cart', update);
      window.removeEventListener('localbiz:session', update);
      window.removeEventListener('storage', update);
    };
  }, [pathname]);

  const sidebarRoute = pathname === '/home' || pathname === '/checkout' || pathname === '/notifications'
    || pathname === '/orders' || pathname.startsWith('/orders/')
    || pathname === '/profile' || pathname.startsWith('/dashboard') || pathname.startsWith('/admin/dashboard');
  const conditionalSidebar = pathname === '/cart' || pathname.startsWith('/product/');
  if (sidebarRoute || (conditionalSidebar && (role === undefined || role === 'customer'))) return null;

  return <header className="site-navbar">
    <Link href={role ? routeForRole(role) : '/'} className="site-navbar-logo">LocalBiz</Link>
    <nav aria-label="Site navigation">
      <Link href="/browse" onClick={() => window.dispatchEvent(new Event('localbiz:clearBrowse'))}>Browse</Link>
      <Link href="/cart" aria-label={`Cart with ${count} items`}><span className="material-symbols-outlined">shopping_cart</span><span>Cart</span>{count > 0 && <b>{count}</b>}</Link>
      {role === 'customer' && <Link href="/orders">Orders</Link>}
      {role ? <Link href={routeForRole(role)}>My account</Link> : <Link href="/login">Log in</Link>}
    </nav>
  </header>;
}
