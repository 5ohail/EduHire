
import mongoose from 'mongoose';

export async function connectDatabase(uri: string): Promise<void> {
  if (!uri) {
    throw new Error('MONGODB_URI is not defined');
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
}


