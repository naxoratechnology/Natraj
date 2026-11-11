import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, CopyIcon, RotateCcwIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Logo } from '../../components/ui/Logo';
import { Stepper } from '../../components/ui/Stepper';
import { Button, buttonClasses } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Timeline } from '../../components/ui/Timeline';
import { RegOwnerStep } from '../../components/registration/RegOwnerStep';
import { RegBusinessStep } from '../../components/registration/RegBusinessStep';
import { RegTaxStep } from '../../components/registration/RegTaxStep';
import { RegDocumentsStep } from '../../components/registration/RegDocumentsStep';
import { RegReviewStep } from '../../components/registration/RegReviewStep';
import { type RegistrationData, type RegistrationErrors } from '../../types/registration';
import { TODAY } from '../../utils/format';
import { patterns } from '../../utils/validation';

const STEPS = ['Owner & contact', 'Business details', 'GST & PAN', 'Documents', 'Review & submit'];
const DRAFT_KEY = 'dealerRegistrationDraft';
const STEP_INTRO = [
'Tell us who owns and operates the business. This person will be the primary account holder.',
'Registered business name, category and the address of your store or office.',
'Tax identifiers are checked against your uploaded certificates by the verification team.',
'Upload clear copies. You can re-upload any document if the verification team requests a correction.',
'Check your details, accept the dealer agreement and submit for verification.'];


const initial: RegistrationData = {
  ownerName: '', designation: '', mobile: '', email: '', password: '', confirmPassword: '',
  businessName: '', businessType: '', category: '', yearsInBusiness: '', address: '', city: '', state: '', pincode: '',
  gstin: '', pan: '', monthlyFinanceVolume: '', docs: {}, agreeTerms: false, agreeConsent: false
};

interface RegistrationDraft {
  step: number;
  data: RegistrationData;
}

function readDraft(): RegistrationDraft | null {
  try {
    const value = sessionStorage.getItem(DRAFT_KEY);
    if (!value) return null;
    const draft = JSON.parse(value) as RegistrationDraft;
    return {
      step: Math.min(Math.max(Number(draft.step) || 0, 0), STEPS.length - 1),
      data: { ...initial, ...draft.data, password: '', confirmPassword: '', docs: {} }
    };
  } catch {
    sessionStorage.removeItem(DRAFT_KEY);
    return null;
  }
}

function validate(step: number, data: RegistrationData): RegistrationErrors {
  const errors: RegistrationErrors = {};
  if (step === 0) {
    if (!data.ownerName.trim()) errors.ownerName = 'Owner name is required';
    if (!data.designation.trim()) errors.designation = 'Designation is required';
    if (!patterns.mobile.test(data.mobile)) errors.mobile = 'Enter a valid 10-digit mobile number';
    if (!patterns.email.test(data.email)) errors.email = 'Enter a valid email address';
    if (data.password.length < 8 || !/\d/.test(data.password)) errors.password = 'Use at least 8 characters including a number';
    if (data.confirmPassword !== data.password) errors.confirmPassword = 'Passwords do not match';
  }
  if (step === 1) {
    if (!data.businessName.trim()) errors.businessName = 'Business name is required';
    if (!data.businessType) errors.businessType = 'Business type is required';
    if (!data.category) errors.category = 'Primary category is required';
    if (!data.yearsInBusiness) errors.yearsInBusiness = 'Years in business is required';
    if (!data.address.trim()) errors.address = 'Business address is required';
    if (!data.city.trim()) errors.city = 'City is required';
    if (!data.state) errors.state = 'State is required';
    if (!patterns.pincode.test(data.pincode) || data.pincode.startsWith('0')) errors.pincode = 'Enter a valid 6-digit PIN code';
  }
  if (step === 2) {
    const gstin = data.gstin.toUpperCase();
    const pan = data.pan.toUpperCase();
    if (!patterns.gstin.test(gstin)) errors.gstin = 'Enter a valid GSTIN';
    if (!patterns.pan.test(pan)) errors.pan = 'Enter a valid PAN';
    else if (patterns.gstin.test(gstin) && gstin.slice(2, 12) !== pan) errors.pan = 'PAN must match the PAN embedded in GSTIN';
    if (!data.monthlyFinanceVolume) errors.monthlyFinanceVolume = 'Select expected monthly finance cases';
  }
  // Step 3 intentionally has no required document validation.
  if (step === 4) {
    if (!data.agreeTerms) errors.agreeTerms = 'Accept the Dealer Terms & Conditions';
    if (!data.agreeConsent) errors.agreeConsent = 'Confirm the dealer consent statement';
  }
  return errors;
}

