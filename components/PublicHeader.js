'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import LandingActions from './LandingActions';
import { guestCartCount } from '../lib/guestCart';
import { getSession } from '../lib/session';

export default function PublicHeader() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let active = true;
    const update = () => {
      const session = getSession();
      if (!session || session.user.role !== 'customer') { setCount(guestCartCount()); return; }
      fetch('/api/v1/cart', { headers: { Authorization: `Bearer ${session.token}` } })
        .then(response => response.json()).then(data => {
          if (active && data.success) setCount(data.data?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0);
        }).catch(() => {});
    };
    update();
    window.addEventListener('localbiz:cart', update);
    window.addEventListener('localbiz:session', update);
    return () => { active = false; window.removeEventListener('localbiz:cart', update); window.removeEventListener('localbiz:session', update); };
  }, []);
  return <header className="landing-header">
    <Link href="/" className="landing-logo">LocalBiz<span>Local shopping, made simple.</span></Link>
    <nav className="landing-nav" aria-label="Main navigation"><Link href="/browse" onClick={() => window.dispatchEvent(new Event('localbiz:clearBrowse'))}>Browse</Link><Link href="/business-register">Sell on LocalBiz</Link></nav>
    <div className="landing-header-actions"><Link href="/cart" className="landing-cart" aria-label={`Cart with ${count} items`}><span className="material-symbols-outlined">shopping_cart</span>{count > 0 && <b>{count}</b>}</Link><LandingActions /></div>
  </header>;
}
