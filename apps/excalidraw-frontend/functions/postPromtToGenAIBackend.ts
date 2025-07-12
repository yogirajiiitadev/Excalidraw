import { HTTP_GEN_AI } from "@/config";
import axios from "axios";

export const postPromptToGenAIBackend = async(inputValue: string, isInitialPrompt: boolean, aiSessionId:string, setAiSessionId: any) => {
    try{
        const token: string = localStorage.getItem("Authorization") ?? "";
        if(isInitialPrompt){
            const response = await axios.post(`${HTTP_GEN_AI}/generate-drawing/init`, {
                prompt: inputValue, 
            },{
                //@ts-ignore
                headers: token,
            });
            setAiSessionId(response.data.sessionId);
            return response.data.nextQuestion;
        }
        else{
            const response = await axios.post(`${HTTP_GEN_AI}/generate-drawing/clarify`, {
                answer: inputValue, 
                sessionId: aiSessionId
            });
            return JSON.stringify(response.data.drawing) ?? response.data.nextQuestion;
        }
    }
    catch(error: any) {
        console.error("Error generating drawing:", error);
    }
}