export function DealerRegister() {
  const [draft] = useState(readDraft);
  const [step, setStep] = useState(draft?.step ?? 0);
  const [data, setData] = useState<RegistrationData>(draft?.data ?? initial);
  const [errors, setErrors] = useState<RegistrationErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);

  useEffect(() => {
    const { password: _password, confirmPassword: _confirmPassword, ...safeData } = data;
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify({
      step,
      data: { ...safeData, password: '', confirmPassword: '', docs: {} }
    }));
  }, [data, step]);

  const resetForm = () => {
    if (!window.confirm('Reset this registration form and clear all saved progress?')) return;
    sessionStorage.removeItem(DRAFT_KEY);
    setData(initial);
    setStep(0);
    setErrors({});
    setReference(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const update = <K extends keyof RegistrationData,>(key: K, value: RegistrationData[K]) => {
    setData((d) => ({ ...d, [key]: value }));
    setErrors((e) => {
      if (key === 'docs') return Object.fromEntries(Object.entries(e).filter(([k]) => !k.startsWith('doc-')));
      const { [key as string]: _removed, ...rest } = e;
      return rest;
    });
  };

  const next = () => {
    const nextErrors = validate(step, data);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      window.scrollTo({ top: 0 });
      return;
    }
    setSubmitting(true);
    window.setTimeout(() => {
      const suffix = typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID().slice(0, 8).toUpperCase()
        : Date.now().toString(36).slice(-8).toUpperCase();
      sessionStorage.removeItem(DRAFT_KEY);
      setReference(`DLR-${String(new Date().getFullYear()).slice(-2)}-${suffix}`);
      setSubmitting(false);
    }, 500);
  };

  const stepProps = { data, errors, update };
  const body = useMemo(() => {
    switch (step) {
      case 0:return <RegOwnerStep {...stepProps} />;
      case 1:return <RegBusinessStep {...stepProps} />;
      case 2:return <RegTaxStep {...stepProps} />;
      case 3:return <RegDocumentsStep {...stepProps} />;
      default:return <RegReviewStep {...stepProps} goTo={setStep} />;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, data, errors]);

  return (
    <div className="min-h-screen w-full bg-canvas">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-8">
          <Link to="/" aria-label="Home">
            <Logo className="[&_img]:h-8 [&_img]:max-w-[155px] sm:[&_img]:h-10 sm:[&_img]:max-w-[190px]" />
          </Link>
          <p className="shrink-0 text-sm text-muted">
            <span className="hidden sm:inline">Already registered? </span>
            <Link to="/dealer-login" className="font-medium text-brand hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-3 py-5 pb-10 sm:px-8 sm:py-10">
        {reference ?
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
          className="mx-auto max-w-2xl rounded-xl border border-line bg-white p-5 shadow-card sm:rounded-2xl sm:p-10">
          
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-success-50 text-success">
              <CheckIcon className="h-6 w-6" strokeWidth={2.5} />
            </span>
            <h1 className="mt-5 font-display text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">Registration submitted</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Thank you, {data.ownerName.split(' ')[0] || 'there'}. The verification team will review {data.businessName || 'your business'} and contact you at {data.email || 'your registered email'} if anything else is needed.
            </p>
            <div className="mt-6 grid gap-4 rounded-xl bg-canvas p-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-muted">Application reference</p>
                <div className="mt-1 flex items-center gap-2">
                  <p className="num font-display text-lg font-bold text-navy">{reference}</p>
                  <button
                  onClick={() => {
                    navigator.clipboard?.writeText(reference);
                    toast.success('Reference copied');
                  }}
                  className="rounded p-1 text-muted hover:bg-white hover:text-ink"
                  aria-label="Copy reference">
                  
                    <CopyIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted">Current status</p>
                <div className="mt-1.5">
                  <StatusBadge status="Submitted" />
                </div>
              </div>
            </div>
            <div className="mt-8">
              <h2 className="mb-4 text-sm font-semibold text-ink">What happens next</h2>
              <Timeline
              events={[
              { label: 'Registration submitted', date: TODAY.toISOString(), state: 'done' },
              { label: 'Verification review', note: 'Documents are checked by the verification team. Corrections may be requested.', state: 'current' },
              { label: 'Agreement acceptance', state: 'upcoming' },
              { label: 'Dealer account activated', state: 'upcoming' }]
              } />
            
            </div>
            <div className="mt-8 flex flex-col gap-2 sm:flex-row">
              <Link to="/dealer-login" className={buttonClasses('primary', 'lg', 'w-full sm:w-auto')}>
                Go to dealer login
              </Link>
              <Link to="/" className={buttonClasses('secondary', 'lg', 'w-full sm:w-auto')}>
                Back to website
              </Link>
            </div>
          </motion.div> :

        <>
            <div className="mb-5 px-1 sm:mb-8 sm:px-0">
              <h1 className="font-display text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">Become a dealer</h1>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted sm:mt-2 sm:text-sm">Takes about 10 minutes. Your progress is kept while you move between steps.</p>
            </div>
            <div className="rounded-xl border border-line bg-white shadow-card sm:rounded-2xl">
              <div className="border-b border-line px-4 py-4 sm:px-8 sm:py-5">
                <Stepper steps={STEPS} current={step} onStepClick={setStep} />
              </div>
              <div className="px-4 py-5 [&_input]:text-base [&_select]:text-base sm:px-8 sm:py-7 sm:[&_input]:text-sm sm:[&_select]:text-sm">
                <h2 className="font-display text-[17px] font-bold text-navy sm:text-lg">{STEPS[step]}</h2>
                <p className="mb-5 mt-1 text-[13px] leading-relaxed text-muted sm:mb-6 sm:text-sm">{STEP_INTRO[step]}</p>
                <AnimatePresence mode="wait">
                  <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}>
                  
                    {body}
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="sticky bottom-0 z-20 flex flex-col gap-2 border-t border-line bg-white/95 px-4 py-3 backdrop-blur sm:static sm:flex-row sm:justify-between sm:px-8 sm:py-4">
                <Button className={`order-2 w-full sm:order-1 sm:w-auto ${step === 0 ? 'hidden sm:inline-flex' : ''}`} variant="secondary" disabled={step === 0} onClick={() => setStep(step - 1)} icon={<ArrowLeftIcon className="h-4 w-4" />}>
                  Back
                </Button>
                <div className="order-1 grid grid-cols-2 gap-2 sm:order-2 sm:flex sm:items-center">
                  <Button className="w-full sm:w-auto" variant="ghost" onClick={resetForm} disabled={submitting} icon={<RotateCcwIcon className="h-4 w-4" />}>
                    Reset form
                  </Button>
                  <Button className="w-full sm:w-auto" onClick={next} loading={submitting}>
                    {step === STEPS.length - 1 ? 'Submit registration' : 'Continue'}
                    {step < STEPS.length - 1 && <ArrowRightIcon className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </>
        }
      </main>
    </div>);

}
