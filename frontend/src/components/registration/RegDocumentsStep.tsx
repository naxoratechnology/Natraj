import React from 'react';
import { ShieldCheckIcon } from 'lucide-react';
import { FileUploader } from '../ui/FileUploader';
import { registrationDocuments, type RegistrationStepProps } from '../../types/registration';

export function RegDocumentsStep({ data, errors, update }: RegistrationStepProps) {
  return (
    <div>
      <div className="mb-5 flex items-start gap-2.5 rounded-lg bg-canvas p-3 text-[13px] text-muted">
        <ShieldCheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
        Documents are optional for now and can be provided later. Clear scans or photos of originals are preferred.
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        {registrationDocuments.map((d) =>
        <FileUploader
          key={d.id}
          label={d.label}
          required={d.required}
          value={data.docs[d.id] ?? null}
          error={errors[`doc-${d.id}`]}
          onChange={(f) => update('docs', { ...data.docs, [d.id]: f })} />

        )}
      </div>
    </div>);

}
