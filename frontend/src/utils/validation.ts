export const patterns = {
  mobile: /^[6-9]\d{9}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
  gstin: /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/,
  pan: /^[A-Z]{5}\d{4}[A-Z]$/,
  pincode: /^\d{6}$/
};

export function isEmailOrMobile(v: string): boolean {
  const t = v.trim().replace(/\s+/g, '');
  return patterns.email.test(t) || patterns.mobile.test(t.replace(/^\+?91/, ''));
}

export function required(value: string, label: string): string | undefined {
  return value.trim() ? undefined : `${label} is required`;
}