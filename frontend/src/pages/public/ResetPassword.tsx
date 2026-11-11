import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2Icon } from 'lucide-react';
import { Logo } from '../../components/ui/Logo';
import { TextField } from '../../components/ui/TextField';
import { Button } from '../../components/ui/Button';
import { ApiError, resetPassword } from '../../services/auth';

export function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string; form?: string }>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const next: typeof errors = {};
    if (!token) next.form = 'This reset link is invalid';
    if (password.length < 8 || !/\d/.test(password)) next.password = 'Use at least 8 characters including a number';
    if (confirm !== password) next.confirmPassword = 'Passwords do not match';
    setErrors(next);
    if (Object.keys(next).length) return;
    setLoading(true);
    try { await resetPassword(token, password, confirm); setDone(true); }
    catch (error) { setErrors(error instanceof ApiError ? { ...error.errors, form: error.message } : { form: 'Unable to reset password' }); }
    finally { setLoading(false); }
  };

  return <div className="flex min-h-screen items-center justify-center bg-canvas px-5">
    <div className="w-full max-w-md rounded-2xl border border-line bg-white p-8 shadow-card">
      <Link to="/"><Logo /></Link>
      {done ? <div className="mt-8 text-center"><CheckCircle2Icon className="mx-auto h-12 w-12 text-success" /><h1 className="mt-4 font-display text-2xl font-bold text-navy">Password reset</h1><p className="mt-2 text-sm text-muted">Your password has been updated and all previous sessions were signed out.</p><Link to="/login" className="mt-6 inline-block font-medium text-brand hover:underline">Go to login</Link></div> : <>
        <h1 className="mt-8 font-display text-2xl font-bold text-navy">Create a new password</h1>
        <p className="mt-2 text-sm text-muted">Use at least 8 characters including a number.</p>
        {errors.form && <p className="mt-4 rounded-lg bg-danger-50 p-3 text-sm text-danger-700">{errors.form}</p>}
        <form onSubmit={submit} className="mt-6 space-y-4">
          <TextField label="New password" required type="password" value={password} onChange={setPassword} error={errors.password} autoComplete="new-password" />
          <TextField label="Confirm password" required type="password" value={confirm} onChange={setConfirm} error={errors.confirmPassword} autoComplete="new-password" />
          <Button type="submit" className="w-full" loading={loading}>Reset password</Button>
        </form>
      </>}
    </div>
  </div>;
}
