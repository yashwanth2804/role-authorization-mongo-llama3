import express from "express";
import { RoleAuthMongo } from "role-auth-mongo-llama3-code";

const app = express();
app.use(express.json());
const roleAuthMongo = new RoleAuthMongo({
  db: {
    connectionString: "mongodb://localhost:27017/rbac-test",
  },
});

const roleService = roleAuthMongo.getRoleService();
const userService = roleAuthMongo.getUserService();

const accessControlList = {
  "/protected-resource": ["admin"],
  "/user-protected-resource": ["admin", "user"],
  "/guest-resource": ["admin", "user", "guest"],
  "/editor-resource": ["admin", "editor"],
};

// Middleware to check if a role exists
async function roleExists(req, res, next) {
  const roleName = req.params.roleName;
  try {
    const role = await roleService.getRole(roleName);
    if (!role) {
      return res.status(404).json({ error: `Role ${roleName} does not exist` });
    }
    next();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Middleware to check if a user is authorized to access a resource
async function isAuthorized(req, res, next) {
  const userId = req.headers["x-user-id"];
  const path = req.path;
  const resource = req.params.resource;

  // Get the user's roles from the database
  const user = await userService.getUser(userId);
  if (!user) {
    return res.status(404).json({ error: `User ${userId} does not exist` });
  }
  const requiredRoles = accessControlList[path];

  try {
    const user = await userService.getUser(userId);
    if (!user) {
      return res.status(404).json({ error: `User ${userId} does not exist` });
    }

    const userRoles = user.roles;
    const hasAccess = requiredRoles.some((role) => userRoles.includes(role));
    if (!hasAccess) {
      return res.status(403).json({ error: `User ${userId} does not have access to ${path}` });
    }
    next();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// API endpoint to create a new user
app.post("/users", async (req, res) => {
  const { userId, email, roles } = req.body;
  try {
    const user = await userService.createUser(userId, email, roles);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API endpoint to create a new role
app.post("/roles", async (req, res) => {
  const { roleName, description, permissions } = req.body;
  try {
    const role = await roleService.createRole(roleName, description, permissions);
    res.status(201).json(role);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API endpoint to access a protected resource
app.get("/protected-resource", isAuthorized, async (req, res) => {
  res.status(200).json({ message: "Authorized to access protected resource" });
});

// create endpoint for user protected resource
app.get("/user-protected-resource", isAuthorized, async (req, res) => {
  res.status(200).json({ message: "Authorized to access user protected resource" });
});
// editor-resource
app.get("/editor-resource", isAuthorized, async (req, res) => {
  res.status(200).json({ message: "Authorized to access editor resource" });
});

// API endpoint to check if a role exists
app.get("/roles/:roleName", roleExists, async (req, res) => {
  res.status(200).json({ message: `Role ${req.params.roleName} exists` });
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
