import React, { useState } from 'react';
import { CheckCircle2Icon, MailIcon, MapPinIcon, PhoneIcon } from 'lucide-react';
import { PageIntro } from '../../components/public/PageIntro';
import { TextField } from '../../components/ui/TextField';
import { Field, inputClass } from '../../components/ui/Field';
import { SelectInput } from '../../components/ui/SelectInput';
import { Button } from '../../components/ui/Button';
import { brand } from '../../data/brand';
import { patterns } from '../../utils/validation';

const empty = { name: '', business: '', email: '', phone: '', topic: '', message: '' };

export function Contact() {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState<Partial<typeof empty>>({});
  const [state, setState] = useState<'idle' | 'loading' | 'sent'>('idle');

  const set = (k: keyof typeof empty, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Partial<typeof empty> = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (!patterns.email.test(form.email)) next.email = 'Enter a valid email address';
    if (form.phone && !patterns.mobile.test(form.phone)) next.phone = 'Enter a valid 10-digit mobile number';
    if (!form.topic) next.topic = 'Select a topic';
    if (form.message.trim().length < 20) next.message = 'Please share at least 20 characters';
    setErrors(next);
    if (Object.keys(next).length) return;
    setState('loading');
    window.setTimeout(() => setState('sent'), 900);
  };

  return (
    <>
      <PageIntro title="Contact us" description="Questions about dealer partnership, operations or the platform? Send a message and the team will respond by email." />
      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_1.5fr]">
          <div className="space-y-6">
            {[
            { icon: MailIcon, label: 'Partnerships', value: brand.salesEmail },
            { icon: MailIcon, label: 'Dealer support', value: brand.supportEmail },
            { icon: PhoneIcon, label: 'Phone', value: brand.phone },
            { icon: MapPinIcon, label: 'Office', value: brand.address }].
            map((c) =>
            <div key={c.label} className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-canvas text-navy">
                  <c.icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-navy">{c.label}</p>
                  <p className="text-sm text-muted">{c.value}</p>
                </div>
              </div>
            )}
            <p className="text-xs text-muted">Contact details are placeholders for the prototype.</p>
          </div>
          <div className="rounded-2xl border border-line p-6 sm:p-8">
            {state === 'sent' ?
            <div className="flex flex-col items-center py-12 text-center" role="status">
                <CheckCircle2Icon className="h-10 w-10 text-success" />
                <h2 className="mt-4 font-display text-xl font-bold text-navy">Message received</h2>
                <p className="mt-2 max-w-sm text-sm text-muted">This is a prototype — no message was actually sent. In production, the team would reply to {form.email}.</p>
                <Button variant="secondary" className="mt-6" onClick={() => {setForm(empty);setState('idle');}}>
                  Send another message
                </Button>
              </div> :

            <form onSubmit={submit} noValidate className="grid gap-5 sm:grid-cols-2">
                <TextField label="Your name" required value={form.name} onChange={(v) => set('name', v)} error={errors.name} autoComplete="name" />
                <TextField label="Business name" value={form.business} onChange={(v) => set('business', v)} />
                <TextField label="Email" required type="email" value={form.email} onChange={(v) => set('email', v)} error={errors.email} autoComplete="email" />
                <TextField label="Mobile" prefix="+91" inputMode="numeric" maxLength={10} value={form.phone} onChange={(v) => set('phone', v.replace(/\D/g, ''))} error={errors.phone} />
                <Field label="Topic" required error={errors.topic} className="sm:col-span-2">
                  <SelectInput options={['Dealer partnership', 'Finance partner enquiry', 'Platform demo', 'Existing dealer support', 'Other']} placeholder="Select a topic" value={form.topic} onChange={(e) => set('topic', e.target.value)} invalid={!!errors.topic} />
                </Field>
                <Field label="Message" required error={errors.message} className="sm:col-span-2" htmlFor="contact-msg">
                  <textarea id="contact-msg" rows={5} value={form.message} onChange={(e) => set('message', e.target.value)} className={inputClass(!!errors.message, 'h-auto resize-none py-2.5')} />
                </Field>
                <div className="sm:col-span-2">
                  <Button type="submit" size="lg" loading={state === 'loading'} className="w-full sm:w-auto">
                    Send message
                  </Button>
                </div>
              </form>
            }
          </div>
        </div>
      </section>
    </>);

}