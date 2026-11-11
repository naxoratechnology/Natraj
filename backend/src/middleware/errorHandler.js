export const notFound = (req, res) => res.status(404).json({ message: 'Route not found' });
export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  console.error(error);
  if (error?.name === 'MulterError') {
    const tooLarge = error.code === 'LIMIT_FILE_SIZE';
    return res.status(tooLarge ? 413 : 422).json({ message: tooLarge ? 'Each document must be 5 MB or smaller' : 'Only PDF, JPG and PNG registration documents are accepted' });
  }
  if (error?.status) return res.status(error.status).json({ message: error.message });
  if (error?.code === 11000) return res.status(409).json({ message: 'An account with these details already exists' });
  res.status(500).json({ message: 'An unexpected server error occurred' });
}
