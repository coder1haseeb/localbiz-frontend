'use client';

import { useState } from 'react';

export default function SidebarMenuButton() {
  const [open, setOpen] = useState(false);
  return <button type="button" className="sidebar-menu-toggle" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} onClick={event => {
    event.currentTarget.closest('aside')?.classList.toggle('menu-open', !open);
    setOpen(!open);
  }}><span className="material-symbols-outlined" aria-hidden="true">{open ? 'close' : 'menu'}</span></button>;
}
