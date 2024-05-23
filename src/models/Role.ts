import { Document, model, Schema } from 'mongoose';

export interface Role {
  _id: string;
  name: string;
  description: string;
  permissions: string[];
}

const roleSchema = new Schema<Role>({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  permissions: [{ type: String }]
});

export const RoleModel = model<Role>('Role', roleSchema);