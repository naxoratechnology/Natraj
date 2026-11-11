import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { authorizePermission } from '../../middleware/authorizePermission.js';
import { adminDashboard, dealerDashboard } from './dashboard.controller.js';

export const dashboardRouter = Router();
dashboardRouter.get('/admin', authenticate, authorize('admin', 'super_admin'), authorizePermission('dashboard'), adminDashboard);
dashboardRouter.get('/dealer', authenticate, authorize('dealer'), dealerDashboard);
