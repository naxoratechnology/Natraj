import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { User } from '../../models/User.js';
import { AuthSession } from '../../models/AuthSession.js';
import { AccessRole, permissionValues } from '../../models/AccessRole.js';

const permissionsSchema = z.array(z.enum(permissionValues)).min(1).refine((items) => items.includes('dashboard'), 'Dashboard access is required');
const roleSchema = z.object({ name: z.string().trim().min(2).max(60), description: z.string().trim().max(200).default(''), permissions: permissionsSchema });
const createAdminSchema = z.object({ name: z.string().trim().min(2).max(80), email: z.string().trim().toLowerCase().email(), password: z.string().min(8).max(128), permissions: permissionsSchema });
const assignmentSchema = z.object({ roleId: z.string().min(1) });
const statusSchema = z.object({ active: z.boolean() });
const roleResponse = (role, assignedUsers = 0) => ({ id: role.id, name: role.name, description: role.description, permissions: role.permissions, active: role.active, assignedUsers, createdAt: role.createdAt, updatedAt: role.updatedAt });
const userResponse = (user) => ({ id: user.id, name: user.name, email: user.email, role: user.role, active: user.active, permissions: user.permissions || [], accessRole: user.accessRole && typeof user.accessRole === 'object' ? { id: user.accessRole.id, name: user.accessRole.name } : null, createdAt: user.createdAt, updatedAt: user.updatedAt });

async function activeRole(roleId, res) {
  const role = await AccessRole.findOne({ _id: roleId, active: true });
  if (!role) res.status(422).json({ message: 'Select an active access role' });
  return role;
}

export async function listAdmins(req, res) {
  const users = await User.find({ role: 'admin' }).populate('accessRole', 'name').sort({ createdAt: 1 });
  res.json({ users: users.map(userResponse) });
}

export async function createAdmin(req, res) {
  const parsed = createAdminSchema.safeParse(req.body);
  if (!parsed.success) return res.status(422).json({ message: parsed.error.issues[0].message });
  if (await User.exists({ email: parsed.data.email })) return res.status(409).json({ message: 'An account with this email already exists' });
  const user = await User.create({ name: parsed.data.name, email: parsed.data.email, passwordHash: await bcrypt.hash(parsed.data.password, 12), role: 'admin', accessRole: null, accessRoleName: 'Admin', permissions: parsed.data.permissions, active: true });
  res.status(201).json({ message: 'Administrator created', user: userResponse(user) });
}

export async function updateAdminPermissions(req, res) {
  const parsed = z.object({ permissions: permissionsSchema }).safeParse(req.body);
  if (!parsed.success) return res.status(422).json({ message: parsed.error.issues[0].message });
  const user = await User.findOne({ _id: req.params.userId, role: 'admin' });
  if (!user) return res.status(404).json({ message: 'Administrator not found' });
  user.permissions = parsed.data.permissions; user.accessRole = null; user.accessRoleName = 'Admin';
  await user.save();
  await AuthSession.updateMany({ user: user.id, revokedAt: null }, { revokedAt: new Date() });
  res.json({ message: 'Access controls updated. The administrator must sign in again.', user: userResponse(user) });
}

export async function assignAdminRole(req, res) {
  const parsed = assignmentSchema.safeParse(req.body);
  if (!parsed.success) return res.status(422).json({ message: 'Select an access role' });
  const [user, role] = await Promise.all([User.findOne({ _id: req.params.userId, role: 'admin' }), activeRole(parsed.data.roleId, res)]);
  if (!user) return res.status(404).json({ message: 'Administrator not found' });
  if (!role) return;
  user.accessRole = role.id; user.accessRoleName = role.name; user.permissions = role.permissions;
  await user.save();
  await AuthSession.updateMany({ user: user.id, revokedAt: null }, { revokedAt: new Date() });
  await user.populate('accessRole', 'name');
  res.json({ message: 'Role assigned. The administrator must sign in again.', user: userResponse(user) });
}

export async function setAdminStatus(req, res) {
  const parsed = statusSchema.safeParse(req.body);
  if (!parsed.success) return res.status(422).json({ message: 'Active status is required' });
  const user = await User.findOne({ _id: req.params.userId, role: 'admin' });
  if (!user) return res.status(404).json({ message: 'Administrator not found' });
  user.active = parsed.data.active; await user.save();
  if (!user.active) await AuthSession.updateMany({ user: user.id, revokedAt: null }, { revokedAt: new Date() });
  await user.populate('accessRole', 'name');
  res.json({ message: user.active ? 'Administrator activated' : 'Administrator deactivated', user: userResponse(user) });
}

export async function listRoles(req, res) {
  const roles = await AccessRole.find().sort({ name: 1 });
  const counts = await User.aggregate([{ $match: { role: 'admin', accessRole: { $ne: null } } }, { $group: { _id: '$accessRole', count: { $sum: 1 } } }]);
  const countMap = new Map(counts.map((item) => [String(item._id), item.count]));
  res.json({ roles: roles.map((role) => roleResponse(role, countMap.get(role.id) || 0)), permissions: permissionValues });
}

export async function createRole(req, res) {
  const parsed = roleSchema.safeParse(req.body);
  if (!parsed.success) return res.status(422).json({ message: parsed.error.issues[0].message });
  if (await AccessRole.exists({ name: new RegExp(`^${parsed.data.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') })) return res.status(409).json({ message: 'A role with this name already exists' });
  const role = await AccessRole.create({ ...parsed.data, createdBy: req.user.id });
  res.status(201).json({ message: 'Access role created', role: roleResponse(role) });
}

export async function updateRole(req, res) {
  const parsed = roleSchema.safeParse(req.body);
  if (!parsed.success) return res.status(422).json({ message: parsed.error.issues[0].message });
  const role = await AccessRole.findById(req.params.roleId);
  if (!role) return res.status(404).json({ message: 'Access role not found' });
  const duplicate = await AccessRole.exists({ _id: { $ne: role.id }, name: new RegExp(`^${parsed.data.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') });
  if (duplicate) return res.status(409).json({ message: 'A role with this name already exists' });
  role.name = parsed.data.name; role.description = parsed.data.description; role.permissions = parsed.data.permissions; await role.save();
  const assigned = await User.find({ role: 'admin', accessRole: role.id });
  await User.updateMany({ role: 'admin', accessRole: role.id }, { permissions: role.permissions, accessRoleName: role.name });
  if (assigned.length) await AuthSession.updateMany({ user: { $in: assigned.map((user) => user.id) }, revokedAt: null }, { revokedAt: new Date() });
  res.json({ message: 'Role updated. Assigned administrators must sign in again.', role: roleResponse(role, assigned.length) });
}

export async function setRoleStatus(req, res) {
  const parsed = statusSchema.safeParse(req.body);
  if (!parsed.success) return res.status(422).json({ message: 'Active status is required' });
  const role = await AccessRole.findById(req.params.roleId);
  if (!role) return res.status(404).json({ message: 'Access role not found' });
  if (!parsed.data.active && await User.exists({ role: 'admin', accessRole: role.id, active: true })) return res.status(409).json({ message: 'Reassign or deactivate administrators before disabling this role' });
  role.active = parsed.data.active; await role.save();
  res.json({ message: role.active ? 'Role activated' : 'Role disabled', role: roleResponse(role) });
}
