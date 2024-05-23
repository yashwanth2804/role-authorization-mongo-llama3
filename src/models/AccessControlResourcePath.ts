import { Document, model, Schema } from 'mongoose';

export interface AccessControlResourcePath {
  _id: string;
  path: string;
  roles: string[];
}

const accessControlResourcePathSchema = new Schema<AccessControlResourcePath>({
  path: { type: String, required: true, unique: true },
  roles: [{ type: String, ref: 'Role' }]
});

export const AccessControlResourcePathModel = model<AccessControlResourcePath>('AccessControlResourcePath', accessControlResourcePathSchema);