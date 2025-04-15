import { ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
 } from "@langchain/core/prompts";
 import { PromptTemplate } from "@langchain/core/prompts";
import dotenv from "dotenv";
dotenv.config();
import { AgentExecutor, createReactAgent } from "langchain/agents";
import { DynamicTool } from "langchain/tools";
import { ChatOpenAI } from "@langchain/openai";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";

// 1. Prompt
const template = `You are an agent that helps convert drawing instructions into shape objects. Available tools:
{tools}

Answer the following questions as best you can. You have access to the following tools:

{tools}

Use the following format:

Question: the input question you must answer  
Thought: you should always think about what to do  
Action: the action to take, should be one of [{tool_names}]  
Action Input: the input to the action  
Observation: the result of the action  
... (this Thought/Action/Action Input/Observation can repeat N times)  
Thought: I now know the final answer  
Final Answer: the final answer to the original input question

Begin!

Question: {input}  
{agent_scratchpad}`;

const prompt = PromptTemplate.fromTemplate(template);


// 2. Azure LLM using LangChain's ChatOpenAI with Azure configuration
const llm = new ChatOpenAI({
  temperature: 0.3,
  openAIApiKey: process.env.AZURE_OPENAI_API_KEY,
  modelName: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
  openAIApiType: "azure",
  azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION,
  azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
  azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_ENDPOINT,
  azureOpenAIBasePath: `https://${process.env.AZURE_OPENAI_ENDPOINT}.openai.azure.com`,
});

// 3. Custom tool for formatting drawing instructions
const jsonFormatterTool = new DynamicTool({
  name: "ShapeFormatter",
  description:
    "Use this tool to convert user's drawing instructions into a JSON array of shape objects. Only output JSON, and each object must follow shape format with fields like type, coordinates, radius, inputText, etc.",
  func: async (input) => {
    return `Just output a JSON array of shape objects based on user instructions. Each object must follow one of the following formats:
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
    Ensure that the JSON is valid and properly formatted. Do not include any additional text or explanations or trailing or starting comma or other symbols just a stringified array . Only output the JSON array of shape objects. Do not include any other shapes or types. The JSON should only contain the shapes mentioned in the instruction. Ensure correct field names and types.
    Only include the shapes mentioned in the instruction and ensure correct field names and types.`;
  },
});

// 4. Agent setup
export default async function createDrawingAgent(inputText) {
  console.log("API Key:", process.env.AZURE_OPENAI_API_KEY?.slice(0, 5), "...");
  console.log("Endpoint:", process.env.AZURE_OPENAI_ENDPOINT);
  console.log("Deployment:", process.env.AZURE_OPENAI_DEPLOYMENT_NAME);
  console.log("Version:", process.env.AZURE_OPENAI_API_VERSION);

  const agent = await createReactAgent({
    llm,
    tools: [jsonFormatterTool],
    prompt,
  });

  const executor = AgentExecutor.fromAgentAndTools({
    agent,
    tools: [jsonFormatterTool],
    verbose: true,
  });

  const result = await executor.invoke({
    input: `Convert this drawing description into shapes: ${inputText}`,
  });

  return result.output;
}
