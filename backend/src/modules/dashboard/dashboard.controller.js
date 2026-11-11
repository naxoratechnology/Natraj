import { User } from '../../models/User.js';
import { dealerResponse } from '../dealer/dealer.service.js';

const dealerStatuses = ['submitted', 'under_review', 'documents_required', 'verified', 'agreement_pending', 'active', 'suspended', 'rejected'];
const documentStatuses = ['missing', 'pending', 'under_review', 'verified', 'rejected'];

function monthBuckets() {
  const formatter = new Intl.DateTimeFormat('en-IN', { month: 'short' });
  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setDate(1); date.setHours(0, 0, 0, 0); date.setMonth(date.getMonth() - (5 - index));
    const end = new Date(date); end.setMonth(end.getMonth() + 1);
    return { month: formatter.format(date), start: date, end, registrations: 0, activated: 0 };
  });
}

export async function adminDashboard(req, res) {
  const dealers = await User.find({ role: 'dealer' }).sort({ createdAt: -1 });
  const statusDistribution = Object.fromEntries(dealerStatuses.map((status) => [status, 0]));
  const documentDistribution = Object.fromEntries(documentStatuses.map((status) => [status, 0]));
  const trend = monthBuckets();

  for (const dealer of dealers) {
    const profile = dealer.dealerProfile;
    statusDistribution[profile.status || 'submitted'] += 1;
    const registrationBucket = trend.find((bucket) => dealer.createdAt >= bucket.start && dealer.createdAt < bucket.end);
    if (registrationBucket) registrationBucket.registrations += 1;
    const activation = profile.statusHistory?.find((item) => item.status === 'active');
    const activationBucket = activation && trend.find((bucket) => activation.createdAt >= bucket.start && activation.createdAt < bucket.end);
    if (activationBucket) activationBucket.activated += 1;
    for (const type of ['gst', 'pan', 'shop', 'cheque', 'owner', 'address']) {
      const document = profile.documents?.get(type);
      documentDistribution[document?.verificationStatus || 'missing'] += 1;
    }
  }

  const pendingStatuses = ['submitted', 'under_review', 'documents_required', 'verified', 'agreement_pending'];
  res.json({
    metrics: {
      totalDealers: dealers.length,
      activeDealers: statusDistribution.active,
      pendingVerification: dealers.filter((dealer) => pendingStatuses.includes(dealer.dealerProfile.status)).length,
      documentsRequired: statusDistribution.documents_required,
      suspendedDealers: statusDistribution.suspended,
      rejectedDealers: statusDistribution.rejected,
      totalCustomers: 0,
      totalApplications: 0
    },
    statusDistribution,
    documentDistribution,
    trend: trend.map(({ month, registrations, activated }) => ({ month, registrations, activated })),
    pendingDealers: dealers.filter((dealer) => pendingStatuses.includes(dealer.dealerProfile.status)).slice(0, 6).map(dealerResponse),
    recentDealers: dealers.slice(0, 6).map(dealerResponse),
    generatedAt: new Date()
  });
}

export async function dealerDashboard(req, res) {
  const dealer = dealerResponse(req.user);
  const documentDistribution = Object.fromEntries(documentStatuses.map((status) => [status, 0]));
  for (const type of ['gst', 'pan', 'shop', 'cheque', 'owner', 'address']) {
    const document = req.user.dealerProfile.documents?.get(type);
    documentDistribution[document?.verificationStatus || 'missing'] += 1;
  }
  res.json({
    dealer,
    metrics: { totalCustomers: 0, totalApplications: 0, pendingApplications: 0, approvedApplications: 0, disbursedApplications: 0 },
    applicationDistribution: {},
    documentDistribution,
    recentApplications: [],
    generatedAt: new Date()
  });
}
