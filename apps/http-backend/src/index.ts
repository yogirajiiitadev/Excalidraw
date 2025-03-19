import express from "express";
import { userAuth } from "./middlewares/userAuth";
import { JWT_SECRET } from "@repo/backend-common/config";
import jwt from "jsonwebtoken";
import { CreateUserSchema, CreateSignInSchema, CreateRoomSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
app.post("/signup", async(req, res) => {
    const parsedData = CreateUserSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({ error: parsedData.error });
        return;
    }
    try{
      const user = await prismaClient.user.create({
        data:{
          email: parsedData.data.username,
          // todo: hash password
          password: parsedData.data.password,
          name: parsedData.data.name,
        }
      });
      res.json({
        userId: user.id
      });
    }
    catch (e) {
        res.status(411).json({ error: "User already exists with this username" });
    }
});

app.post("/signin", async (req, res) => {
    const parsedData = CreateSignInSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({ error: parsedData.error });
        return;
    }
    // todo: compare to a hashed password
    const user = await prismaClient.user.findFirst({
      where: {
        email: parsedData.data.username,
        password: parsedData.data.password,
      }});
    if (!user) {
        res.status(401).json({ error: "Invalid credentials or User not available" });
        return;
    }
    const token = jwt.sign({
        userId: user?.id
    }, JWT_SECRET)
    res.json({token});
  });

// Use `userAuth` middleware only where required
app.post("/create-room", userAuth,async (req, res) => {
    const parsedData = CreateRoomSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({ error: parsedData.error });
        return;
    }
    // @ts-ignore
    const userId = req?.userId;
    if (!userId) {
      res.status(400).json({ error: "User ID is required" });
    }

    try{
      const room = await prismaClient.room.create({
        data: {
            slug: parsedData.data.name,
            adminId: userId
        }
      });
      res.json({
        roomId: room.id,
        message: "Room created successfully"
      });
    }
    catch(e: any){
      res.status(411).json({ error:"Slug name should be unique!" });
    }
});

app.get('/chats/:roomId', async (req, res) =>{
    const roomId = Number(req.params.roomId);
    console.log("Chats requested for room: ", roomId);
    const chats = await prismaClient.chat.findMany({
      where: {
        roomId
      },
      orderBy: {
        id: "desc"
      },
      take: 50
    });
    res.json({messages: chats});
});

app.get("/room/:slug", async (req, res) => {
  const slug = req.params.slug;
  const room = await prismaClient.room.findFirst({
    where: {
      slug
    }
  });
  res.json({
    room
  })
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
