import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BadgeCheckIcon, BarChart3Icon, BellIcon, BuildingIcon, CogIcon, FileTextIcon, GaugeIcon, HandshakeIcon, LifeBuoyIcon, ListChecksIcon, LogOutIcon, MenuIcon, PanelLeftCloseIcon, PanelLeftOpenIcon, PercentIcon, ScrollTextIcon, ShieldCheckIcon, UsersIcon, XIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { Logo } from '../ui/Logo';
import { useAuth } from '../../contexts/AuthContext';
import { logout } from '../../services/auth';
import { initials } from '../../utils/format';

const groups = [
  {
    title: 'Operations', items: [
      { label: 'Overview', to: '/super-admin/dashboard', icon: GaugeIcon },
      { label: 'Dealers', to: '/super-admin/dealers', icon: BuildingIcon },
      // { label: 'Dealer Verification', to: '/super-admin/dealers?view=verification', icon: BadgeCheckIcon },
      { label: 'Customers', to: '/super-admin/customers', icon: UsersIcon },
      { label: 'Finance Applications', to: '/super-admin/applications', icon: FileTextIcon },
      { label: 'Manual Processing Queue', to: '/super-admin/manual-processing', icon: ListChecksIcon }
    ]
  },
  {
    title: 'Configuration', items: [
      { label: 'Finance Partners', to: '/super-admin/finance-partners', icon: HandshakeIcon },
      { label: 'Commission & Payouts', to: '/super-admin/commission-settings', icon: PercentIcon }
    ]
  },
  {
    title: 'Insights & support', items: [
      { label: 'Reports', to: '/super-admin/reports', icon: BarChart3Icon },
      { label: 'Notifications', to: '/super-admin/notifications', icon: BellIcon },
      { label: 'Support Tickets', to: '/super-admin/support', icon: LifeBuoyIcon },
      { label: 'Audit Logs', to: '/super-admin/audit-logs', icon: ScrollTextIcon }
    ]
  },
  {
    title: 'Super administration', items: [
      { label: 'Admin Users & Roles', to: '/super-admin/users', icon: ShieldCheckIcon },
      { label: 'System Settings', to: '/super-admin/settings', icon: CogIcon }
    ]
  }
];

export function SuperAdminLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => setMobileOpen(false), [location.pathname, location.search]);
  const sidebar = (compact = false) => <div className="flex h-full flex-col">
    <div className={twMerge('flex h-16 items-center justify-center border-b border-white/10', compact ? 'justify-center' : 'gap-3 px-4')}><Link to="/super-admin/users"><Logo variant="light" compact={compact} /></Link></div>
    <nav className="flex-1 overflow-y-auto px-2.5 py-3" aria-label="Super Admin navigation">{groups.map((group) => <div key={group.title} className="mb-4">{!compact && <p className="px-2.5 pb-1.5 text-[11px] font-medium text-[#AFA0CE]">{group.title}</p>}<ul className="space-y-0.5">{group.items.map((item) => <li key={item.to}><NavLink to={item.to} title={compact ? item.label : undefined} className={({ isActive }) => twMerge('relative flex items-center gap-2.5 rounded-md py-[7px] text-[13px] font-medium transition-colors', compact ? 'justify-center px-2' : 'px-2.5', isActive ? 'bg-white/15 text-white' : 'text-[#D1C6E8] hover:bg-white/[0.08] hover:text-white')}><item.icon className="h-4 w-4 shrink-0" />{!compact && <span className="truncate">{item.label}</span>}</NavLink></li>)}</ul></div>)}</nav>
    <div className="border-t border-white/10 p-2.5"><button onClick={() => void logout().finally(() => navigate('/login'))} className={twMerge('flex w-full items-center gap-2.5 rounded-md py-2 text-[13px] font-medium text-[#D1C6E8] hover:bg-white/[0.08] hover:text-white', compact ? 'justify-center' : 'px-2.5')}><LogOutIcon className="h-4 w-4" />{!compact && 'Sign out'}</button></div>
  </div>;
  return <div className="flex min-h-screen bg-gradient-to-br from-[#F8F5FF] via-white to-[#FFF8E8] text-ink">
    <aside className={twMerge('sticky top-0 hidden h-screen shrink-0 bg-gradient-to-b from-[#241442] via-[#35205F] to-[#4B277A] shadow-xl transition-[width] lg:block', collapsed ? 'w-16' : 'w-60')}>{sidebar(collapsed)}</aside>
    {mobileOpen && <div className="fixed inset-0 z-50 lg:hidden"><button className="absolute inset-0 bg-[#1A0C32]/60" onClick={() => setMobileOpen(false)} aria-label="Close navigation" /><aside className="absolute inset-y-0 left-0 w-72 bg-gradient-to-b from-[#241442] via-[#35205F] to-[#4B277A] shadow-2xl"><button onClick={() => setMobileOpen(false)} className="absolute right-3 top-3 z-10 rounded p-1.5 text-white/70 hover:bg-white/10"><XIcon className="h-4 w-4" /></button>{sidebar(false)}</aside></div>}
    <div className="flex min-w-0 flex-1 flex-col"><header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-[#E8E0F3] bg-white/90 px-4 shadow-sm backdrop-blur sm:px-6"><button onClick={() => setMobileOpen(true)} className="rounded-md p-1.5 text-[#4B277A] hover:bg-[#F3EEFA] lg:hidden" aria-label="Open navigation"><MenuIcon className="h-5 w-5" /></button><button onClick={() => setCollapsed((value) => !value)} className="hidden rounded-md p-1.5 text-[#6E5B8D] hover:bg-[#F3EEFA] lg:block" aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>{collapsed ? <PanelLeftOpenIcon className="h-5 w-5" /> : <PanelLeftCloseIcon className="h-5 w-5" />}</button><span className="rounded-full border border-[#E7C96B]/50 bg-[#FFF8DC] px-3 py-1 text-xs font-semibold text-[#70550B]">Super Admin</span><div className="ml-auto flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E7C96B] text-xs font-bold text-[#29194F]">{initials(user?.name || 'SA')}</span><div className="hidden sm:block"><p className="max-w-44 truncate text-xs font-semibold text-[#29194F]">{user?.name}</p><p className="text-[10px] text-[#7B6B98]">Full platform access</p></div></div></header><main className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8"><Outlet /></main></div>
  </div>;
}
