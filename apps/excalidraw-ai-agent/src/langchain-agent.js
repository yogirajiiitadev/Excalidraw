import dotenv from "dotenv";
import { OpenAI } from "openai";
dotenv.config();

// 1. Custom tool for formatting drawing instructions
const jsonFormatterResponse = `Just output a JSON array of shape objects based on user instructions. Each object must follow one of the following formats:
[
  {
    "currentShape": {
      "type": "circle",
      "radius": 100,
      "centerX": 500,
      "centerY": 200
    }
  },
  {
    "currentShape": {
      "type": "rect",
      "x": 300,
      "y": 100,
      "width": 200,
      "height": 100
    }
  },
  {
    "currentShape": {
      "type": "text",
      "startX": 400,
      "startY": 250,
      "inputText": "Hello World",
      "font": "20px Arial",
      "color": "black"
    }
  },
  {
    "currentShape": {
      "type": "pencil",
      "startX": 100,
      "startY": 100,  
      "endX": 200,
      "endY": 200
    }
  }
]
Ensure that the JSON is valid and properly formatted. Only output the JSON array of shape objects.`;

export default async function createDrawingAgent(inputText) {
  // Get environment variables
  const endpoint = "https://aidatameshopenai.openai.azure.com/";
  const deployment = process.env.DEPLOYMENT_NAME || "gpt-35-turbo-16k";
  const subscriptionKey = process.env.AZURE_OPENAI_API_KEY;

  // Check if API key is available
  if (!subscriptionKey || subscriptionKey === "REPLACE_WITH_YOUR_KEY_VALUE_HERE") {
    throw new Error("Missing AZURE_OPENAI_API_KEY environment variable");
  }

  console.log("Endpoint:", endpoint);
  console.log("Deployment:", deployment);
  console.log("API Key:", subscriptionKey.slice(0, 5), "...");

  // Initialize Azure OpenAI Service client
  const client = new OpenAI({
    apiKey: subscriptionKey,
    baseURL: endpoint,
    defaultQuery: { "api-version": "2024-05-01-preview" },
    defaultHeaders: { "api-key": subscriptionKey }
  });

  try {
    // Prepare the system message with drawing instructions
    const messages = [
      {
        role: "system",
        content: `You are an agent that helps convert drawing instructions into shape objects. 
        You have access to a ShapeFormatter tool that helps you format shape JSON objects.
        Always think step by step and provide only the final JSON array of shapes as your answer.`
      },
      {
        role: "user",
        content: `Convert this drawing description into shapes: ${inputText}`
      },
      {
        role: "system",
        content: `Tool information - ShapeFormatter: ${jsonFormatterResponse}`
      }
    ];

    // Generate the completion
    const completion = await client.chat.completions.create({
      model: deployment,
      messages: messages,
      max_tokens: 800,
      temperature: 0.3,
      top_p: 0.95,
      frequency_penalty: 0,
      presence_penalty: 0,
      stop: null,
      stream: false
    });

    console.log("Response received:", completion);
    
    // Extract the generated content from the response
    const responseText = completion.choices[0].message.content;
    
    // Try to extract just the JSON part if there's any extra text
    try {
      // Find JSON array in the response
      const jsonMatch = responseText.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (jsonMatch) {
        return jsonMatch[0];
      }
      return responseText;
    } catch (parseError) {
      console.error("Error parsing response:", parseError);
      return responseText;
    }
  } catch (error) {
    console.error("Azure OpenAI API error:", error);
    throw new Error(`Drawing agent error: ${error.message}`);
  }
}