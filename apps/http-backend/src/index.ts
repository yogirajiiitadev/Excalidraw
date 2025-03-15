import express from "express";
import { userAuth } from "./middlewares/userAuth";
import { JWT_SECRET } from "@repo/backend-common/config";
import jwt from "jsonwebtoken";
import { CreateUserSchema, CreateSignInSchema, CreateRoomSchema } from "@repo/common/types";

const app = express();
app.use(express.json());

app.post("/signup", (req, res) => {
    const data = CreateUserSchema.safeParse(req.body);
    if (!data.success) {
        res.status(400).json({ error: data.error });
        return;
    }
  res.send("Signup route works!");
});

app.post("/signin", (req, res) => {
    const data = CreateSignInSchema.safeParse(req.body);
    if (!data.success) {
        res.status(400).json({ error: data.error });
        return;
    }
    const userId = 1;
    const token = jwt.sign({
        userId
    }, JWT_SECRET)
    res.json({token});
  });

// Use `userAuth` middleware only where required
app.post("/create-room", userAuth, (req, res) => {
    const data = CreateRoomSchema.safeParse(req.body);
    if (!data.success) {
        res.status(400).json({ error: data.error });
        return;
    }
  res.json({
    roomId: 123,
    message: "Room created successfully"
  })
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
