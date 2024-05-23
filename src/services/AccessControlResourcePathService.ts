import { AccessControlResourcePathModel } from '../models/AccessControlResourcePath';
import { AccessControlResourcePath } from '../types/AccessControlResourcePath';
import { RoleService } from './RoleService';

export class AccessControlResourcePathService {
  async createAccessControlResourcePath(path: string, roles: string[]): Promise<AccessControlResourcePath> {
    const accessControlResourcePath = new AccessControlResourcePathModel({ path, roles });
    return accessControlResourcePath.save();
  }

  async getAccessControlResourcePath(path: string): Promise<AccessControlResourcePath | null> {
    return AccessControlResourcePathModel.findOne({ path });
  }

  async updateAccessControlResourcePath(path: string, updates: Partial<AccessControlResourcePath>): Promise<AccessControlResourcePath | null> {
    return AccessControlResourcePathModel.findOneAndUpdate({ path }, updates, { new: true });
  }

  async deleteAccessControlResourcePath(path: string): Promise<void> {
    await AccessControlResourcePathModel.findOneAndRemove({ path });
  }

  async checkAccessControlResourcePath(path: string, role: string): Promise<boolean> {
    const accessControlResourcePath = await this.getAccessControlResourcePath(path);
    if (!accessControlResourcePath) return false;
    return accessControlResourcePath.roles.includes(role);
  }
}