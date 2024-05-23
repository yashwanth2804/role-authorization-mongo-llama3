import { RoleService } from './services/RoleService';
import { UserService } from './services/UserService';
import { DbOptions, connectDB, disconnectDB } from './utils/db';

export interface RoleAuthMongoOptions {
  db: DbOptions;
}

export class RoleAuthMongo {
  private roleService: RoleService;
  private userService: UserService;

  constructor(options: RoleAuthMongoOptions) {
    this.roleService = new RoleService();
    this.userService = new UserService();
    connectDB(options.db);
  }

  async close(): Promise<void> {
    await disconnectDB();
  }

  getRoleService(): RoleService {
    return this.roleService;
  }

  getUserService(): UserService {
    return this.userService;
  }
}