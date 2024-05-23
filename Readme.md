# Role-Authorization-Mongo-Llama3

Role-based authorization library for Node.js using MongoDB generated by llama3.

## Installation

```bash
npm i role-authorization-mongo-llama3
```

## Usage

First, import the necessary modules and initialize the `RoleAuthMongo` object:

```javascript
import express from "express";
import { RoleAuthMongo } from "role-authorization-mongo-llama3";

const app = express();
app.use(express.json());

const roleAuthMongo = new RoleAuthMongo({
  db: {
    connectionString: "mongodb://localhost:27017/rbac-test",
  },
});

const roleService = roleAuthMongo.getRoleService();
const userService = roleAuthMongo.getUserService();
```

Then, define your access control list:

```javascript
const accessControlList = {
  "/protected-resource": ["admin"],
  "/user-protected-resource": ["admin", "user"],
  "/guest-resource": ["admin", "user", "guest"],
  "/editor-resource": ["admin", "editor"],
};
```

Next, create middleware to check if a role exists and if a user is authorized:

```javascript
async function roleExists(req, res, next) {
  // Implementation here
}

async function isAuthorized(req, res, next) {
  // Implementation here
}
```

Finally, define your API endpoints:

```javascript
app.post("/users", async (req, res) => {
  const { userId, email, roles } = req.body;
  try {
    const user = await userService.createUser(userId, email, roles);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/roles", async (req, res) => {
  const { roleName, description, permissions } = req.body;
  try {
    const role = await roleService.createRole(roleName, description, permissions);
    res.status(201).json(role);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/protected-resource", isAuthorized, async (req, res) => {
  res.status(200).json({ message: "Authorized to access protected resource" });
});

app.get("/user-protected-resource", isAuthorized, async (req, res) => {
  res.status(200).json({ message: "Authorized to access user protected resource" });
});

app.get("/editor-resource", isAuthorized, async (req, res) => {
  res.status(200).json({ message: "Authorized to access editor resource" });
});

app.get("/roles/:roleName", roleExists, async (req, res) => {
  res.status(200).json({ message: `Role ${req.params.roleName} exists` });
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
```

## License

This project is licensed under the MIT License.