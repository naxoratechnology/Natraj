import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { User } from '../../models/User.js';
import { AuthSession } from '../../models/AuthSession.js';
import { LoginAttempt } from '../../models/LoginAttempt.js';
import { PasswordReset } from '../../models/PasswordReset.js';
import { env } from '../../config/env.js';
import { sendPasswordResetEmail } from '../../utils/mailer.js';
import { deleteCloudinaryAsset, uploadRegistrationDocument } from '../../config/cloudinary.js';
import { accountStatusSchema, changePasswordSchema, forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema } from './auth.validation.js';

const REFRESH_COOKIE = 'refreshToken';
const publicUser = (user) => ({ id: user.id, name: user.name, email: user.email, role: user.role, active: user.active, permissions: user.role === 'super_admin' ? ['*'] : user.permissions || [], accessRoleName: user.accessRoleName || '' });
const hash = (value) => createHash('sha256').update(value).digest('hex');
const requestMeta = (req) => ({ ip: req.ip || '', userAgent: req.get('user-agent') || '' });
const cookieOptions = { httpOnly: true, sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax', secure: env.NODE_ENV === 'production', path: '/api/auth', maxAge: 7 * 24 * 60 * 60 * 1000 };

function rejectInvalid(result, res) {
  if (result.success) return false;
  const errors = {};
  for (const issue of result.error.issues) errors[issue.path[0] || 'form'] ??= issue.message;
  res.status(422).json({ message: 'Please correct the highlighted fields', errors });
  return true;
}

function accessTokenFor(user, sessionId) {
  return jwt.sign({ sub: user.id, role: user.role, sid: sessionId }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
}

async function issueSession(user, req, res) {
  const session = await AuthSession.create({ user: user.id, refreshTokenHash: 'pending', expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), ...requestMeta(req) });
  const refreshToken = jwt.sign({ sub: user.id, sid: session.id, type: 'refresh' }, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN });
  session.refreshTokenHash = hash(refreshToken);
  await session.save();
  res.cookie(REFRESH_COOKIE, refreshToken, cookieOptions);
  return accessTokenFor(user, session.id);
}

async function revokeAllSessions(userId) {
  await AuthSession.updateMany({ user: userId, revokedAt: null }, { revokedAt: new Date() });
}

export async function register(req, res) {
  let payload = req.body;
  if (typeof req.body.data === 'string') {
    try { payload = JSON.parse(req.body.data); }
    catch { return res.status(400).json({ message: 'Invalid registration data' }); }
  }
  const parsed = registerSchema.safeParse(payload);
  if (rejectInvalid(parsed, res)) return;
  const data = parsed.data;
  if (await User.exists({ email: data.email })) return res.status(409).json({ message: 'An account with this email already exists', errors: { email: 'Email is already registered' } });
  const reference = `DLR-${String(new Date().getFullYear()).slice(-2)}-${randomUUID().slice(0, 8).toUpperCase()}`;
  const uploadedAssets = [];
  const documents = {};
  try {
    for (const file of req.files || []) {
      const documentType = file.fieldname.replace('doc_', '');
      const result = await uploadRegistrationDocument(file, reference, documentType);
      uploadedAssets.push({ publicId: result.public_id, resourceType: result.resource_type });
      documents[documentType] = {
        name: file.originalname,
        sizeKb: Math.max(Math.round(result.bytes / 1024), 1),
        publicId: result.public_id,
        secureUrl: result.secure_url,
        resourceType: result.resource_type,
        format: result.format || ''
      };
    }
    const user = await User.create({
      name: data.ownerName, email: data.email, passwordHash: await bcrypt.hash(data.password, 12), role: 'dealer',
      dealerProfile: { designation: data.designation, mobile: data.mobile, businessName: data.businessName, businessType: data.businessType,
        category: data.category, yearsInBusiness: data.yearsInBusiness, address: data.address, city: data.city, state: data.state,
        pincode: data.pincode, gstin: data.gstin, pan: data.pan, monthlyFinanceVolume: data.monthlyFinanceVolume,
        documents: Object.keys(documents).length ? documents : undefined, registrationReference: reference,
        status: 'submitted', statusHistory: [{ status: 'submitted', actorName: data.ownerName, note: 'Dealer registration submitted' }] }
    });
    res.status(201).json({ message: 'Dealer registration submitted', reference, user: publicUser(user) });
  } catch (error) {
    await Promise.allSettled(uploadedAssets.map((asset) => deleteCloudinaryAsset(asset.publicId, asset.resourceType)));
    throw error;
  }
}

export async function login(req, res) {
  const parsed = loginSchema.safeParse(req.body);
  if (rejectInvalid(parsed, res)) return;
  const user = await User.findOne({ email: parsed.data.email }).select('+passwordHash');
  const meta = requestMeta(req);
  const locked = user?.lockedUntil && user.lockedUntil > new Date();
  const validPassword = user && !locked && await bcrypt.compare(parsed.data.password, user.passwordHash);

  if (!user || !user.active || locked || !validPassword) {
    if (user && !locked && user.active) {
      user.failedLoginAttempts += 1;
      if (user.failedLoginAttempts >= 5) user.lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
      await user.save();
    }
    await LoginAttempt.create({ user: user?.id, email: parsed.data.email, successful: false, reason: !user ? 'unknown_account' : !user.active ? 'inactive' : locked ? 'locked' : 'invalid_password', ...meta });
    return res.status(401).json({ message: locked ? 'Account is temporarily locked. Try again later.' : 'The email or password is incorrect' });
  }

  user.failedLoginAttempts = 0;
  user.lockedUntil = null;
  await user.save();
  await LoginAttempt.create({ user: user.id, email: user.email, successful: true, reason: 'login', ...meta });
  const token = await issueSession(user, req, res);
  res.json({ token, user: publicUser(user) });
}

