import { Document, model, Schema } from 'mongoose';

export interface User {
  _id: string;
  username: string;
  email: string;
  roles: string[];
}

const userSchema = new Schema<User>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  roles: [{ type: String, ref: 'Role' }]
});

export const UserModel = model<User>('User', userSchema);