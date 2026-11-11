import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircleIcon, CheckCircle2Icon, EyeIcon, EyeOffIcon } from 'lucide-react';
import { AuthShowcase } from '../../components/auth/AuthShowcase';
import { Field, inputClass } from '../../components/ui/Field';
import { TextField } from '../../components/ui/TextField';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Logo } from '../../components/ui/Logo';
import { ApiError, forgotPassword, login } from '../../services/auth';
import { patterns } from '../../utils/validation';

type Status = 'idle' | 'loading' | 'error' | 'success';

export function DealerLogin() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<{identifier?: string;password?: string;}>({});
  const [status, setStatus] = useState<Status>('idle');
  const [forgotOpen, setForgotOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetState, setResetState] = useState<'idle' | 'loading' | 'sent'>('idle');
  const [resetError, setResetError] = useState('');
  const [destination, setDestination] = useState<'dealer' | 'admin' | 'super_admin'>('dealer');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!identifier.trim()) next.identifier = 'Enter your registered email address';else
    if (!patterns.email.test(identifier)) next.identifier = 'Enter a valid email address';
    if (!password) next.password = 'Enter your password';else
    if (password.length < 6) next.password = 'Password must be at least 6 characters';
    setErrors(next);
    if (Object.keys(next).length) return;
    setStatus('loading');
    try {
      const user = await login(identifier, password);
      setDestination(user.role);
      setStatus('success');
      window.setTimeout(() => navigate(user.role === 'dealer' ? '/dealer/dashboard' : user.role === 'super_admin' ? '/super-admin/dashboard' : '/admin/dashboard'), 600);
    } catch (error) {
      if (error instanceof ApiError && error.errors.email) setErrors({ identifier: error.errors.email });
      setStatus('error');
    }
  };

  const sendReset = async () => {
    if (!patterns.email.test(resetEmail)) {
      setResetError('Enter a valid email address');
      return;
    }
    setResetState('loading');
    try {
      await forgotPassword(resetEmail);
      setResetState('sent');
    } catch (error) {
      setResetState('idle');
      setResetError(error instanceof ApiError ? error.message : 'Unable to request a reset link');
    }
  };

  return (
    <div className="grid min-h-screen w-full bg-gradient-to-br from-white via-brand-50/30 to-canvas lg:grid-cols-[1.05fr_1fr]">
      <AuthShowcase
        headline="Your dealer finance operations, organized."
        body="Customers, applications, documents and lender updates — tracked in one workspace with the operations team." />
      
      <div className="relative flex flex-col px-5 py-8 sm:px-10">
        <div className="flex items-center justify-between lg:justify-end">
          <Link to="/" className="lg:hidden" aria-label="Home">
            <Logo />
          </Link>
          <p className="text-sm text-muted">
            New dealer?{' '}
            <Link to="/dealer-register" className="font-medium text-brand hover:underline">
              Register
            </Link>
          </p>
        </div>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">
          {status === 'success' ?
          <div className="text-center" role="status">
              <CheckCircle2Icon className="mx-auto h-12 w-12 text-success" />
              <h1 className="mt-4 font-display text-2xl font-bold text-navy">Signed in</h1>
              <p className="mt-2 text-sm text-muted">Opening your {destination} dashboard…</p>
            </div> :

          <div className="rounded-3xl border border-white/80 bg-white/90 p-7 shadow-pop backdrop-blur sm:p-9">
              <h1 className="font-display text-3xl font-extrabold tracking-tight text-navy">Sign in</h1>
              <p className="mt-2 text-sm text-muted">Access your dealer workspace or operations dashboard.</p>

              {status === 'error' &&
            <div className="mt-6 flex items-start gap-2.5 rounded-lg border border-danger/20 bg-danger-50 p-3 text-sm text-danger-700" role="alert">
                  <AlertCircleIcon className="mt-0.5 h-4 w-4 shrink-0" />
                  The email/mobile or password is incorrect. Check your details and try again.
                </div>
            }

              <form onSubmit={submit} noValidate className="mt-8 space-y-5">
                <TextField
                label="Email address"
                required
                value={identifier}
                onChange={(v) => {
                  setIdentifier(v);
                  setErrors((er) => ({ ...er, identifier: undefined }));
                }}
                error={errors.identifier}
                autoComplete="username"
                placeholder="name@business.com" />
              
                <Field label="Password" required error={errors.password} htmlFor="dl-pass">
                  <div className="relative">
                    <input
                    id="dl-pass"
                    type={show ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors((er) => ({ ...er, password: undefined }));
                    }}
                    autoComplete="current-password"
                    aria-invalid={!!errors.password}
                    className={inputClass(!!errors.password, 'pr-10')} />
                  
                    <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-muted hover:text-ink"
                    aria-label={show ? 'Hide password' : 'Show password'}>
                    
                      {show ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                    </button>
                  </div>
                </Field>
                <div className="flex justify-end">
                  <button type="button" onClick={() => setForgotOpen(true)} className="text-sm font-medium text-brand hover:underline">
                    Forgot password?
                  </button>
                </div>
                <Button type="submit" size="lg" className="w-full" loading={status === 'loading'}>
                  Log in
                </Button>
              </form>
              <p className="mt-6 rounded-lg bg-canvas p-3 text-xs leading-relaxed text-muted">Use your assigned dealer or operations credentials. Your account role determines which dashboard opens.</p>
            </div>
          }
        </div>
        <p className="text-center text-xs text-muted">Dealers and operations staff use the same secure sign-in.</p>
      </div>

      <Modal
        open={forgotOpen}
        onClose={() => {
          setForgotOpen(false);
          setResetState('idle');
          setResetEmail('');
          setResetError('');
        }}
        title="Reset your password"
        description="We’ll email a reset link to your registered address."
        size="sm"
        footer={
        resetState === 'sent' ?
        <Button onClick={() => setForgotOpen(false)}>Done</Button> :

        <>
              <Button variant="secondary" onClick={() => setForgotOpen(false)}>
                Cancel
              </Button>
              <Button onClick={sendReset} loading={resetState === 'loading'}>
                Send reset link
              </Button>
            </>

        }>
        
        {resetState === 'sent' ?
        <p className="text-sm text-muted">If an active account exists for {resetEmail}, a reset link has been sent.</p> :

        <TextField label="Registered email" required type="email" value={resetEmail} onChange={(v) => {setResetEmail(v);setResetError('');}} error={resetError} />
        }
      </Modal>
    </div>);

}
