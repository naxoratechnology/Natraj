import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { dealerDocumentUpload } from '../../middleware/dealerDocumentUpload.js';
import { reuploadDocument } from './dealerDocuments.controller.js';

export const dealerDocumentsRouter = Router();
dealerDocumentsRouter.post('/me/documents/:documentType', authenticate, authorize('dealer'), dealerDocumentUpload, reuploadDocument);
