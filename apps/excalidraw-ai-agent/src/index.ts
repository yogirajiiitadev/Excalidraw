// server.js or routes/ai.js

import express from "express";
import { userAuth } from "./middlewares/userAuth";
import cors from "cors";
import { config } from "dotenv";
// @ts-ignore
import { DrawingBotSession } from "./langchain-agent.js";
import { createSession, getSession, deleteSession } from "./sessions";
import { v4 as uuidv4 } from "uuid";
import { Request, Response } from "express";
import { ShapeSchema } from "@repo/common/types";
config();
const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://scriblio.online"
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());

// removed middleware for now.
app.post("/generate-drawing/init", /*userAuth, */async (req, res) => {
  const { prompt } = req.body;

  const sessionId = uuidv4();
  const bot = new DrawingBotSession(prompt);
  const question = await bot.askNextClarifyingQuestion();

  createSession(sessionId, bot);

  res.json({
    sessionId,
    nextQuestion: question, // if null, go to summarize immediately
  });
});

// @ts-ignore
app.post("/generate-drawing/clarify", /*userAuth, */ async (req: Request, res: Response) => {
  const { sessionId, answer } = req.body;
  const bot = getSession(sessionId);

  if (!bot) {
    return res.status(404).json({ error: "Session not found." });
  }

  bot.recordUserAnswer(answer);
  let nextQuestion = null;
  if(bot.questionsAsked < 1) {
    nextQuestion = await bot.askNextClarifyingQuestion();
  }

  if (!nextQuestion) {
    const finalDrawing = await bot.getFinalDrawing();
    const validatedDrawing = ShapeSchema.safeParse(finalDrawing);
    deleteSession(sessionId);
    return res.json({ drawing: validatedDrawing.success ? validatedDrawing.data : "Improper format of drawing returned" });
  }

  res.json({ nextQuestion });
});


app.listen(3003, () => {
  console.log("AI agent server listening on port 3003");
});
