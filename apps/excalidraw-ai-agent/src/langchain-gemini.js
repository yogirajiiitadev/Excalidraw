import dotenv from "dotenv";
dotenv.config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

// 1. Gemini model setup
const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GEMINI_API_KEY,
  model: "gemini-2.0-flash",
  temperature: 0.3,
});

// 2. Prompt Template
const prompt = ChatPromptTemplate.fromTemplate(`
    You are an expert at converting drawing descriptions into shape objects.
    
    Convert the following drawing instruction into a **valid JSON array** of shape objects. Only include the shapes mentioned and do not add any extra explanation.
    
    Valid shape formats include:
    - Circle: {{ "type": "circle", "radius": number, "centerX": number, "centerY": number }}
    - Rectangle: {{ "type": "rect", "x": number, "y": number, "width": number, "height": number }}
    - Text: {{ "type": "text", "startX": number, "startY": number, "inputText": string, "font": string, "color": string }}
    - Pencil: {{ "type": "pencil", "startX": number, "startY": number, "endX": number, "endY": number }}
    
    Do not add any extra text. Only return the JSON.
    
    Instruction:
    {input}
`);
    

// 3. Function to call the model
export default async function createDrawingAgent2(inputText) {
  const chain = prompt.pipe(model);

  const result = await chain.invoke({
    input: inputText,
  });

  return result.content; // Gemini returns the content directly
}
