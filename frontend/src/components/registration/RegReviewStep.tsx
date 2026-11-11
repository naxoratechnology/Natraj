import React from 'react';
import { Link } from 'react-router-dom';
import { PencilIcon } from 'lucide-react';
import { registrationDocuments, type RegistrationStepProps } from '../../types/registration';

interface ReviewProps extends RegistrationStepProps {
  goTo: (step: number) => void;
}

function Row({ label, value }: {label: string;value: string;}) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5 py-2 text-sm min-[400px]:flex-row min-[400px]:justify-between min-[400px]:gap-4">
      <dt className="shrink-0 text-muted">{label}</dt>
      <dd className="min-w-0 break-words font-medium text-ink min-[400px]:text-right">{value || '—'}</dd>
    </div>);

}

function Block({ title, step, goTo, children }: {title: string;step: number;goTo: (s: number) => void;children: React.ReactNode;}) {
  return (
    <section className="rounded-xl border border-line p-3.5 sm:p-4">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink">{title}</h3>
        <button onClick={() => goTo(step)} className="inline-flex items-center gap-1 text-xs font-medium text-brand hover:underline">
          <PencilIcon className="h-3 w-3" /> Edit
        </button>
      </div>
      <dl className="divide-y divide-line">{children}</dl>
    </section>);

}

export function RegReviewStep({ data, errors, update, goTo }: ReviewProps) {
  const uploaded = registrationDocuments.filter((d) => data.docs[d.id]).length;
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <Block title="Owner & contact" step={0} goTo={goTo}>
          <Row label="Owner" value={data.ownerName} />
          <Row label="Mobile" value={data.mobile ? `+91 ${data.mobile}` : ''} />
          <Row label="Email" value={data.email} />
        </Block>
        <Block title="Business" step={1} goTo={goTo}>
          <Row label="Business name" value={data.businessName} />
          <Row label="Type · Category" value={[data.businessType, data.category].filter(Boolean).join(' · ')} />
          <Row label="Location" value={[data.city, data.state, data.pincode].filter(Boolean).join(', ')} />
        </Block>
        <Block title="Tax details" step={2} goTo={goTo}>
          <Row label="GSTIN" value={data.gstin} />
          <Row label="Business PAN" value={data.pan ? `${data.pan.slice(0, 2)}XXX${data.pan.slice(5)}` : ''} />
        </Block>
        <Block title="Documents" step={3} goTo={goTo}>
          <Row label="Attached" value={`${uploaded} of ${registrationDocuments.length}`} />
          <Row label="Storage" value="Private · verification staff only" />
        </Block>
      </div>

      <fieldset className="space-y-3 rounded-xl border border-line bg-canvas p-4">
        <legend className="sr-only">Agreements</legend>
        <label className="flex items-start gap-3 text-[13px] leading-relaxed text-ink sm:text-sm">
          <input type="checkbox" checked={data.agreeTerms} onChange={(e) => update('agreeTerms', e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 rounded border-line accent-brand sm:h-4 sm:w-4" />
          <span>
            I accept the{' '}
            <Link to="/terms" target="_blank" className="font-medium text-brand hover:underline">
              Dealer Terms & Conditions
            </Link>{' '}
            and{' '}
            <Link to="/privacy-policy" target="_blank" className="font-medium text-brand hover:underline">
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        {errors.agreeTerms && <p className="pl-7 text-xs text-danger-700">{errors.agreeTerms}</p>}
        <label className="flex items-start gap-3 text-[13px] leading-relaxed text-ink sm:text-sm">
          <input type="checkbox" checked={data.agreeConsent} onChange={(e) => update('agreeConsent', e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 rounded border-line accent-brand sm:h-4 sm:w-4" />
          <span>
            I understand the platform does not lend money or guarantee approvals, and that all credit decisions are made by the respective lender. I will obtain customer consent before submitting their information.
          </span>
        </label>
        {errors.agreeConsent && <p className="pl-7 text-xs text-danger-700">{errors.agreeConsent}</p>}
      </fieldset>
    </div>);

}
