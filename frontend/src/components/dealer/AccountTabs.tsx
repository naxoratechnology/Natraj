import React from 'react';
import { NavLink } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

export function AccountTabs() {
  return (
    <div className="mb-6 flex gap-1 border-b border-line">
      {[
      { label: 'Profile', to: '/dealer/profile' },
      { label: 'Settings', to: '/dealer/settings' }].
      map((t) =>
      <NavLink
        key={t.to}
        to={t.to}
        className={({ isActive }) =>
        twMerge('relative px-3 pb-3 pt-1 text-sm font-medium', isActive ? 'text-brand after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:rounded-full after:bg-brand' : 'text-muted hover:text-ink')
        }>
        
          {t.label}
        </NavLink>
      )}
    </div>);

}