import React from 'react';
import { TextField } from '../ui/TextField';
import { Field } from '../ui/Field';
import { SelectInput } from '../ui/SelectInput';
import { DemoNotice } from '../ui/DemoNotice';
import type { RegistrationStepProps } from '../../types/registration';

export function RegTaxStep({ data, errors, update }: RegistrationStepProps) {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="GSTIN" required uppercase maxLength={15} value={data.gstin} onChange={(v) => update('gstin', v.replace(/\s/g, ''))} error={errors.gstin} placeholder="27ABCDE1234F1Z5" hint="15-character GST identification number" />
        <TextField label="Business PAN" required uppercase maxLength={10} value={data.pan} onChange={(v) => update('pan', v.replace(/\s/g, ''))} error={errors.pan} placeholder="ABCDE1234F" hint="Must match characters 3–12 of the GSTIN" />
        <Field label="Expected monthly finance cases" required error={errors.monthlyFinanceVolume} hint="Helps the operations team plan onboarding support">
          <SelectInput options={['Fewer than 10', '10 – 25', '25 – 50', '50 – 100', 'More than 100']} placeholder="Select range" value={data.monthlyFinanceVolume} onChange={(e) => update('monthlyFinanceVolume', e.target.value)} invalid={!!errors.monthlyFinanceVolume} />
        </Field>
      </div>
      <DemoNotice>
        GSTIN and PAN are verified manually by the verification team in Phase 1. Automated GST, PAN or eKYC lookups are not connected and would require separately agreed third-party integrations.
      </DemoNotice>
    </div>);

}
