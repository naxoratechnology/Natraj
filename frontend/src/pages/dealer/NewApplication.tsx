import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, CreditCardIcon, FileCheckIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { toast } from 'sonner';
import { PageHeader } from '../../components/ui/PageHeader';
import { Stepper } from '../../components/ui/Stepper';
import { Button, buttonClasses } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Timeline } from '../../components/ui/Timeline';
import { CustomerStep } from '../../components/newApplication/CustomerStep';
import { ProductStep } from '../../components/newApplication/ProductStep';
import { PartnerStep } from '../../components/newApplication/PartnerStep';
import { DocumentsStep } from '../../components/newApplication/DocumentsStep';
import { ReviewStep } from '../../components/newApplication/ReviewStep';
import { CalculationSummary } from '../../components/newApplication/CalculationSummary';
import { useDemoData } from '../../contexts/DemoDataContext';
import { CURRENT_DEALER_ID, currentDealerUser } from '../../data/session';
import { TODAY, formatINR } from '../../utils/format';
import { draftAmounts, requiredDocsFor, type ApplicationDraft, type DraftErrors } from '../../types/newApplication';
import type { FinanceApplication, FinanceType } from '../../types/finance';

const STEPS = ['Customer', 'Finance type', 'Product & amount', 'Finance partner', 'Documents', 'Review & submit'];

const financeTypes: {value: FinanceType;title: string;body: string;icon: typeof CreditCardIcon;}[] = [
{ value: 'New Loan', title: 'New loan', body: 'A fresh loan application for this purchase, evaluated by the partner. Requires down payment and tenure.', icon: FileCheckIcon },
{ value: 'Existing Finance / Card Limit', title: 'Existing finance / card limit', body: 'The customer uses an already-sanctioned finance or card limit. Limit confirmation comes from the partner.', icon: CreditCardIcon }];


