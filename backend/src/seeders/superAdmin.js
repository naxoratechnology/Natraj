import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { seedSuperAdmin } from './superAdmin.service.js';

try {
  await connectDatabase();
  await seedSuperAdmin({ syncCredentials: true });
  await disconnectDatabase();
  process.exit(0);
} catch (error) {
  console.error(`Super Admin seeding failed: ${error.message}`);
  await disconnectDatabase().catch(() => undefined);
  process.exit(1);
}
