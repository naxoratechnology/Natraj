import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { seedAdmin } from './admin.service.js';

try {
  await connectDatabase();
  await seedAdmin({ syncCredentials: true });
  await disconnectDatabase();
  process.exit(0);
} catch (error) {
  console.error(`Admin seeding failed: ${error.message}`);
  await disconnectDatabase().catch(() => undefined);
  process.exit(1);
}
