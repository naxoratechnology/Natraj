import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { acceptAgreement, myDealerProfile, myStatusHistory, updateMyProfile } from './dealer.controller.js';

export const dealerRouter = Router();
dealerRouter.use(authenticate, authorize('dealer'));
dealerRouter.get('/me', myDealerProfile);
dealerRouter.patch('/me/profile', updateMyProfile);
dealerRouter.get('/me/history', myStatusHistory);
dealerRouter.post('/me/agreement/accept', acceptAgreement);
