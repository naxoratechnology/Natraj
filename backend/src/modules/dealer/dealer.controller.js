import { User } from '../../models/User.js';
import { addHistory, dealerResponse } from './dealer.service.js';

export const myDealerProfile = (req, res) => res.json({ dealer: dealerResponse(req.user) });

export async function updateMyProfile(req, res) {
  for (const key of ['name', 'designation', 'mobile']) {
    if (typeof req.body[key] !== 'string' || !req.body[key].trim()) continue;
    if (key === 'name') req.user.name = req.body[key].trim();
    else req.user.dealerProfile[key] = req.body[key].trim();
  }
  await req.user.save();
  res.json({ message: 'Dealer profile updated', dealer: dealerResponse(req.user) });
}

export async function acceptAgreement(req, res) {
  const dealer = await User.findById(req.user.id);
  if (dealer.dealerProfile.status !== 'agreement_pending') return res.status(409).json({ message: 'Agreement is not currently awaiting acceptance' });
  dealer.dealerProfile.agreement = { version: '1.0', acceptedAt: new Date(), acceptedIp: req.ip || '' };
  addHistory(dealer, 'active', dealer, 'Dealer agreement accepted electronically');
  await dealer.save();
  res.json({ message: 'Agreement accepted and dealer activated', dealer: dealerResponse(dealer) });
}

export const myStatusHistory = (req, res) => res.json({ history: req.user.dealerProfile.statusHistory || [] });