export async function refresh(req, res) {
  const token = req.cookies?.[REFRESH_COOKIE];
  if (!token) return res.status(401).json({ message: 'Refresh session is unavailable' });
  try {
    const payload = jwt.verify(token, env.JWT_REFRESH_SECRET);
    if (payload.type !== 'refresh') throw new Error('Invalid token type');
    const session = await AuthSession.findById(payload.sid);
    const user = await User.findById(payload.sub);
    if (!session || session.revokedAt || session.expiresAt <= new Date() || session.refreshTokenHash !== hash(token) || !user?.active) throw new Error('Invalid session');
    session.lastUsedAt = new Date();
    const nextRefresh = jwt.sign({ sub: user.id, sid: session.id, type: 'refresh' }, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN });
    session.refreshTokenHash = hash(nextRefresh);
    await session.save();
    res.cookie(REFRESH_COOKIE, nextRefresh, cookieOptions);
    res.json({ token: accessTokenFor(user, session.id), user: publicUser(user) });
  } catch {
    res.clearCookie(REFRESH_COOKIE, cookieOptions);
    res.status(401).json({ message: 'Session is invalid or expired' });
  }
}

export async function logout(req, res) {
  const token = req.cookies?.[REFRESH_COOKIE];
  if (token) {
    try {
      const payload = jwt.verify(token, env.JWT_REFRESH_SECRET);
      await AuthSession.updateOne({ _id: payload.sid, refreshTokenHash: hash(token) }, { revokedAt: new Date() });
    } catch { /* An invalid cookie is still cleared. */ }
  }
  res.clearCookie(REFRESH_COOKIE, cookieOptions);
  res.status(204).end();
}

export async function forgotPassword(req, res) {
  const parsed = forgotPasswordSchema.safeParse(req.body);
  if (rejectInvalid(parsed, res)) return;
  const user = await User.findOne({ email: parsed.data.email, active: true });
  if (user) {
    await PasswordReset.deleteMany({ user: user.id, usedAt: null });
    const token = randomBytes(32).toString('hex');
    await PasswordReset.create({ user: user.id, tokenHash: hash(token), expiresAt: new Date(Date.now() + 30 * 60 * 1000) });
    const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${token}`;
    await sendPasswordResetEmail({ email: user.email, name: user.name, resetUrl });
  }
  res.json({ message: 'If an active account exists, a reset link has been sent.' });
}

export async function resetPassword(req, res) {
  const parsed = resetPasswordSchema.safeParse(req.body);
  if (rejectInvalid(parsed, res)) return;
  const reset = await PasswordReset.findOne({ tokenHash: hash(parsed.data.token), usedAt: null, expiresAt: { $gt: new Date() } });
  if (!reset) return res.status(400).json({ message: 'This reset link is invalid or expired' });
  const user = await User.findById(reset.user).select('+passwordHash');
  if (!user?.active) return res.status(400).json({ message: 'This account is unavailable' });
  user.passwordHash = await bcrypt.hash(parsed.data.password, 12);
  user.passwordChangedAt = new Date();
  user.failedLoginAttempts = 0;
  user.lockedUntil = null;
  reset.usedAt = new Date();
  await Promise.all([user.save(), reset.save(), revokeAllSessions(user.id)]);
  res.json({ message: 'Password has been reset. You can now sign in.' });
}

export async function changePassword(req, res) {
  const parsed = changePasswordSchema.safeParse(req.body);
  if (rejectInvalid(parsed, res)) return;
  const user = await User.findById(req.user.id).select('+passwordHash');
  if (!(await bcrypt.compare(parsed.data.currentPassword, user.passwordHash))) return res.status(400).json({ message: 'Current password is incorrect', errors: { currentPassword: 'Current password is incorrect' } });
  user.passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
  user.passwordChangedAt = new Date();
  await user.save();
  await AuthSession.updateMany({ user: user.id, _id: { $ne: req.authSessionId }, revokedAt: null }, { revokedAt: new Date() });
  res.json({ message: 'Password updated' });
}

export const me = (req, res) => res.json({ user: publicUser(req.user) });

export async function loginHistory(req, res) {
  const attempts = await LoginAttempt.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(50).select('successful reason ip userAgent createdAt');
  res.json({ attempts });
}

export async function setAccountStatus(req, res) {
  const parsed = accountStatusSchema.safeParse(req.body);
  if (rejectInvalid(parsed, res)) return;
  if (req.params.userId === req.user.id) return res.status(400).json({ message: 'You cannot deactivate your own account' });
  const user = await User.findOne({ _id: req.params.userId, role: 'dealer' });
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.active = parsed.data.active;
  await user.save();
  if (!user.active) await revokeAllSessions(user.id);
  res.json({ message: user.active ? 'Account activated' : 'Account deactivated', user: publicUser(user) });
}
