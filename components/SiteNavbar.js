'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clearSession, getSession, routeForRole } from '../lib/session';
import { guestCartCount } from '../lib/guestCart';
import SidebarMenuButton from './SidebarMenuButton';

export default function SiteNavbar() {
  const pathname = usePathname();
  const router = useRouter();
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

  const sidebarRoute = pathname === '/home' || pathname === '/cart' || pathname === '/checkout' || pathname === '/notifications'
    || pathname === '/orders' || pathname.startsWith('/orders/')
    || pathname === '/profile' || pathname.startsWith('/dashboard') || pathname.startsWith('/admin/dashboard');
  const conditionalSidebar = pathname.startsWith('/product/');
  const customerArea = pathname === '/home' || pathname === '/cart' || pathname === '/checkout' || pathname === '/notifications'
    || pathname === '/orders' || pathname.startsWith('/orders/') || pathname === '/returns' || pathname === '/profile'
    || pathname === '/browse' || pathname === '/nearby' || pathname === '/recommendations' || pathname.startsWith('/product/') || pathname.startsWith('/store/');

  useEffect(() => {
    document.body.classList.toggle('customer-sidebar-layout', role === 'customer' && customerArea);
    return () => document.body.classList.remove('customer-sidebar-layout');
  }, [role, customerArea]);

  if (role === 'customer' && customerArea) {
    const links = [
      ['/home', 'storefront', 'Home'], ['/recommendations', 'auto_awesome', 'Recommended'], ['/browse', 'search', 'Search products'], ['/nearby', 'near_me', 'Nearby stores'],
      ['/cart', 'shopping_cart', 'My Cart'], ['/orders', 'receipt_long', 'My Orders'], ['/returns', 'assignment_return', 'Returns'],
      ['/notifications', 'notifications', 'Notifications'], ['/profile', 'account_circle', 'Account settings'],
    ];
    return <aside className="customer-global-sidebar h-screen w-72 fixed left-0 top-0 bg-[#efeee7] flex flex-col p-4 space-y-2 font-[var(--font-body-face)] text-[13px] font-medium z-50">
      <SidebarMenuButton />
      <Link href="/home" className="flex items-center gap-3 px-3 py-6 mb-4 text-lg font-bold text-[#253027]">LocalBiz <span className="text-xs font-normal text-slate-500">Marketplace</span></Link>
      <nav aria-label="Customer navigation" className="flex-1 space-y-1">
        {links.map(([href, icon, label]) => {
          const active = pathname === href || (href === '/orders' && pathname.startsWith('/orders/')) || (href === '/browse' && (pathname.startsWith('/product/') || pathname.startsWith('/store/')));
          return <Link key={href} href={href} onClick={href === '/browse' ? () => window.dispatchEvent(new Event('localbiz:clearBrowse')) : undefined}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg ${active ? 'bg-white text-[#31543d] font-semibold' : 'text-slate-500 hover:bg-white'}`}>
            <span className="material-symbols-outlined" aria-hidden="true">{icon}</span><span>{label}</span>
            {href === '/cart' && count > 0 && <span className="ml-auto bg-[#31543d] text-white rounded-full px-2 text-xs">{count}</span>}
          </Link>;
        })}
      </nav>
      <button type="button" onClick={() => { clearSession(); router.replace('/login'); }} className="flex items-center gap-3 w-full px-4 py-3 text-red-600 font-semibold rounded-lg hover:bg-red-50">
        <span className="material-symbols-outlined" aria-hidden="true">logout</span><span>Logout</span>
      </button>
    </aside>;
  }
  if (sidebarRoute || (conditionalSidebar && (role === undefined || role === 'customer'))) return null;

  return <header className="site-navbar">
    <Link href={role ? routeForRole(role) : '/'} className="site-navbar-logo">LocalBiz</Link>
    <nav aria-label="Site navigation">
      <Link href="/browse" onClick={() => window.dispatchEvent(new Event('localbiz:clearBrowse'))}>Browse</Link>
      <Link href="/nearby">Nearby stores</Link>
      <Link href="/cart" aria-label={`Cart with ${count} items`}><span className="material-symbols-outlined">shopping_cart</span><span>Cart</span>{count > 0 && <b>{count}</b>}</Link>
      {role === 'customer' && <Link href="/orders">Orders</Link>}
      {role ? <Link href={routeForRole(role)}>My account</Link> : <Link href="/login">Log in</Link>}
    </nav>
  </header>;
}
