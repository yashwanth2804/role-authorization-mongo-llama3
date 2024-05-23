import { UserModel } from '../models/User';
import { User } from '../types/User'; 

export class UserService {
  async createUser(username: string, email: string, roles: string[]): Promise<User> {
    const user = new UserModel({ username, email, roles });
    return user.save();
  }

  async getUser(username: string): Promise<User | null> {
    return UserModel.findOne({ username });
  }

  async updateUser(username: string, updates: Partial<User>): Promise<User | null> {
    return UserModel.findOneAndUpdate({ username }, updates, { new: true });
  }

  async deleteUser(username: string): Promise<void> {
    await UserModel.findOneAndRemove({ username });
  }

  async checkRole(username: string, role: string): Promise<boolean> {
    const user = await this.getUser(username);
    if (!user) return false;
    return user.roles.includes(role);
  }
}