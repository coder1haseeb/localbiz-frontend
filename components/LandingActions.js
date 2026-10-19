'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSession, routeForRole } from '../lib/session';

export default function LandingActions({ placement = 'header' }) {
  const [destination, setDestination] = useState(null);
  useEffect(() => {
    const update = () => setDestination(getSession()?.user?.role || null);
    update();
    window.addEventListener('localbiz:session', update);
    return () => window.removeEventListener('localbiz:session', update);
  }, []);
  const href = destination ? routeForRole(destination) : '/login';
  if (placement === 'hero') return <Link href={destination ? href : '/browse'} className="landing-button-primary">{destination ? 'Go to your dashboard' : 'Explore stores'} <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span></Link>;
  return <div className="landing-header-actions">{!destination && <Link href="/login" className="landing-login">Log in</Link>}<Link href={destination ? href : '/register'} className="landing-join">{destination ? 'My account' : 'Get started'} <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span></Link></div>;
}
