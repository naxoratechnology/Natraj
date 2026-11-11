export function authorizePermission(permission) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Authentication is required' });
    if (req.user.role === 'super_admin') return next();
    if (req.user.role !== 'admin' || !req.user.permissions?.includes(permission)) return res.status(403).json({ message: 'You do not have access to this module' });
    next();
  };
}
