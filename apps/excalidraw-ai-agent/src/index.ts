// server.js or routes/ai.js

import express from "express";
import { userAuth } from "./middlewares/userAuth";
import { JWT_SECRET } from "@repo/backend-common/config";
import jwt from "jsonwebtoken";
import { CreateUserSchema, CreateSignInSchema, CreateRoomSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
import cors from "cors";
import { config } from "dotenv";
// @ts-ignore
import createDrawingAgent from "./langchain-agent.js";
config();
const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/generate-drawing", userAuth, async (req, res) => {
  const { prompt, userId, roomId } = req.body;
  try {
    const response: any = await createDrawingAgent(prompt);
    res.send(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Failed to generate shapes due to ${err}.` });
  }
});

app.listen(3003, () => {
  console.log("AI agent server listening on port 3003");
});
