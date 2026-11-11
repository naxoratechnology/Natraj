import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircleIcon, EyeIcon, EyeOffIcon, ShieldIcon } from 'lucide-react';
import { Logo } from '../../components/ui/Logo';
import { Field, inputClass } from '../../components/ui/Field';
import { TextField } from '../../components/ui/TextField';
import { Button } from '../../components/ui/Button';
import { patterns } from '../../utils/validation';

export function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<{email?: string;password?: string;}>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!patterns.email.test(email)) next.email = 'Enter your work email address';
    if (password.length < 6) next.password = 'Enter your password';
    setErrors(next);
    if (Object.keys(next).length) return;
    setStatus('loading');
    window.setTimeout(() => {
      if (password.toLowerCase() === 'wrongpass') return setStatus('error');
      navigate('/admin/dashboard');
    }, 900);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-navy-900 px-5 py-10">
      <svg className="pointer-events-none absolute inset-0 h-full w-full text-white/[0.035]" aria-hidden>
        <defs>
          <pattern id="adm-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#adm-grid)" />
      </svg>
      <div className="relative w-full max-w-[400px]">
        <div className="mb-8 flex items-center justify-between">
          <Logo variant="light" />
          <span className="rounded-md border border-white/15 px-2 py-1 text-[11px] font-medium uppercase tracking-wider text-[#A9B6C9]">Operations</span>
        </div>
        <div className="rounded-xl bg-white p-7 shadow-pop">
          <h1 className="font-display text-xl font-bold text-navy">Admin & operations sign in</h1>
          <p className="mt-1 text-sm text-muted">Authorized staff only. Access is role-controlled.</p>
          {status === 'error' &&
          <div className="mt-5 flex items-start gap-2 rounded-lg bg-danger-50 p-3 text-sm text-danger-700" role="alert">
              <AlertCircleIcon className="mt-0.5 h-4 w-4 shrink-0" /> Invalid credentials. Repeated failures will lock this account.
            </div>
          }
          <form onSubmit={submit} noValidate className="mt-6 space-y-4">
            <TextField label="Work email" required type="email" value={email} onChange={(v) => {setEmail(v);setErrors((x) => ({ ...x, email: undefined }));}} error={errors.email} autoComplete="username" placeholder="name@company.com" />
            <Field label="Password" required error={errors.password} htmlFor="adm-pass">
              <div className="relative">
                <input id="adm-pass" type={show ? 'text' : 'password'} value={password} onChange={(e) => {setPassword(e.target.value);setErrors((x) => ({ ...x, password: undefined }));}} autoComplete="current-password" className={inputClass(!!errors.password, 'pr-10')} />
                <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-muted hover:text-ink" aria-label={show ? 'Hide password' : 'Show password'}>
                  {show ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </button>
              </div>
            </Field>
            <Button type="submit" variant="navy" size="lg" className="w-full" loading={status === 'loading'}>
              Sign in
            </Button>
          </form>
          <div className="mt-6 flex items-start gap-2 border-t border-line pt-4 text-xs leading-relaxed text-muted">
            <ShieldIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Sign-ins and actions are recorded in the audit log. Prototype: any valid email and password works; “wrongpass” shows the error state.
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-[#8696AD]">
          Are you a dealer?{' '}
          <Link to="/dealer-login" className="font-medium text-white hover:underline">
            Dealer login
          </Link>
        </p>
      </div>
    </div>);

}