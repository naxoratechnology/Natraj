import React, { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BellIcon, ChevronDownIcon, ClipboardCheckIcon, FileTextIcon, HandshakeIcon, LayoutDashboardIcon, LifeBuoyIcon,
  LogOutIcon, MenuIcon, PanelLeftCloseIcon, PanelLeftOpenIcon, PlusIcon, SettingsIcon, UserIcon, UsersIcon, XIcon } from
'lucide-react';
import { twMerge } from 'tailwind-merge';
import { Logo } from '../ui/Logo';
import { Dropdown } from '../ui/Dropdown';
import { buttonClasses } from '../ui/Button';
import { SearchInput } from '../ui/SearchInput';
import { useDemoData } from '../../contexts/DemoDataContext';
import { currentDealerUser } from '../../data/session';
import { initials } from '../../utils/format';
import { logout } from '../../services/auth';

const nav = [
{ label: 'Dashboard', to: '/dealer/dashboard', icon: LayoutDashboardIcon },
{ label: 'Onboarding', to: '/dealer/onboarding', icon: ClipboardCheckIcon },
{ label: 'Customers', to: '/dealer/customers', icon: UsersIcon },
{ label: 'Finance Applications', to: '/dealer/applications', icon: FileTextIcon },
{ label: 'Finance Partners', to: '/dealer/finance-partners', icon: HandshakeIcon },
{ label: 'Notifications', to: '/dealer/notifications', icon: BellIcon, badge: true },
{ label: 'Support', to: '/dealer/support', icon: LifeBuoyIcon },
{ label: 'Profile & Settings', to: '/dealer/profile', icon: UserIcon, alsoActive: '/dealer/settings' }];


