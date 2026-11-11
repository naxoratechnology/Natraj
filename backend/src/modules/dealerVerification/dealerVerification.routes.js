import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { authorizePermission } from '../../middleware/authorizePermission.js';
import { activateDealer, getDealer, listDealers, rejectDealer, requestDocuments, startReview, suspendDealer, verifyDealer } from './dealerVerification.controller.js';

export const dealerVerificationRouter = Router();
dealerVerificationRouter.use(authenticate, authorize('admin', 'super_admin'));
dealerVerificationRouter.use(authorizePermission('dealers'));
dealerVerificationRouter.get('/', listDealers);
dealerVerificationRouter.get('/:dealerId', getDealer);
dealerVerificationRouter.post('/:dealerId/review', startReview);
dealerVerificationRouter.post('/:dealerId/request-documents', requestDocuments);
dealerVerificationRouter.post('/:dealerId/verify', verifyDealer);
dealerVerificationRouter.post('/:dealerId/reject', rejectDealer);
dealerVerificationRouter.post('/:dealerId/suspend', suspendDealer);
dealerVerificationRouter.post('/:dealerId/activate', activateDealer);
