import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { Toaster } from 'sonner';
import { DemoDataProvider } from './contexts/DemoDataContext';
import { PublicLayout } from './components/public/PublicLayout';
import { DealerLayout } from './components/dealer/DealerLayout';
import { AdminLayout } from './components/admin/AdminLayout';
import { Home } from './pages/public/Home';
import { HowItWorks } from './pages/public/HowItWorks';
import { Features } from './pages/public/Features';
import { FinanceSolutions } from './pages/public/FinanceSolutions';
import { ForDealers } from './pages/public/ForDealers';
import { About } from './pages/public/About';
import { Contact } from './pages/public/Contact';
import { PrivacyPolicy } from './pages/public/PrivacyPolicy';
import { Terms } from './pages/public/Terms';
import { DealerLogin } from './pages/public/DealerLogin';
import { DealerRegister } from './pages/public/DealerRegister';
import { DealerDashboard } from './pages/dealer/DealerDashboard';
import { DealerOnboarding } from './pages/dealer/DealerOnboarding';
import { DealerProfile } from './pages/dealer/DealerProfile';
import { DealerSettings } from './pages/dealer/DealerSettings';
import { DealerCustomers } from './pages/dealer/DealerCustomers';
import { DealerCustomerDetail } from './pages/dealer/DealerCustomerDetail';
import { DealerApplications } from './pages/dealer/DealerApplications';
import { NewApplication } from './pages/dealer/NewApplication';
import { DealerApplicationDetail } from './pages/dealer/DealerApplicationDetail';
import { DealerFinancePartners } from './pages/dealer/DealerFinancePartners';
import { DealerNotifications } from './pages/dealer/DealerNotifications';
import { DealerSupport } from './pages/dealer/DealerSupport';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminDealers } from './pages/admin/AdminDealers';
import { AdminDealerDetail } from './pages/admin/AdminDealerDetail';
import { AdminCustomers } from './pages/admin/AdminCustomers';
import { AdminApplications } from './pages/admin/AdminApplications';
import { AdminApplicationDetail } from './pages/admin/AdminApplicationDetail';
import { ManualProcessing } from './pages/admin/ManualProcessing';
import { AdminFinancePartners } from './pages/admin/AdminFinancePartners';
import { CommissionSettings } from './pages/admin/CommissionSettings';
import { Reports } from './pages/admin/Reports';
import { AdminNotifications } from './pages/admin/AdminNotifications';
import { AdminSupport } from './pages/admin/AdminSupport';
import { AdminAccount } from './pages/admin/AdminAccount';
import { SuperAdminUsers } from './pages/superAdmin/SuperAdminUsers';
import { AuditLogs } from './pages/admin/AuditLogs';
import { SuperAdminSettings } from './pages/superAdmin/SuperAdminSettings';
import { ResetPassword } from './pages/public/ResetPassword';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { SuperAdminLayout } from './components/superAdmin/SuperAdminLayout';
import { PermissionRoute } from './components/auth/PermissionRoute';

interface AppProps {
  /** Shows the dealer portal as a brand-new dealer with no customers or applications. */
  newDealerEmptyState?: boolean;
}

export function App({ newDealerEmptyState = false }: AppProps) {
  return (
    <MotionConfig reducedMotion="user">
      <DemoDataProvider emptyDealer={newDealerEmptyState}>
        <BrowserRouter>
          <AuthProvider>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/features" element={<Features />} />
              <Route path="/finance-solutions" element={<FinanceSolutions />} />
              <Route path="/for-dealers" element={<ForDealers />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<Terms />} />
            </Route>
            <Route path="/login" element={<DealerLogin />} />
            <Route path="/dealer-login" element={<Navigate to="/login" replace />} />
            <Route path="/dealer-register" element={<DealerRegister />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route element={<ProtectedRoute role="dealer" />}>
              <Route path="/dealer" element={<DealerLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<DealerDashboard />} />
              <Route path="onboarding" element={<DealerOnboarding />} />
              <Route path="profile" element={<DealerProfile />} />
              <Route path="settings" element={<DealerSettings />} />
              <Route path="customers" element={<DealerCustomers />} />
              <Route path="customers/:id" element={<DealerCustomerDetail />} />
              <Route path="applications" element={<DealerApplications />} />
              <Route path="applications/new" element={<NewApplication />} />
              <Route path="applications/:id" element={<DealerApplicationDetail />} />
              <Route path="finance-partners" element={<DealerFinancePartners />} />
              <Route path="notifications" element={<DealerNotifications />} />
              <Route path="support" element={<DealerSupport />} />
              </Route>
            </Route>

            <Route path="/admin/login" element={<Navigate to="/login" replace />} />
            <Route element={<ProtectedRoute roles={['admin', 'super_admin']} />}>
              <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route element={<PermissionRoute permission="dashboard" />}><Route path="dashboard" element={<AdminDashboard />} /></Route>
              <Route element={<PermissionRoute permission="dealers" />}><Route path="dealers" element={<AdminDealers />} /><Route path="dealers/:id" element={<AdminDealerDetail />} /></Route>
              <Route element={<PermissionRoute permission="customers" />}><Route path="customers" element={<AdminCustomers />} /></Route>
              <Route element={<PermissionRoute permission="applications" />}><Route path="applications" element={<AdminApplications />} /><Route path="applications/:id" element={<AdminApplicationDetail />} /></Route>
              <Route element={<PermissionRoute permission="manual_processing" />}><Route path="manual-processing" element={<ManualProcessing />} /></Route>
              <Route element={<PermissionRoute permission="finance_partners" />}><Route path="finance-partners" element={<AdminFinancePartners />} /></Route>
              <Route element={<PermissionRoute permission="commissions" />}><Route path="commission-settings" element={<CommissionSettings />} /></Route>
              <Route element={<PermissionRoute permission="reports" />}><Route path="reports" element={<Reports />} /></Route>
              <Route element={<PermissionRoute permission="notifications" />}><Route path="notifications" element={<AdminNotifications />} /></Route>
              <Route element={<PermissionRoute permission="support" />}><Route path="support" element={<AdminSupport />} /></Route>
              <Route path="account" element={<AdminAccount />} />
              <Route element={<PermissionRoute permission="audit_logs" />}><Route path="audit-logs" element={<AuditLogs />} /></Route>
              </Route>
            </Route>

            <Route element={<ProtectedRoute role="super_admin" />}>
              <Route path="/super-admin" element={<SuperAdminLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="dealers" element={<AdminDealers />} />
                <Route path="dealers/:id" element={<AdminDealerDetail />} />
                <Route path="customers" element={<AdminCustomers />} />
                <Route path="applications" element={<AdminApplications />} />
                <Route path="applications/:id" element={<AdminApplicationDetail />} />
                <Route path="manual-processing" element={<ManualProcessing />} />
                <Route path="finance-partners" element={<AdminFinancePartners />} />
                <Route path="commission-settings" element={<CommissionSettings />} />
                <Route path="reports" element={<Reports />} />
                <Route path="notifications" element={<AdminNotifications />} />
                <Route path="support" element={<AdminSupport />} />
                <Route path="audit-logs" element={<AuditLogs />} />
                <Route path="users" element={<SuperAdminUsers />} />
                <Route path="settings" element={<SuperAdminSettings />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </AuthProvider>
        </BrowserRouter>
        <Toaster position="top-right" toastOptions={{ style: { fontFamily: 'Inter, sans-serif', fontSize: 13, borderRadius: 10, border: '1px solid #E4EAF2' } }} />
      </DemoDataProvider>
    </MotionConfig>);

}
