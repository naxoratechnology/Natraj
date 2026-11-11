import { User } from '../../models/User.js';
import { addHistory, dealerResponse } from '../dealer/dealer.service.js';
import { documentRequestSchema, reasonSchema, verificationSchema } from './dealerVerification.validation.js';

function invalid(result, res) {
  if (result.success) return false;
  res.status(422).json({ message: result.error.issues[0].message });
  return true;
}
async function dealerById(id, res) {
  const dealer = await User.findOne({ _id: id, role: 'dealer' });
  if (!dealer) res.status(404).json({ message: 'Dealer not found' });
  return dealer;
}

export async function listDealers(req, res) {
  const query = { role: 'dealer' };
  if (req.query.status) query['dealerProfile.status'] = req.query.status;
  const dealers = await User.find(query).sort({ createdAt: -1 });
  res.json({ dealers: dealers.map(dealerResponse) });
}
export async function getDealer(req, res) {
  const dealer = await dealerById(req.params.dealerId, res);
  if (dealer) res.json({ dealer: dealerResponse(dealer) });
}
export async function startReview(req, res) {
  const dealer = await dealerById(req.params.dealerId, res); if (!dealer) return;
  if (!['submitted', 'documents_required'].includes(dealer.dealerProfile.status)) return res.status(409).json({ message: 'Dealer cannot enter review from the current status' });
  addHistory(dealer, 'under_review', req.user, 'Verification review started');
  await dealer.save(); res.json({ message: 'Verification review started', dealer: dealerResponse(dealer) });
}
export async function requestDocuments(req, res) {
  const parsed = documentRequestSchema.safeParse(req.body); if (invalid(parsed, res)) return;
  const dealer = await dealerById(req.params.dealerId, res); if (!dealer) return;
  dealer.dealerProfile.documentRequests.push({ ...parsed.data, requestedBy: req.user.id });
  for (const type of parsed.data.documentTypes) {
    const document = dealer.dealerProfile.documents?.get(type);
    if (document) { document.verificationStatus = 'rejected'; document.note = parsed.data.note; }
  }
  addHistory(dealer, 'documents_required', req.user, parsed.data.note);
  await dealer.save(); res.json({ message: 'Document request sent', dealer: dealerResponse(dealer) });
}
export async function verifyDealer(req, res) {
  const parsed = verificationSchema.safeParse(req.body); if (invalid(parsed, res)) return;
  const dealer = await dealerById(req.params.dealerId, res); if (!dealer) return;
  if (!['under_review', 'documents_required'].includes(dealer.dealerProfile.status)) return res.status(409).json({ message: 'Dealer is not under verification' });
  const openRequest = dealer.dealerProfile.documentRequests.some((request) => !request.resolvedAt);
  if (openRequest) return res.status(409).json({ message: 'Requested documents must be uploaded before verification can be approved' });
  dealer.dealerProfile.verificationChecklist = parsed.data.checklist;
  for (const document of dealer.dealerProfile.documents?.values() || []) { document.verificationStatus = 'verified'; document.note = ''; }
  addHistory(dealer, 'verified', req.user, 'Business and tax details verified');
  addHistory(dealer, 'agreement_pending', null, 'Dealer agreement awaiting acceptance');
  await dealer.save(); res.json({ message: 'Dealer verified; agreement acceptance pending', dealer: dealerResponse(dealer) });
}
export async function rejectDealer(req, res) {
  const parsed = reasonSchema.safeParse(req.body); if (invalid(parsed, res)) return;
  const dealer = await dealerById(req.params.dealerId, res); if (!dealer) return;
  addHistory(dealer, 'rejected', req.user, parsed.data.reason);
  await dealer.save(); res.json({ message: 'Dealer rejected', dealer: dealerResponse(dealer) });
}
export async function suspendDealer(req, res) {
  const parsed = reasonSchema.safeParse(req.body); if (invalid(parsed, res)) return;
  const dealer = await dealerById(req.params.dealerId, res); if (!dealer) return;
  if (dealer.dealerProfile.status !== 'active') return res.status(409).json({ message: 'Only active dealers can be suspended' });
  addHistory(dealer, 'suspended', req.user, parsed.data.reason);
  await dealer.save(); res.json({ message: 'Dealer suspended', dealer: dealerResponse(dealer) });
}
export async function activateDealer(req, res) {
  const dealer = await dealerById(req.params.dealerId, res); if (!dealer) return;
  if (!['agreement_pending', 'suspended'].includes(dealer.dealerProfile.status)) return res.status(409).json({ message: 'Dealer cannot be activated from the current status' });
  addHistory(dealer, 'active', req.user, dealer.dealerProfile.status === 'suspended' ? 'Dealer reactivated' : 'Dealer activated by administrator');
  await dealer.save(); res.json({ message: 'Dealer activated', dealer: dealerResponse(dealer) });
}
