import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { createAdmin, listAdmins, setAdminStatus, updateAdminPermissions } from './superAdmin.controller.js';

export const superAdminRouter = Router();
superAdminRouter.use(authenticate, authorize('super_admin'));
superAdminRouter.get('/admins', listAdmins);
superAdminRouter.post('/admins', createAdmin);
superAdminRouter.patch('/admins/:userId/status', setAdminStatus);
superAdminRouter.patch('/admins/:userId/permissions', updateAdminPermissions);
