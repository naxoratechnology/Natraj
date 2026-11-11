import React from 'react';
import { TextField } from '../ui/TextField';
import { Field } from '../ui/Field';
import { SelectInput } from '../ui/SelectInput';
import type { RegistrationStepProps } from '../../types/registration';

const categories = ['EV dealership', 'Electronics retail', 'Furniture retail', 'Consumer durables retail', 'Multi-category retail'];
const types = ['Proprietorship', 'Partnership', 'LLP', 'Private Limited', 'Public Limited'];
const states = ['Andhra Pradesh', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal'];

export function RegBusinessStep({ data, errors, update }: RegistrationStepProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <TextField label="Registered business name" required value={data.businessName} onChange={(v) => update('businessName', v)} error={errors.businessName} className="sm:col-span-2" placeholder="As per GST registration" />
      <Field label="Business type" required error={errors.businessType}>
        <SelectInput options={types} placeholder="Select type" value={data.businessType} onChange={(e) => update('businessType', e.target.value)} invalid={!!errors.businessType} />
      </Field>
      <Field label="Primary category" required error={errors.category}>
        <SelectInput options={categories} placeholder="Select category" value={data.category} onChange={(e) => update('category', e.target.value)} invalid={!!errors.category} />
      </Field>
      <TextField label="Years in business" required inputMode="numeric" maxLength={2} value={data.yearsInBusiness} onChange={(v) => update('yearsInBusiness', v.replace(/\D/g, ''))} error={errors.yearsInBusiness} />
      <div className="hidden sm:block" />
      <TextField label="Shop / office address" required value={data.address} onChange={(v) => update('address', v)} error={errors.address} className="sm:col-span-2" placeholder="Building, street, area" />
      <TextField label="City" required value={data.city} onChange={(v) => update('city', v)} error={errors.city} />
      <Field label="State" required error={errors.state}>
        <SelectInput options={states} placeholder="Select state" value={data.state} onChange={(e) => update('state', e.target.value)} invalid={!!errors.state} />
      </Field>
      <TextField label="PIN code" required inputMode="numeric" maxLength={6} value={data.pincode} onChange={(v) => update('pincode', v.replace(/\D/g, ''))} error={errors.pincode} />
    </div>);

}
