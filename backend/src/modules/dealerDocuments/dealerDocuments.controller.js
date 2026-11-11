import { User } from '../../models/User.js';
import { deleteCloudinaryAsset, uploadRegistrationDocument } from '../../config/cloudinary.js';
import { addHistory, dealerResponse, documentTypes } from '../dealer/dealer.service.js';

export async function reuploadDocument(req, res) {
  const { documentType } = req.params;
  if (!documentTypes.includes(documentType)) return res.status(400).json({ message: 'Unknown dealer document type' });
  if (!req.file) return res.status(422).json({ message: 'Attach a PDF, JPG or PNG document' });
  const dealer = await User.findById(req.user.id);
  const oldDocument = dealer.dealerProfile.documents?.get(documentType);
  const result = await uploadRegistrationDocument(req.file, dealer.dealerProfile.registrationReference, documentType);
  try {
    if (!dealer.dealerProfile.documents) dealer.dealerProfile.documents = new Map();
    dealer.dealerProfile.documents.set(documentType, {
      name: req.file.originalname, sizeKb: Math.max(Math.round(result.bytes / 1024), 1), publicId: result.public_id,
      secureUrl: result.secure_url, resourceType: result.resource_type, format: result.format || '',
      uploadedAt: new Date(), verificationStatus: 'under_review', note: ''
    });
    for (const request of dealer.dealerProfile.documentRequests) {
      const allProvided = request.documentTypes.every((type) => {
        const requestedDocument = dealer.dealerProfile.documents?.get(type);
        return requestedDocument && requestedDocument.verificationStatus !== 'rejected';
      });
      if (!request.resolvedAt && allProvided) request.resolvedAt = new Date();
    }
    const hasOpenRequests = dealer.dealerProfile.documentRequests.some((request) => !request.resolvedAt);
    if (dealer.dealerProfile.status === 'documents_required' && !hasOpenRequests) {
      addHistory(dealer, 'under_review', dealer, 'All requested documents uploaded for verification');
    }
    await dealer.save();
    if (oldDocument?.publicId) await deleteCloudinaryAsset(oldDocument.publicId, oldDocument.resourceType).catch(() => undefined);
    res.json({ message: 'Document uploaded for verification', dealer: dealerResponse(dealer) });
  } catch (error) {
    await deleteCloudinaryAsset(result.public_id, result.resource_type).catch(() => undefined);
    throw error;
  }
}
