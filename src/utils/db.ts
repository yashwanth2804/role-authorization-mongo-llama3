import mongoose from 'mongoose';

export interface DbOptions {
  connectionString: string;
} 

export async function connectDB(options: DbOptions): Promise<void> {
  await mongoose.connect(options.connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
}


export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
}