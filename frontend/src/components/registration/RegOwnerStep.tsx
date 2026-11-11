import { TextField } from '../ui/TextField';
import type { RegistrationStepProps } from '../../types/registration';

export function RegOwnerStep({ data, errors, update }: RegistrationStepProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <TextField label="Owner full name" required value={data.ownerName} onChange={(v) => update('ownerName', v)} error={errors.ownerName} autoComplete="name" placeholder="As per PAN" />
      <TextField label="Designation" required value={data.designation} onChange={(v) => update('designation', v)} error={errors.designation} placeholder="Proprietor, Partner, Director" />
      <TextField label="Mobile number" required prefix="+91" inputMode="numeric" maxLength={10} value={data.mobile} onChange={(v) => update('mobile', v.replace(/\D/g, '').slice(0, 10))} error={errors.mobile} autoComplete="tel-national" placeholder="10-digit mobile number" />
      <TextField label="Email address" required type="email" value={data.email} onChange={(v) => update('email', v)} error={errors.email} autoComplete="email" placeholder="name@business.com" />
      <TextField label="Create password" required type="password" showPasswordToggle value={data.password} onChange={(v) => update('password', v)} error={errors.password} autoComplete="new-password" hint="At least 8 characters with a number" />
      <TextField label="Confirm password" required type="password" showPasswordToggle value={data.confirmPassword} onChange={(v) => update('confirmPassword', v)} error={errors.confirmPassword} autoComplete="new-password" />
    </div>);

}
