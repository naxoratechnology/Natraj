import {
  BatteryChargingIcon,
  BuildingIcon,
  CreditCardIcon,
  HistoryIcon,
  KeyRoundIcon,
  LandmarkIcon,
  LayersIcon,
  LockIcon,
  MonitorSmartphoneIcon,
  RefrigeratorIcon,
  ScaleIcon,
  ShieldCheckIcon,
  SofaIcon,
  WalletIcon,
  FileCheckIcon,
  type LucideIcon } from
'lucide-react';

export const valueProps = [
{ title: 'Centralized finance operations', body: 'Customers, applications, documents and partner coordination in one organized workspace.' },
{ title: 'Structured dealer onboarding', body: 'A guided registration with GST/PAN capture, document upload and a reviewable verification trail.' },
{ title: 'Application status visibility', body: 'Every recorded status change is time-stamped and visible to the dealer and operations team.' },
{ title: 'Configurable partner workflows', body: 'Define which finance partners handle which categories, finance types and processing modes.' }];


export type StepActor = 'System' | 'Operations' | 'System + Operations';

export const workflowSteps: {title: string;body: string;actor: StepActor;}[] = [
{ title: 'Dealer registration', body: 'Dealer submits owner, business, GST/PAN details and documents. A reference number is generated.', actor: 'System' },
{ title: 'Business verification', body: 'Verification team reviews documents, requests corrections if needed and activates the dealer.', actor: 'Operations' },
{ title: 'Customer management', body: 'Dealer creates customer records and stores KYC documents against each customer.', actor: 'System' },
{ title: 'Finance application', body: 'Dealer enters product, price and down payment. Finance amount is calculated and validated.', actor: 'System' },
{ title: 'Lender processing', body: 'Operations submits the case to the selected partner and records the lender reference manually.', actor: 'Operations' },
{ title: 'Outcome & disbursement tracking', body: 'Lender decisions and disbursement confirmations are recorded and the dealer is notified.', actor: 'System + Operations' }];


export const featureGroups = [
{
  id: 'dealers',
  title: 'Dealer network management',
  summary: 'Onboard, verify and activate dealers with a reviewable trail.',
  items: ['Dealer registration', 'Business profile', 'GST/PAN details', 'Document uploads', 'Verification workflow', 'Agreement acceptance', 'Dealer activation']
},
{
  id: 'applications',
  title: 'Customer & application management',
  summary: 'Keep every customer and their finance cases organized.',
  items: ['Customer records', 'Customer application history', 'Existing finance / card-limit applications', 'New loan applications', 'Finance amount & product information', 'Document submission', 'Application status tracking']
},
{
  id: 'operations',
  title: 'Finance operations',
  summary: 'Run multi-partner processing with a manual-first workflow.',
  items: ['Multiple finance partner configurations', 'Manual lender processing', 'Application timeline', 'Document correction requests', 'Status history', 'Dealer / platform payout configuration', 'Reports and operational visibility']
},
{
  id: 'governance',
  title: 'Admin & governance',
  summary: 'Control who can see and do what, and keep a record of it.',
  items: ['Role-based access', 'Dealer verification', 'Application review', 'Support tickets', 'Notifications', 'Audit history']
}];


export const solutions: {title: string;body: string;icon: LucideIcon;}[] = [
{ title: 'EV finance', body: 'Electric two- and three-wheeler cases with vehicle and battery details captured upfront.', icon: BatteryChargingIcon },
{ title: 'Electronics finance', body: 'Televisions, laptops, smartphones and appliances with invoice-ready product records.', icon: MonitorSmartphoneIcon },
{ title: 'Furniture finance', body: 'Higher-ticket furniture and furnishing cases with down payment and tenure capture.', icon: SofaIcon },
{ title: 'Consumer durable finance', body: 'Refrigerators, washing machines and kitchen appliances for everyday retail financing.', icon: RefrigeratorIcon },
{ title: 'New loan processing', body: 'Structured new-loan applications routed to a configured partner for lender review.', icon: FileCheckIcon },
{ title: 'Existing finance / card limit', body: 'Cases where the customer uses an existing finance or card limit, recorded without storing card details.', icon: CreditCardIcon }];


export const dealerBenefits = [
'Organize customer records',
'Submit finance applications',
'Reduce scattered manual tracking',
'Maintain document records',
'Track processing progress',
'Access centralized support',
'View application history'];