export function DealerLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [q, setQ] = useState('');
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { notifications } = useDemoData();
  const unread = notifications.dealer.filter((n) => !n.read).length;

  useEffect(() => {
    setMobileOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  const sidebar = (isCollapsed: boolean) =>
  <div className="flex h-full flex-col">
      <div className={twMerge('flex h-16 items-center border-b border-line', isCollapsed ? 'justify-center px-2' : 'px-5')}>
        <Link to="/dealer/dashboard" aria-label="Dealer dashboard">
          <Logo compact={isCollapsed} />
        </Link>
      </div>
      {!isCollapsed &&
    <div className="mx-3 mt-4 rounded-lg border border-line bg-canvas px-3 py-2.5">
          <p className="truncate text-[13px] font-semibold text-ink">{currentDealerUser.business}</p>
          <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-success" /> Active · {currentDealerUser.dealerCode}
          </p>
        </div>
    }
      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Dealer navigation">
        <ul className="space-y-0.5">
          {nav.map((item) => {
          const active = pathname.startsWith(item.to) || item.alsoActive && pathname.startsWith(item.alsoActive);
          return (
            <li key={item.to}>
                <NavLink
                to={item.to}
                title={isCollapsed ? item.label : undefined}
                className={twMerge(
                  'relative flex items-center gap-3 rounded-lg py-2 text-sm font-medium transition-colors duration-150',
                  isCollapsed ? 'justify-center px-2' : 'px-3',
                  active ? 'bg-gradient-to-r from-brand-50 to-brand-100/60 text-brand-700 shadow-sm' : 'text-muted hover:bg-canvas hover:text-ink'
                )}>
                
                  <item.icon className="h-[18px] w-[18px] shrink-0" />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                  {item.badge && unread > 0 &&
                <span
                  className={twMerge(
                    'num rounded bg-brand px-1.5 text-[11px] font-semibold leading-5 text-white',
                    isCollapsed ? 'absolute right-1 top-1 px-1 text-[10px] leading-4' : 'ml-auto'
                  )}>
                  
                      {unread}
                    </span>
                }
                </NavLink>
              </li>);

        })}
        </ul>
      </nav>
      <div className="border-t border-line p-3">
        <button
        onClick={() => void logout().finally(() => navigate('/login'))}
        title={isCollapsed ? 'Logout' : undefined}
        className={twMerge(
          'flex w-full items-center gap-3 rounded-lg py-2 text-sm font-medium text-muted transition-colors duration-150 hover:bg-danger-50 hover:text-danger-700',
          isCollapsed ? 'justify-center px-2' : 'px-3'
        )}>
        
          <LogOutIcon className="h-[18px] w-[18px]" />
          {!isCollapsed && 'Logout'}
        </button>
      </div>
    </div>;


  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-canvas via-white to-brand-50/40">
      <aside
        className={twMerge(
          'sticky top-0 hidden h-screen shrink-0 border-r border-line/80 bg-white/90 shadow-[8px_0_30px_-28px_rgba(8,43,102,0.5)] backdrop-blur-xl transition-[width] duration-200 ease-out lg:block',
          collapsed ? 'w-[72px]' : 'w-64'
        )}>
        
        {sidebar(collapsed)}
      </aside>

      <AnimatePresence>
        {mobileOpen &&
        <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div className="absolute inset-0 bg-navy/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={() => setMobileOpen(false)} />
            <motion.aside
            className="absolute inset-y-0 left-0 w-72 bg-white shadow-pop"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}>
            
              <button onClick={() => setMobileOpen(false)} className="absolute right-3 top-4 rounded-md p-1.5 text-muted hover:bg-canvas" aria-label="Close navigation">
                <XIcon className="h-5 w-5" />
              </button>
              {sidebar(false)}
            </motion.aside>
          </div>
        }
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/80 bg-white/80 px-4 shadow-[0_8px_30px_-26px_rgba(8,43,102,0.45)] backdrop-blur-xl sm:px-6">
          <button onClick={() => setMobileOpen(true)} className="rounded-md p-2 text-muted hover:bg-canvas lg:hidden" aria-label="Open navigation">
            <MenuIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="hidden rounded-md p-2 text-muted hover:bg-canvas hover:text-ink lg:block"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
            
            {collapsed ? <PanelLeftOpenIcon className="h-5 w-5" /> : <PanelLeftCloseIcon className="h-5 w-5" />}
          </button>
          <form
            className="hidden w-full max-w-sm md:block"
            onSubmit={(e) => {
              e.preventDefault();
              navigate(`/dealer/applications?q=${encodeURIComponent(q)}`);
            }}>
            
            <SearchInput value={q} onChange={setQ} placeholder="Search your applications or customers" />
          </form>
          <div className="ml-auto flex items-center gap-2">
            <Link to="/dealer/applications/new" className={buttonClasses('primary', 'sm', 'hidden sm:inline-flex')}>
              <PlusIcon className="h-4 w-4" /> New application
            </Link>
            <Link to="/dealer/notifications" className="relative rounded-md p-2 text-muted hover:bg-canvas hover:text-ink" aria-label={`Notifications, ${unread} unread`}>
              <BellIcon className="h-5 w-5" />
              {unread > 0 && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger ring-2 ring-white" />}
            </Link>
            <Dropdown
              header={
              <div>
                  <p className="text-sm font-semibold text-ink">{currentDealerUser.name}</p>
                  <p className="text-xs text-muted">{currentDealerUser.email}</p>
                </div>
              }
              items={[
              { label: 'Profile', icon: UserIcon, onClick: () => navigate('/dealer/profile') },
              { label: 'Settings', icon: SettingsIcon, onClick: () => navigate('/dealer/settings') },
              { label: 'Logout', icon: LogOutIcon, onClick: () => void logout().finally(() => navigate('/login')), danger: true }]
              }
              trigger={({ toggle, open }) =>
              <button onClick={toggle} aria-expanded={open} className="flex items-center gap-2 rounded-lg p-1 pr-2 hover:bg-canvas">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-xs font-semibold text-white">{initials(currentDealerUser.name)}</span>
                  <span className="hidden text-left sm:block">
                    <span className="block text-[13px] font-medium leading-tight text-ink">{currentDealerUser.name}</span>
                    <span className="block text-[11px] leading-tight text-muted">Dealer owner</span>
                  </span>
                  <ChevronDownIcon className="hidden h-4 w-4 text-muted sm:block" />
                </button>
              } />
            
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>);

}
