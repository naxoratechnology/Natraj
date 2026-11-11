import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { MenuIcon, XIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { Logo } from '../ui/Logo';
import { buttonClasses } from '../ui/Button';

const navItems = [
{ label: 'Home', to: '/' },
{ label: 'How It Works', to: '/how-it-works' },
{ label: 'Features', to: '/features' },
{ label: 'Finance Solutions', to: '/finance-solutions' },
{ label: 'For Dealers', to: '/for-dealers' },
{ label: 'About', to: '/about' },
{ label: 'Contact', to: '/contact' }];


export function PublicHeader() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-white/80 bg-white/80 shadow-[0_8px_30px_-24px_rgba(8,43,102,0.5)] backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
        <Link to="/" aria-label="Home" className="transition-transform duration-200 hover:scale-[1.02]">
          <Logo className="[&_img]:h-12 [&_img]:max-w-[220px]" />
        </Link>
        <nav aria-label="Primary" className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {navItems.map((n) =>
            <li key={n.to}>
                <NavLink
                to={n.to}
                end={n.to === '/'}
                className={({ isActive }) =>
                twMerge(
                  'rounded-xl px-3 py-2 text-sm font-semibold transition-colors duration-200',
                  isActive ? 'bg-brand-50 text-brand-700' : 'text-muted hover:bg-canvas hover:text-ink'
                )
                }>
                
                  {n.label}
                </NavLink>
              </li>
            )}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/login" className={buttonClasses('primary', 'md', 'hidden sm:inline-flex')}>
            Login
          </Link>
          <button
            onClick={() => setOpen((o) => !o)}
            className="rounded-xl border border-line bg-white p-2 text-ink shadow-sm hover:bg-canvas xl:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}>
            
            {open ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open &&
        <motion.nav
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
          className="border-t border-line bg-white/95 px-5 pb-5 pt-3 shadow-pop backdrop-blur-xl xl:hidden"
          aria-label="Mobile">
          
            <ul>
              {navItems.map((n) =>
            <li key={n.to}>
                  <NavLink
                to={n.to}
                end={n.to === '/'}
                className={({ isActive }) =>
                twMerge('block rounded-xl px-3 py-3 text-[15px] font-semibold', isActive ? 'bg-brand-50 text-brand-700' : 'text-ink hover:bg-canvas')
                }>
                
                    {n.label}
                  </NavLink>
                </li>
            )}
            </ul>
            <div className="mt-4">
              <Link to="/login" className={buttonClasses('primary', 'lg', 'w-full')}>
                Login
              </Link>
            </div>
          </motion.nav>
        }
      </AnimatePresence>
    </header>);

}