export const partnerCategories: {title: string;body: string;icon: LucideIcon;}[] = [
{ title: 'Banking partners', body: 'Scheduled commercial banks offering retail product loans.', icon: LandmarkIcon },
{ title: 'NBFC partners', body: 'Non-banking finance companies with consumer lending programs.', icon: BuildingIcon },
{ title: 'Consumer finance partners', body: 'Point-of-sale consumer finance providers.', icon: WalletIcon },
{ title: 'Credit card / EMI partners', body: 'Card-limit and EMI conversion programs.', icon: CreditCardIcon },
{ title: 'EV finance partners', body: 'Specialist lenders for electric vehicles.', icon: BatteryChargingIcon }];


export const securityItems: {title: string;body: string;icon: LucideIcon;}[] = [
{ title: 'Role-based access', body: 'Dealers see only their own records. Admin staff see only the modules their role allows.', icon: KeyRoundIcon },
{ title: 'Protected application workflows', body: 'Status changes follow defined steps and important actions require confirmation.', icon: ShieldCheckIcon },
{ title: 'Controlled document access', body: 'Identity and business documents are treated as private assets with access-checked previews.', icon: LockIcon },
{ title: 'Activity history', body: 'Who changed what, and when, is recorded in an audit log available to authorized admins.', icon: HistoryIcon },
{ title: 'Secure authentication design', body: 'Role-aware sign-in for dealers and operations staff, with session controls designed for later backend enforcement.', icon: LayersIcon },
{ title: 'Clear lender responsibility', body: 'Eligibility, approval and disbursement decisions are disclosed as the lender’s responsibility.', icon: ScaleIcon }];


export const faqs = [
{ q: 'Who can register as a dealer?', a: 'Retail businesses selling eligible products — such as EVs, electronics, furniture or consumer durables — with a valid GST registration and business PAN can apply. Every registration is reviewed before activation.' },
{ q: 'What documents are required?', a: 'Typically a GST registration certificate, business PAN, shop & establishment licence, cancelled cheque, owner identity proof and business address proof. The exact list may be configured by the platform operator.' },
{ q: 'Can dealers manage multiple customers?', a: 'Yes. Each dealer maintains its own customer records and can view only the customers and applications it created.' },
{ q: 'Can one customer have multiple applications?', a: 'Yes. A customer can have several applications over time, each with its own product, partner, documents and status history.' },
{ q: 'How are existing finance limits handled?', a: 'Existing finance or card-limit cases are recorded as a separate finance type. The platform never asks for or stores card numbers, PINs or CVVs; limit confirmation comes from the partner.' },
{ q: 'Can applications be processed manually?', a: 'Yes. In Phase 1, the operations team submits cases to partners and records lender references, remarks and outcomes manually in the platform.' },
{ q: 'Can official lender APIs be integrated later?', a: 'The workflow is designed to support integrations later. Any direct bank or NBFC integration requires official partner approval, documentation and credentials, and is outside the Phase 1 scope unless separately agreed in writing.' },
{ q: 'Does the platform guarantee loan approval?', a: 'No. The platform manages the workflow only. Final eligibility, approval, terms and disbursement are decided solely by the respective lender.' },
{ q: 'How are partner payouts configured?', a: 'Authorized admins configure commission type, rate, dealer and platform share and payout triggers per partner and product. Actual rates come from signed commercial agreements; configured values are estimates, not confirmed payments.' }];


export const heroPreview = {
  metrics: [
  { label: 'Total applications', value: '1,248' },
  { label: 'Under processing', value: '186' },
  { label: 'Approved', value: '642' },
  { label: 'Disbursed', value: '571' }],

  rows: [
  { id: 'FA-10418', customer: 'R. Kulkarni', product: 'Smart TV', amount: '₹55,000', status: 'Processing' },
  { id: 'FA-10417', customer: 'P. Deshmukh', product: 'EV scooter', amount: '₹1,00,000', status: 'Documents Required' },
  { id: 'FA-10409', customer: 'A. Shinde', product: 'Refrigerator', amount: '₹42,990', status: 'Approved' },
  { id: 'FA-10396', customer: 'S. Patil', product: 'Dining set', amount: '₹70,000', status: 'Disbursed' }],

  distribution: [
  { name: 'Processing', value: 186 },
  { name: 'Approved', value: 71 },
  { name: 'Disbursed', value: 571 },
  { name: 'Documents Required', value: 64 },
  { name: 'Rejected', value: 112 }]

};
