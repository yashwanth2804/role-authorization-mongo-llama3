import {  RoleModel } from '../models/Role';
import { Role } from '../types/Role';
export class RoleService {
  async createRole(name: string, description: string, permissions: string[]): Promise<Role> {
    const role = new RoleModel({ name, description, permissions });
    return role.save();
  }

  async getRole(name: string): Promise<Role | null> {
    return RoleModel.findOne({ name });
  }

  async updateRole(name: string, updates: Partial<Role>): Promise<Role | null> {
    return RoleModel.findOneAndUpdate({ name }, updates, { new: true });
  }

  async deleteRole(name: string): Promise<void> {
    await RoleModel.findOneAndRemove({ name });
  }
}