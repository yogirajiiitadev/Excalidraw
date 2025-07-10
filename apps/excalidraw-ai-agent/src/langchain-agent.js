import dotenv from "dotenv";
dotenv.config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
    

export default async function createDrawingAgent(inputText) {
  console.log("Input Text:", inputText);
  
  const model = new ChatGoogleGenerativeAI({
    apiKey: process.env.OPENAI_API_KEY,
    model: "gpt-3.5-turbo",
    maxTokens: 1000,
    temperature: 0.3,
  });

  const prompt = ChatPromptTemplate.fromTemplate(`
      Hello, Describe Rohit Sharma the Indian cricketer in 5 sentences
  `);

  const result = model.invoke({
    prompt: prompt,
  });
  return result.content;
}
