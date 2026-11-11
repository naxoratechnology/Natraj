import { app } from './app.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { env } from './config/env.js';
import { seedSuperAdmin } from './seeders/superAdmin.service.js';

await connectDatabase();
await seedSuperAdmin();
const server = app.listen(env.PORT, () => console.log(`API listening on http://localhost:${env.PORT}`));

async function shutdown(signal) {
  console.log(`${signal} received; shutting down`);
  server.close(async () => { await disconnectDatabase(); process.exit(0); });
}
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
