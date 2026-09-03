import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/eventhub';
    await mongoose.connect(mongoUri);
    console.log(`[MongoDB] Connected successfully to ${mongoose.connection.host}`);
  } catch (error) {
    console.error('[MongoDB] Connection error:', error);
    process.exit(1);
  }
};
