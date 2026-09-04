import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async (): Promise<void> => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    const conn = await mongoose.connect(mongoUri, {
      bufferCommands: false,
    });
    isConnected = !!conn.connections[0].readyState;
    console.log(`[MongoDB] Connected successfully to ${mongoose.connection.host}`);
  } catch (error) {
    console.error('[MongoDB] Connection error:', error);
    // In serverless environment, do not process.exit(1) to allow retries on subsequent invocations
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};
