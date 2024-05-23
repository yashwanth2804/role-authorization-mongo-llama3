import { AccessControlResourcePathService } from './services/AccessControlResourcePathService';
import { RoleService } from './services/RoleService';
import { UserService } from './services/UserService';
import { DbOptions, connectDB, disconnectDB } from './utils/db';
import { Request, Response, NextFunction } from 'express';

export interface RoleAuthMongoOptions {
  db: DbOptions;
}

export class RoleAuthMongo {
  private roleService: RoleService;
  private userService: UserService;
  private accessControlResourcePathService: AccessControlResourcePathService;

  constructor(options: RoleAuthMongoOptions) {
    this.roleService = new RoleService();
    this.userService = new UserService();
    this.accessControlResourcePathService = new AccessControlResourcePathService();
    this.isAuthorized = this.isAuthorized.bind(this);
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

  getAccessControlResourcePathService(): AccessControlResourcePathService {
    return this.accessControlResourcePathService;
  }


  async isAuthorized(req: Request, res: Response, next: NextFunction) {
    const userId = req.headers["x-user-id"] as string;
    const path = req.path;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized, need to pass x-user-id" });
    }

    try {
      const user = await this.userService.getUser(userId);
      if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const accessControlResourcePath = await this.accessControlResourcePathService.getAccessControlResourcePath(path);
      if (!accessControlResourcePath) {
        return res.status(403).json({ error: "Forbidden" });
      }

      if (!user.roles.some((role) => accessControlResourcePath.roles.includes(role))) {
        return res.status(403).json({ error: "Forbidden" });
      }

      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}