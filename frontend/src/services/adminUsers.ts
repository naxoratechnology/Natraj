import { authenticatedRequest } from './auth';

export interface AccessRole { id: string; name: string; description: string; permissions: string[]; active: boolean; assignedUsers: number; createdAt: string; updatedAt: string; }
export interface AdminAccount { id: string; name: string; email: string; role: 'admin'; active: boolean; permissions: string[]; accessRole: { id: string; name: string } | null; createdAt: string; updatedAt: string; }
export const listAdminAccounts = () => authenticatedRequest<{ users: AdminAccount[] }>('/super-admin/admins');
export const createAdminAccount = (body: { name: string; email: string; password: string; permissions: string[] }) => authenticatedRequest<{ user: AdminAccount; message: string }>('/super-admin/admins', { method: 'POST', body: JSON.stringify(body) });
export const setAdminAccountStatus = (id: string, active: boolean) => authenticatedRequest<{ user: AdminAccount; message: string }>(`/super-admin/admins/${id}/status`, { method: 'PATCH', body: JSON.stringify({ active }) });
export const assignAdminRole = (id: string, roleId: string) => authenticatedRequest<{ user: AdminAccount; message: string }>(`/super-admin/admins/${id}/role`, { method: 'PATCH', body: JSON.stringify({ roleId }) });
export const updateAdminAccountPermissions = (id: string, permissions: string[]) => authenticatedRequest<{ user: AdminAccount; message: string }>(`/super-admin/admins/${id}/permissions`, { method: 'PATCH', body: JSON.stringify({ permissions }) });
export const listAccessRoles = () => authenticatedRequest<{ roles: AccessRole[]; permissions: string[] }>('/super-admin/roles');
export const createAccessRole = (body: { name: string; description: string; permissions: string[] }) => authenticatedRequest<{ role: AccessRole; message: string }>('/super-admin/roles', { method: 'POST', body: JSON.stringify(body) });
export const updateAccessRole = (id: string, body: { name: string; description: string; permissions: string[] }) => authenticatedRequest<{ role: AccessRole; message: string }>(`/super-admin/roles/${id}`, { method: 'PUT', body: JSON.stringify(body) });
export const setAccessRoleStatus = (id: string, active: boolean) => authenticatedRequest<{ role: AccessRole; message: string }>(`/super-admin/roles/${id}/status`, { method: 'PATCH', body: JSON.stringify({ active }) });
