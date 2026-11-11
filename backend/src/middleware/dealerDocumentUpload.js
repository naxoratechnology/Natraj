import multer from 'multer';

const allowedTypes = new Set(['application/pdf', 'image/jpeg', 'image/png']);
export const dealerDocumentUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, callback) => {
    if (!allowedTypes.has(file.mimetype)) return callback(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname));
    callback(null, true);
  }
}).single('document');
