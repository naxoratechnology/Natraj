import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';
import { User } from '../models/User.js';

const adminPermissions = ['dashboard', 'dealers', 'customers', 'applications', 'manual_processing', 'finance_partners', 'commissions', 'reports', 'notifications', 'support', 'audit_logs'];
const adminEmail = 'admin@natrajmobile.com';

export async function seedAdmin({ syncCredentials = false } = {}) {
  const indexName = 'dealerProfile.registrationReference_1';
  const indexes = await User.collection.indexes();
  const registrationIndex = indexes.find((index) => index.name === indexName);
  if (registrationIndex && !registrationIndex.sparse) await User.collection.dropIndex(indexName);
  if (!registrationIndex?.sparse) await User.collection.createIndex({ 'dealerProfile.registrationReference': 1 }, { name: indexName, unique: true, sparse: true });
  const existing = await User.findOne({ email: adminEmail }).select('+passwordHash');
  if (existing && existing.role !== 'admin') throw new Error(`Cannot seed admin: ${adminEmail} belongs to a ${existing.role} account`);
  if (!existing) {
    await User.create({
      name: 'Natraj Operations Admin',
      email: adminEmail,
      passwordHash: await bcrypt.hash(env.ADMIN_PASSWORD, 12),
      role: 'admin',
      accessRole: null,
      accessRoleName: 'Admin',
      permissions: adminPermissions,
      active: true
    });
    console.log(`Admin account created: ${adminEmail}`);
    return;
  }
  existing.name = 'Natraj Operations Admin';
  existing.role = 'admin';
  existing.accessRole = null;
  existing.accessRoleName = 'Admin';
  existing.permissions = adminPermissions;
  existing.active = true;
  if (syncCredentials) existing.passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 12);
  await existing.save();
  console.log(`Admin account updated: ${adminEmail}`);
}
