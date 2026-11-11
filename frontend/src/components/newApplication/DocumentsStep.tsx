import React from 'react';
import { CheckCircle2Icon } from 'lucide-react';
import { FileUploader } from '../ui/FileUploader';
import { DemoNotice } from '../ui/DemoNotice';
import { requiredDocsFor, type DraftStepProps } from '../../types/newApplication';

export function DocumentsStep({ draft, errors, update, kycVerified }: DraftStepProps & {kycVerified: boolean;}) {
  const docs = requiredDocsFor(draft.financeType, kycVerified);
  return (
    <div className="space-y-5">
      {draft.financeType === 'Existing Finance / Card Limit' &&
      <DemoNotice tone="warning">Never upload or type card numbers, PINs, CVVs or OTPs. A limit reference letter or partner reference ID is sufficient.</DemoNotice>
      }
      <div className="grid gap-5 sm:grid-cols-2">
        {docs.map((d) =>
        d.onFile ?
        <div key={d.id}>
              <p className="mb-1.5 text-[13px] font-medium text-ink">{d.label}</p>
              <div className="flex items-center gap-3 rounded-lg border border-line bg-canvas p-3">
                <CheckCircle2Icon className="h-5 w-5 text-success" />
                <div>
                  <p className="text-sm font-medium text-ink">Using verified KYC document on file</p>
                  <p className="text-xs text-muted">From the customer’s record</p>
                </div>
              </div>
            </div> :

        <FileUploader
          key={d.id}
          label={d.label}
          required={d.required}
          value={draft.docs[d.id] ?? null}
          error={errors[`doc-${d.id}`]}
          onChange={(f) => update('docs', { ...draft.docs, [d.id]: f })} />


        )}
      </div>
    </div>);

}