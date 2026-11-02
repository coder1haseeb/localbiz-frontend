'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';

export default function SidebarMenuButton() {
  const marker = useRef(null);
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setMounted(true);
    try { setCollapsed(sessionStorage.getItem('localbiz:sidebarCollapsed') === 'true'); } catch {}
    const media = window.matchMedia('(max-width: 767px)');
    const update = () => { setMobile(media.matches); setMobileOpen(false); };
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    const aside = marker.current?.closest('aside');
    aside?.classList.toggle('menu-open', mobile && mobileOpen);
    document.body.classList.toggle('sidebar-collapsed', !mobile && collapsed);
    return () => {
      aside?.classList.remove('menu-open');
      document.body.classList.remove('sidebar-collapsed');
    };
  }, [mobile, mobileOpen, collapsed]);

  const open = mobile ? mobileOpen : !collapsed;
  return <>
    <span ref={marker} hidden />
    {mounted && createPortal(<button type="button" className={`sidebar-global-toggle ${!mobile && collapsed ? 'is-collapsed' : ''}`} aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} onClick={() => {
      if (mobile) setMobileOpen(value => !value);
      else {
        setCollapsed(!collapsed);
        try { sessionStorage.setItem('localbiz:sidebarCollapsed', String(!collapsed)); } catch {}
      }
    }}><span className="material-symbols-outlined" aria-hidden="true">{open ? 'close' : 'menu'}</span></button>, document.body)}
  </>;
}
