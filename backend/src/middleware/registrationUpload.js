import multer from 'multer';

const allowedFields = new Set(['doc_gst', 'doc_pan', 'doc_shop', 'doc_cheque', 'doc_owner', 'doc_address']);
const allowedTypes = new Set(['application/pdf', 'image/jpeg', 'image/png']);

export const registrationUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 6, fields: 2 },
  fileFilter: (req, file, callback) => {
    if (!allowedFields.has(file.fieldname) || !allowedTypes.has(file.mimetype)) {
      callback(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname));
      return;
    }
    callback(null, true);
  }
}).any();
