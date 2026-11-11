import { authenticatedRequest } from './auth';
import type { BackendDealer } from './dealers';

export interface AdminDashboardData {
  metrics: { totalDealers: number; activeDealers: number; pendingVerification: number; documentsRequired: number; suspendedDealers: number; rejectedDealers: number; totalCustomers: number; totalApplications: number };
  statusDistribution: Record<string, number>;
  documentDistribution: Record<string, number>;
  trend: Array<{ month: string; registrations: number; activated: number }>;
  pendingDealers: BackendDealer[];
  recentDealers: BackendDealer[];
  generatedAt: string;
}

export interface DealerDashboardData {
  dealer: BackendDealer;
  metrics: { totalCustomers: number; totalApplications: number; pendingApplications: number; approvedApplications: number; disbursedApplications: number };
  applicationDistribution: Record<string, number>;
  documentDistribution: Record<string, number>;
  recentApplications: [];
  generatedAt: string;
}

export const getAdminDashboard = () => authenticatedRequest<AdminDashboardData>('/dashboard/admin');
export const getDealerDashboard = () => authenticatedRequest<DealerDashboardData>('/dashboard/dealer');
