import type { RegistrationData, RegistrationErrors } from '../types/registration';

export type UserRole = 'dealer' | 'admin' | 'super_admin';
export interface AuthUser { id: string; name: string; email: string; role: UserRole; active: boolean; permissions: string[]; accessRoleName?: string }
interface ApiErrorBody { message?: string; errors?: RegistrationErrors }

export class ApiError extends Error {
  constructor(message: string, public errors: RegistrationErrors = {}, public status = 0) { super(message); }
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const notifyAuthChange = () => window.dispatchEvent(new Event('auth-changed'));
const saveSession = (token: string, user: AuthUser) => {
  sessionStorage.setItem('authToken', token);
  sessionStorage.setItem('authUser', JSON.stringify(user));
  notifyAuthChange();
};

export function clearSession() {
  sessionStorage.removeItem('authToken');
  sessionStorage.removeItem('authUser');
  notifyAuthChange();
}
export function getStoredUser(): AuthUser | null {
  try { const value = sessionStorage.getItem('authUser'); return value ? JSON.parse(value) as AuthUser : null; } catch { return null; }
}

async function rawRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, { ...options, credentials: 'include', headers: { ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }), ...options.headers } });
  const body = response.status === 204 ? {} : await response.json() as T & ApiErrorBody;
  if (!response.ok) throw new ApiError((body as ApiErrorBody).message || 'Request failed', (body as ApiErrorBody).errors, response.status);
  return body as T;
}

export async function refreshSession() {
  try {
    const result = await rawRequest<{ token: string; user: AuthUser }>('/auth/refresh', { method: 'POST' });
    saveSession(result.token, result.user);
    return result.user;
  } catch {
    clearSession();
    return null;
  }
}

export async function authenticatedRequest<T>(path: string, options: RequestInit = {}, retry = true): Promise<T> {
  const token = sessionStorage.getItem('authToken');
  try {
    return await rawRequest<T>(path, { ...options, headers: { ...options.headers, ...(token ? { Authorization: `Bearer ${token}` } : {}) } });
  } catch (error) {
    if (retry && error instanceof ApiError && error.status === 401 && await refreshSession()) return authenticatedRequest<T>(path, options, false);
    throw error;
  }
}

export async function login(email: string, password: string) {
  const result = await rawRequest<{ token: string; user: AuthUser }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  saveSession(result.token, result.user);
  return result.user;
}
export async function logout() {
  try { await rawRequest('/auth/logout', { method: 'POST' }); }
  finally { clearSession(); }
}
export async function register(data: RegistrationData) {
  const form = new FormData();
  const { docs, ...fields } = data;
  form.append('data', JSON.stringify({ ...fields, docs: {} }));
  Object.entries(docs).forEach(([documentType, document]) => {
    if (document?.file instanceof File) form.append(`doc_${documentType}`, document.file, document.name);
  });
  try {
    const response = await fetch(`${API_URL}/auth/register`, { method: 'POST', credentials: 'include', body: form });
    const body = await response.json() as { reference?: string; user?: AuthUser; message?: string; errors?: RegistrationErrors };
    if (!response.ok) throw new ApiError(body.message || 'Registration failed', body.errors, response.status);
    return body as { reference: string; user: AuthUser };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Unable to connect to the server. Please try again.');
  }
}
export const forgotPassword = (email: string) => rawRequest<{ message: string }>('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) });
export const resetPassword = (token: string, password: string, confirmPassword: string) => rawRequest<{ message: string }>('/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, password, confirmPassword }) });
export const changePassword = (currentPassword: string, newPassword: string, confirmPassword: string) => authenticatedRequest<{ message: string }>('/auth/change-password', { method: 'POST', body: JSON.stringify({ currentPassword, newPassword, confirmPassword }) });
