import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';
import { User } from '../models/User.js';

export async function seedSuperAdmin({ syncCredentials = false } = {}) {
  const credentials = {
    name: env.SUPER_ADMIN_NAME || env.ADMIN_NAME,
    email: env.SUPER_ADMIN_EMAIL || env.ADMIN_EMAIL,
    password: env.SUPER_ADMIN_PASSWORD || env.ADMIN_PASSWORD
  };
  const email = credentials.email.toLowerCase();
  const existing = await User.findOne({ email }).select('+passwordHash');
  if (existing && existing.role === 'dealer') throw new Error(`Cannot seed super admin: ${email} belongs to a dealer account`);
  if (!existing) {
    await User.create({ name: credentials.name, email, passwordHash: await bcrypt.hash(credentials.password, 12), role: 'super_admin', active: true });
    console.log(`Super admin account created: ${email}`);
    return;
  }
  existing.role = 'super_admin';
  if (syncCredentials) {
    existing.name = credentials.name;
    existing.passwordHash = await bcrypt.hash(credentials.password, 12);
    existing.active = true;
  }
  await existing.save();
  console.log(`Super admin account updated: ${email}`);
}