export function NewApplication() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { dealerCustomers, partners, addApplication } = useDemoData();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<ApplicationDraft>({
    customerId: params.get('customer') ?? '', financeType: '', category: '', product: '', productPrice: '', downPayment: '', tenure: '', partnerId: '', docs: {}, consent: false
  });
  const [errors, setErrors] = useState<DraftErrors>({});
  const [submitting, setSubmitting] = useState<'submit' | 'draft' | null>(null);
  const [created, setCreated] = useState<FinanceApplication | null>(null);

  const customer = dealerCustomers.find((c) => c.id === draft.customerId);
  const partner = partners.find((p) => p.id === draft.partnerId);
  const kycVerified = customer?.kycStatus === 'Verified';

  const update = <K extends keyof ApplicationDraft,>(key: K, value: ApplicationDraft[K]) => {
    setDraft((d) => {
      const next = { ...d, [key]: value };
      if (key === 'financeType' || key === 'category') next.partnerId = '';
      if (key === 'financeType' && value === 'Existing Finance / Card Limit') {
        next.downPayment = next.downPayment || '0';
        next.tenure = '';
      }
      return next;
    });
    setErrors((e) => key === 'docs' ? Object.fromEntries(Object.entries(e).filter(([k]) => !k.startsWith('doc-'))) : { ...e, [key]: undefined });
  };

  const validate = (s: number): DraftErrors => {
    const e: DraftErrors = {};
    const { price, down, amount } = draftAmounts(draft);
    if (s === 0 && !draft.customerId) e.customerId = 'Select a customer or add a new one';
    if (s === 1 && !draft.financeType) e.financeType = 'Choose a finance type';
    if (s === 2) {
      if (!draft.category) e.category = 'Select a category';
      if (draft.product.trim().length < 3) e.product = 'Enter the product name or model';
      if (price < 1000) e.productPrice = 'Enter a product price of at least ₹1,000';
      if (draft.financeType === 'New Loan' && draft.downPayment === '') e.downPayment = 'Enter the down payment (₹0 if none)';
      if (down >= price && price > 0) e.downPayment = 'Down payment must be less than the product price';
      if (amount > 0 && amount < 5000) e.productPrice = 'Finance amount must be at least ₹5,000';
      if (draft.financeType === 'New Loan' && !draft.tenure) e.tenure = 'Select a tenure';
    }
    if (s === 3 && !draft.partnerId) e.partnerId = 'Select a finance partner';
    if (s === 4) requiredDocsFor(draft.financeType, kycVerified).filter((d) => d.required && !draft.docs[d.id]).forEach((d) => e[`doc-${d.id}`] = `${d.label} is required`);
    if (s === 5 && !draft.consent) e.consent = 'Confirm customer consent to submit';
    return e;
  };

  const build = (status: FinanceApplication['status']): FinanceApplication => {
    const { price, down, amount } = draftAmounts(draft);
    return {
      id: `FA-26-${Math.floor(10500 + Math.random() * 400)}`,
      dealerId: CURRENT_DEALER_ID,
      dealerName: currentDealerUser.business,
      customerId: customer?.id ?? '',
      customerName: customer?.name ?? 'Unnamed customer',
      category: draft.category || 'Electronics',
      product: draft.product || 'Product not specified',
      financeType: draft.financeType || 'New Loan',
      partnerId: partner?.id ?? '',
      partnerName: partner?.name ?? 'Not selected',
      productPrice: price,
      downPayment: down,
      amount,
      tenureMonths: draft.financeType === 'New Loan' && draft.tenure ? Number(draft.tenure) : undefined,
      status,
      createdAt: TODAY.toISOString(),
      updatedAt: TODAY.toISOString(),
      nextAction: status === 'Draft' ? 'Dealer to complete and submit' : 'Review documents and assign'
    };
  };

  const next = () => {
    const e = validate(step);
    setErrors(e);
    if (Object.keys(e).length) return;
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      window.scrollTo({ top: 0 });
      return;
    }
    setSubmitting('submit');
    window.setTimeout(() => {
      const app = build('Pending');
      addApplication(app);
      setCreated(app);
      setSubmitting(null);
    }, 1000);
  };

  const saveDraft = () => {
    if (!draft.customerId) {
      setErrors({ customerId: 'Select a customer before saving a draft' });
      setStep(0);
      return;
    }
    setSubmitting('draft');
    window.setTimeout(() => {
      const app = build('Draft');
      addApplication(app);
      setSubmitting(null);
      toast.success(`Draft ${app.id} saved`);
      navigate(`/dealer/applications/${app.id}`);
    }, 600);
  };

  if (created) {
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }} className="mx-auto max-w-2xl rounded-2xl border border-line bg-white p-6 shadow-card sm:p-10">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-success-50 text-success">
          <CheckIcon className="h-6 w-6" strokeWidth={2.5} />
        </span>
        <h1 className="mt-5 font-display text-2xl font-extrabold tracking-tight text-navy">Application submitted</h1>
        <p className="mt-2 text-sm text-muted">
          {created.customerName}’s application for {formatINR(created.amount)} has been sent to the operations team for review before it is shared with {created.partnerName}.
        </p>
        <div className="mt-6 grid gap-4 rounded-xl bg-canvas p-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-muted">Application ID (demo)</p>
            <p className="num mt-1 font-display text-lg font-bold text-navy">{created.id}</p>
          </div>
          <div>
            <p className="text-xs text-muted">Current status</p>
            <div className="mt-1.5">
              <StatusBadge status="Pending" />
            </div>
          </div>
        </div>
        <div className="mt-8">
          <Timeline
            events={[
            { label: 'Submitted for review', date: created.createdAt, actor: currentDealerUser.name, state: 'done' },
            { label: 'Operations document check', note: 'You will be notified if any correction is needed.', state: 'current' },
            { label: 'Shared with lender (manual)', state: 'upcoming' },
            { label: 'Lender decision recorded', state: 'upcoming' }]
            } />
          
        </div>
        <div className="mt-8 flex flex-col gap-2 sm:flex-row">
          <Link to={`/dealer/applications/${created.id}`} className={buttonClasses('primary')}>
            View application
          </Link>
          <button
            onClick={() => {
              setCreated(null);
              setStep(0);
              setErrors({});
              setDraft({ customerId: '', financeType: '', category: '', product: '', productPrice: '', downPayment: '', tenure: '', partnerId: '', docs: {}, consent: false });
            }}
            className={buttonClasses('secondary')}>
            
            Create another
          </button>
          <Link to="/dealer/dashboard" className={buttonClasses('ghost')}>
            Back to dashboard
          </Link>
        </div>
        <p className="mt-6 text-xs text-muted">Prototype — nothing has been sent to any lender.</p>
      </motion.div>);

  }

  return (
    <div>
      <PageHeader
        breadcrumbs={[{ label: 'Finance Applications', to: '/dealer/applications' }, { label: 'New application' }]}
        title="Create finance application"
        actions={
        <Button variant="secondary" onClick={saveDraft} loading={submitting === 'draft'}>
            Save as draft
          </Button>
        } />
      
      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="rounded-xl border border-line bg-white shadow-card">
          <div className="border-b border-line px-5 py-5 sm:px-6">
            <Stepper steps={STEPS} current={step} onStepClick={setStep} />
          </div>
          <div className="px-5 py-6 sm:px-6">
            <h2 className="mb-5 font-display text-lg font-bold text-navy">{STEPS[step]}</h2>
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}>
                {step === 0 && <CustomerStep draft={draft} errors={errors} update={update} />}
                {step === 1 &&
                <div>
                    <div className="grid gap-3 md:grid-cols-2" role="radiogroup" aria-label="Finance type">
                      {financeTypes.map((f) => {
                      const on = draft.financeType === f.value;
                      return (
                        <button key={f.value} role="radio" aria-checked={on} onClick={() => update('financeType', f.value)} className={twMerge('rounded-xl border p-5 text-left transition-colors duration-150', on ? 'border-brand bg-brand-50/50 ring-1 ring-brand' : 'border-line hover:border-[#CED7E3]')}>
                            <f.icon className={twMerge('h-5 w-5', on ? 'text-brand' : 'text-navy')} />
                            <p className="mt-4 text-[15px] font-semibold text-ink">{f.title}</p>
                            <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{f.body}</p>
                          </button>);

                    })}
                    </div>
                    {errors.financeType && <p className="mt-3 text-xs text-danger-700">{errors.financeType}</p>}
                  </div>
                }
                {step === 2 && <ProductStep draft={draft} errors={errors} update={update} />}
                {step === 3 && <PartnerStep draft={draft} errors={errors} update={update} />}
                {step === 4 && <DocumentsStep draft={draft} errors={errors} update={update} kycVerified={kycVerified} />}
                {step === 5 && <ReviewStep draft={draft} errors={errors} update={update} customer={customer} partner={partner} goTo={setStep} />}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex flex-col-reverse gap-2 border-t border-line px-5 py-4 sm:flex-row sm:justify-between sm:px-6">
            <Button variant="secondary" disabled={step === 0} onClick={() => setStep(step - 1)} icon={<ArrowLeftIcon className="h-4 w-4" />}>
              Back
            </Button>
            <Button onClick={next} loading={submitting === 'submit'}>
              {step === STEPS.length - 1 ? 'Submit application' : 'Continue'}
              {step < STEPS.length - 1 && <ArrowRightIcon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <CalculationSummary draft={draft} customer={customer} partner={partner} />
      </div>
    </div>);

}