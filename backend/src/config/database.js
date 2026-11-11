import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDatabase() {
  let connectionUri = env.MONGODB_URI;

  // Bypass SRV only when the network blocks SRV but resolves regular hostnames.
  if (connectionUri.startsWith('mongodb+srv://') && env.MONGODB_HOSTS && env.MONGODB_REPLICA_SET) {
    const parsed = new URL(connectionUri);
    const database = parsed.pathname.replace(/^\//, '') || 'natraj_mobile';
    connectionUri = `mongodb://${parsed.username}:${parsed.password}@${env.MONGODB_HOSTS}/${database}` +
      `?tls=true&replicaSet=${encodeURIComponent(env.MONGODB_REPLICA_SET)}&authSource=admin&retryWrites=true&w=majority`;
  }

  await mongoose.connect(connectionUri, { serverSelectionTimeoutMS: 15000 });
  console.log('MongoDB connected');
}
export const disconnectDatabase = () => mongoose.disconnect();
