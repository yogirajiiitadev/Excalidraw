// server.js or routes/ai.js

import express from "express";
// import { userAuth } from "./middlewares/userAuth";
import { JWT_SECRET } from "@repo/backend-common/config";
import jwt from "jsonwebtoken";
import { CreateUserSchema, CreateSignInSchema, CreateRoomSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
import cors from "cors";
import { config } from "dotenv";
// @ts-ignore
import createDrawingAgent from "./langchain-agent.js";
// import createDrawingAgent2 from "./langchain-gemini";
config();
const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/generate-drawing", async (req, res) => {
  const { prompt, userId, roomId } = req.body;
  console.log("API Key:", process.env.AZURE_OPENAI_API_KEY?.slice(0, 5), "...");
  console.log("Endpoint:", process.env.AZURE_OPENAI_ENDPOINT);
  console.log("Deployment:", process.env.AZURE_OPENAI_DEPLOYMENT_NAME);
  console.log("Version:", process.env.AZURE_OPENAI_API_VERSION);
  try {
    const response: any = await createDrawingAgent(prompt);
    // const response: any = await createDrawingAgent2(prompt);
    console.log("Response:", response);
    const parsed = await response
      .replace(/```json\s*/, '')   // remove ```json
      .replace(/```$/, '')         // remove closing ```
      .replace(/,\s*]/, ']');      // remove trailing comma before ]
    // const parsed = JSON.parse(response);
    // const parsed: any = [];
    console.log("Parsed:", parsed);
    const parsedShapes = JSON.parse(parsed);
    const withMetadata = parsedShapes?.map((shape: any, i: any) => ({
      id: Date.now() + i,
      message: JSON.stringify(shape),
      userId,
      roomId,
    }));

    res.json(withMetadata);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Failed to generate shapes due to ${err}.` });
  }
});

app.listen(3003, () => {
  console.log("AI agent server listening on port 3003");
});
