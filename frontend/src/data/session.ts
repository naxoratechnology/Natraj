import type { AuthUser } from '../services/auth';

function authenticatedUser(): AuthUser | null {
  try {
    const value = sessionStorage.getItem('authUser');
    return value ? JSON.parse(value) as AuthUser : null;
  } catch {
    return null;
  }
}

const user = authenticatedUser();

export const CURRENT_DEALER_ID = 'D-1024';

export const currentDealerUser = {
  name: user?.role === 'dealer' ? user.name : 'Rajesh Agarwal',
  email: user?.role === 'dealer' ? user.email : 'dealer@natrajmobile.example',
  business: 'Shree Ganesh Electronics & EV',
  dealerCode: 'D-1024',
  city: 'Pune, Maharashtra'
};

export const currentAdminUser = {
  name: user && ['admin', 'super_admin'].includes(user.role) ? user.name : 'Natraj Administrator',
  email: user && ['admin', 'super_admin'].includes(user.role) ? user.email : 'admin@natrajmobile.example',
  role: user?.role === 'super_admin' ? 'Super Admin' : 'Operations Admin'
};
