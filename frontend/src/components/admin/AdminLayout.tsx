import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheckIcon, BarChart3Icon, BellIcon, BuildingIcon, ChevronDownIcon, CogIcon, FileTextIcon, GaugeIcon, HandshakeIcon, LifeBuoyIcon, ListChecksIcon, LogOutIcon, MenuIcon, PanelLeftCloseIcon, PanelLeftOpenIcon, PercentIcon, ScrollTextIcon, ShieldIcon, UserIcon, UsersIcon, XIcon, BoxIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { Logo } from "../ui/Logo";
import { Dropdown } from "../ui/Dropdown";
import { SearchInput } from "../ui/SearchInput";
import { useDemoData } from "../../contexts/DemoDataContext";
import { initials } from "../../utils/format";
import { logout } from '../../services/auth';
import { useAuth } from '../../contexts/AuthContext';
interface NavItem {
  label: string;
  to: string;
  icon: BoxIcon;
  match: (path: string, search: string) => boolean;
  count?: 'verification' | 'queue' | 'notifications';
  superAdminOnly?: boolean;
  permission?: string;
}
const groups: {
  title: string;
  items: NavItem[];
}[] = [{
  title: 'Operations',
  items: [{
    label: 'Overview',
    to: '/admin/dashboard',
    icon: GaugeIcon,
    permission: 'dashboard',
    match: (p) => p.startsWith('/admin/dashboard')
  }, {
    label: 'Dealers',
    to: '/admin/dealers',
    icon: BuildingIcon,
    permission: 'dealers',
    match: (p, s) => p.startsWith('/admin/dealers') && !s.includes('view=verification')
  }, {
    label: 'Dealer Verification',
    to: '/admin/dealers?view=verification',
    icon: BadgeCheckIcon,
    permission: 'dealers',
    match: (p, s) => p === '/admin/dealers' && s.includes('view=verification'),
    count: 'verification'
  }, {
    label: 'Customers',
    to: '/admin/customers',
    icon: UsersIcon,
    permission: 'customers',
    match: (p) => p.startsWith('/admin/customers')
  }, {
    label: 'Finance Applications',
    to: '/admin/applications',
    icon: FileTextIcon,
    permission: 'applications',
    match: (p) => p.startsWith('/admin/applications')
  }, {
    label: 'Manual Processing Queue',
    to: '/admin/manual-processing',
    icon: ListChecksIcon,
    permission: 'manual_processing',
    match: (p) => p.startsWith('/admin/manual-processing'),
    count: 'queue'
  }]
}, {
  title: 'Configuration',
  items: [{
    label: 'Finance Partners',
    to: '/admin/finance-partners',
    icon: HandshakeIcon,
    permission: 'finance_partners',
    match: (p) => p.startsWith('/admin/finance-partners')
  }, {
    label: 'Commission & Payouts',
    to: '/admin/commission-settings',
    icon: PercentIcon,
    permission: 'commissions',
    match: (p) => p.startsWith('/admin/commission-settings')
  }]
}, {
  title: 'Insights & support',
  items: [{
    label: 'Reports',
    to: '/admin/reports',
    icon: BarChart3Icon,
    permission: 'reports',
    match: (p) => p.startsWith('/admin/reports')
  }, {
    label: 'Notifications',
    to: '/admin/notifications',
    icon: BellIcon,
    permission: 'notifications',
    match: (p) => p.startsWith('/admin/notifications'),
    count: 'notifications'
  }, {
    label: 'Support Tickets',
    to: '/admin/support',
    icon: LifeBuoyIcon,
    permission: 'support',
    match: (p) => p.startsWith('/admin/support')
  }]
}, {
  title: 'Administration',
  items: [{
    label: 'Admin Users & Roles',
    to: '/super-admin/users',
    icon: ShieldIcon,
    superAdminOnly: true,
    match: (p) => p.startsWith('/super-admin/users')
  }, {
    label: 'Audit Logs',
    to: '/admin/audit-logs',
    icon: ScrollTextIcon,
    permission: 'audit_logs',
    match: (p) => p.startsWith('/admin/audit-logs')
  }, {
    label: 'System Settings',
    to: '/super-admin/settings',
    icon: CogIcon,
    superAdminOnly: true,
    match: (p) => p.startsWith('/super-admin/settings')
  }]
}];
export function AdminLayout() {
  const { user } = useAuth();
  const adminUser = { name: user?.name || 'Administrator', email: user?.email || '', role: user?.role === 'super_admin' ? 'Super Admin' : user?.accessRoleName || 'Operations Admin' };
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [q, setQ] = useState('');
  const {
    pathname,
    search
  } = useLocation();
  const navigate = useNavigate();
  const {
    dealers,
    applications,
    notifications
  } = useDemoData();
  const counts = {
    verification: dealers.filter((d) => ['Submitted', 'Under Review', 'Documents Required', 'Agreement Pending'].includes(d.status)).length,
    queue: applications.filter((a) => ['Pending', 'Processing', 'Awaiting Lender', 'Disbursement Pending'].includes(a.status)).length,
    notifications: notifications.admin.filter((n) => !n.read).length
  };
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname, search]);
  const runSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const term = q.trim().toUpperCase();
    if (!term) return;
    const app = applications.find((a) => a.id.toUpperCase().includes(term));
    if (term.startsWith('FA') && app) return navigate(`/admin/applications/${app.id}`);
    const dealer = dealers.find((d) => d.id.toUpperCase() === term || d.businessName.toUpperCase().includes(term));
    if (dealer) return navigate(`/admin/dealers/${dealer.id}`);
    navigate(`/admin/applications?q=${encodeURIComponent(q.trim())}`);
  };
  const sidebar = (isCollapsed: boolean) => <div className="flex h-full flex-col">
      <div className={twMerge('flex h-14 items-center border-b border-white/10', isCollapsed ? 'justify-center' : 'gap-2 px-4')}>
        <Link to="/admin/dashboard" aria-label="Admin overview">
          <Logo variant="light" compact={isCollapsed} />
        </Link>
        {!isCollapsed && <span className="ml-auto rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#A9B6C9]">Ops</span>}
      </div>
      <nav className="flex-1 overflow-y-auto px-2.5 py-3" aria-label="Admin navigation">
        {groups.map((g) => <div key={g.title} className="mb-4">
            {!isCollapsed && <p className="px-2.5 pb-1.5 text-[11px] font-medium text-[#7F90A8]">{g.title}</p>}
            <ul className="space-y-0.5">
              {g.items.filter((item) => (!item.superAdminOnly || user?.role === 'super_admin') && (user?.role === 'super_admin' || !item.permission || user?.permissions?.includes(item.permission))).map((item) => {
            const active = item.match(pathname, search);
            const count = item.count ? counts[item.count] : 0;
            return <li key={item.label}>
                    <Link to={item.to} title={isCollapsed ? item.label : undefined} aria-current={active ? 'page' : undefined} className={twMerge('relative flex items-center gap-2.5 rounded-md py-[7px] text-[13px] font-medium transition-colors duration-150', isCollapsed ? 'justify-center px-2' : 'px-2.5', active ? 'bg-white/[0.09] text-white' : 'text-[#B2BFD1] hover:bg-white/[0.05] hover:text-white')}>
                      {active && <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-teal" />}
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                      {!isCollapsed && count > 0 && <span className="num ml-auto rounded bg-white/10 px-1.5 text-[11px] leading-5 text-white">{count}</span>}
                    </Link>
                  </li>;
          })}
            </ul>
          </div>)}
      </nav>
      <div className="border-t border-white/10 p-2.5">
        <button onClick={() => void logout().finally(() => navigate('/login'))} className={twMerge('flex w-full items-center gap-2.5 rounded-md py-2 text-[13px] font-medium text-[#B2BFD1] hover:bg-white/[0.05] hover:text-white', isCollapsed ? 'justify-center' : 'px-2.5')}>
          <LogOutIcon className="h-4 w-4" /> {!isCollapsed && 'Sign out'}
        </button>
      </div>
    </div>;
  return <div className="flex min-h-screen w-full bg-gradient-to-br from-canvas via-white to-brand-50/40">
      <aside className={twMerge('sticky top-0 hidden h-screen shrink-0 bg-gradient-to-b from-navy-900 via-navy to-navy-700 shadow-xl transition-[width] duration-200 ease-out lg:block', collapsed ? 'w-16' : 'w-60')}>
        {sidebar(collapsed)}
      </aside>
      <AnimatePresence>
        {mobileOpen && <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div className="absolute inset-0 bg-navy-900/50" initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} exit={{
          opacity: 0
        }} transition={{
          duration: 0.2
        }} onClick={() => setMobileOpen(false)} />
            <motion.aside className="absolute inset-y-0 left-0 w-64 bg-navy" initial={{
          x: '-100%'
        }} animate={{
          x: 0
        }} exit={{
          x: '-100%'
        }} transition={{
          duration: 0.25,
          ease: [0.23, 1, 0.32, 1]
        }}>
              <button onClick={() => setMobileOpen(false)} className="absolute right-2 top-3 rounded-md p-1.5 text-[#B2BFD1] hover:bg-white/10" aria-label="Close navigation">
                <XIcon className="h-5 w-5" />
              </button>
              {sidebar(false)}
            </motion.aside>
          </div>}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/80 bg-white/80 px-4 shadow-[0_8px_30px_-26px_rgba(8,43,102,0.45)] backdrop-blur-xl sm:px-5">
          <button onClick={() => setMobileOpen(true)} className="rounded-md p-1.5 text-muted hover:bg-canvas lg:hidden" aria-label="Open navigation">
            <MenuIcon className="h-5 w-5" />
          </button>
          <button onClick={() => setCollapsed((c) => !c)} className="hidden rounded-md p-1.5 text-muted hover:bg-canvas hover:text-ink lg:block" aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
            {collapsed ? <PanelLeftOpenIcon className="h-[18px] w-[18px]" /> : <PanelLeftCloseIcon className="h-[18px] w-[18px]" />}
          </button>
          <form onSubmit={runSearch} className="w-full max-w-md">
            <SearchInput value={q} onChange={setQ} placeholder="Search application ID, dealer or customer" />
          </form>
          <span className="hidden shrink-0 items-center gap-1.5 rounded-md border border-warning/30 bg-warning-50 px-2 py-1 text-[11px] font-medium text-warning-700 xl:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-warning" /> Phase 1 · Manual lender processing
          </span>
          <div className="ml-auto flex items-center gap-1.5">
            {(user?.role === 'super_admin' || user?.permissions?.includes('notifications')) && <Link to="/admin/notifications" className="relative rounded-md p-2 text-muted hover:bg-canvas hover:text-ink" aria-label={`Notifications, ${counts.notifications} unread`}>
              <BellIcon className="h-[18px] w-[18px]" />
              {counts.notifications > 0 && <span className="num absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-danger px-1 text-[10px] font-semibold text-white">{counts.notifications}</span>}
            </Link>}
            <Dropdown header={<div>
                  <p className="text-sm font-semibold text-ink">{adminUser.name}</p>
                  <p className="text-xs text-muted">{adminUser.email}</p>
                  <p className="mt-1.5 inline-flex rounded bg-navy px-1.5 py-0.5 text-[11px] font-medium text-white">{adminUser.role}</p>
                </div>} items={[{
            label: 'My account',
            icon: UserIcon,
            onClick: () => navigate('/admin/account')
          }, {
            label: 'Sign out',
            icon: LogOutIcon,
            onClick: () => void logout().finally(() => navigate('/login')),
            danger: true
          }]} trigger={({
            toggle,
            open
          }) => <button onClick={toggle} aria-expanded={open} className="flex items-center gap-2 rounded-md p-1 pr-1.5 hover:bg-canvas">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-navy text-[11px] font-semibold text-white">{initials(adminUser.name)}</span>
                  <span className="hidden text-left md:block">
                    <span className="block text-[13px] font-medium leading-tight text-ink">{adminUser.name}</span>
                    <span className="block text-[11px] leading-tight text-muted">{adminUser.role}</span>
                  </span>
                  <ChevronDownIcon className="hidden h-3.5 w-3.5 text-muted md:block" />
                </button>} />
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>;
}
