import { signedDocumentUrl } from '../../config/cloudinary.js';

export const documentTypes = ['gst', 'pan', 'shop', 'cheque', 'owner', 'address'];

export function addHistory(user, status, actor, note = '') {
  user.dealerProfile.status = status;
  user.dealerProfile.statusHistory.push({ status, actor: actor?.id || null, actorName: actor?.name || 'System', note });
}

export function dealerResponse(user) {
  const profile = user.dealerProfile;
  const documents = {};
  for (const [type, document] of profile.documents || []) {
    documents[type] = {
      name: document.name, sizeKb: document.sizeKb, verificationStatus: document.verificationStatus,
      note: document.note, uploadedAt: document.uploadedAt,
      url: document.publicId ? signedDocumentUrl(document.publicId, document.resourceType) : undefined
    };
  }
  return {
    id: user.id, dealerCode: profile.registrationReference, name: user.name, email: user.email,
    active: user.active, status: profile.status || 'submitted', designation: profile.designation, mobile: profile.mobile,
    businessName: profile.businessName, businessType: profile.businessType, category: profile.category,
    yearsInBusiness: profile.yearsInBusiness, address: profile.address, city: profile.city, state: profile.state,
    pincode: profile.pincode, gstin: profile.gstin, pan: profile.pan, monthlyFinanceVolume: profile.monthlyFinanceVolume,
    documents, documentRequests: profile.documentRequests || [], statusHistory: profile.statusHistory || [],
    verificationChecklist: profile.verificationChecklist || [], agreement: profile.agreement,
    submittedAt: user.createdAt, updatedAt: user.updatedAt
  };
}
