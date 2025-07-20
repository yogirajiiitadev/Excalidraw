import dotenv from "dotenv";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import {ShapeSchema} from "@repo/common/types";
dotenv.config(); 
 
const parser = StructuredOutputParser.fromZodSchema(ShapeSchema);
 
const clarificationPrompt = ChatPromptTemplate.fromMessages([
  ["system",
    `You are a helpful assistant and a drawing expert clarifying all the questions before actually drawing based on user entered prompt.
    Generate some genuine and variety of questions based on chat_history provided for the user to answer.
    Give only one question at a time.`],
  new MessagesPlaceholder("chat_history")
]);
 
const summaryPrompt = ChatPromptTemplate.fromMessages([
  ["system", `You are a drawing/ diagram expert according to format_instructions mentioned.
    Generate an extensive drawing based on the user's answers to the questions asked and initial prompt.
    Use all possible components. You can use all the shapes and each shape any number of times.
    Note that the drawing should contain atleast 10 shapes and at max 50 shapes.
    Also note that the text color should be white by default.
    Also the co-ordinates of the drawing should be such that they can be drawn on fixed sized HTML canvas window.
    Make sure that the shapes are rendered in the center of window.`],
  new MessagesPlaceholder("chat_history"),
  ["human", "{format_instructions}"]
]);
 
// Why async await?
// chain.invoke() runs asynchronously so returns a Promise. response would be Promise { <pending> } which would be not useful.
// Using async/await allows us to wait for the response to be ready before proceeding.
// Using async only would return an unresolved Promise, which is not useful in this context.
// Using await only would not work outside an async function, so we need to wrap it in one.

export class DrawingBotSession {
  chatHistory = [];
  questionsAsked = 0;
  model = new ChatOpenAI({ temperature: 0.8, modelName: "gpt-4" });

  constructor(initialPrompt) {
    this.chatHistory.push({ role: "human", content: `Here are the drawing instructions:\n${initialPrompt}` });
  }

  async askNextClarifyingQuestion() {
    const chain = clarificationPrompt.pipe(this.model);
    const response = await chain.invoke({ chat_history: this.chatHistory });

    const question = response.content.trim();

    this.chatHistory.push({ role: "assistant", content: question });
    this.questionsAsked++;
    console.log("Number of questions asked to this bot so far: ", this.questionsAsked);
    return question;
  }

  recordUserAnswer(answer) {
    this.chatHistory.push({ role: "user", content: answer });
  }

  async getFinalDrawing() {
    const finalChain = summaryPrompt.pipe(this.model).pipe(parser);
    console.log("Parser instructions constructed are as follows: ", parser.getFormatInstructions());
    try{
      const res = await finalChain.invoke({
        chat_history: this.chatHistory,
        format_instructions: parser.getFormatInstructions()
      });
      console.log("res of drawing received from llm: ", res);
      return res;
    }
    catch(e){
      console.log("Error occured while creating the drawing!", e);
    }
  }
}