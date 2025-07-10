import { HTTP_GEN_AI } from "@/config";
import axios from "axios";

export const postPromptToGenAIBackend = async(inputValue: string) => {
    try{
        const response = await axios.post(`${HTTP_GEN_AI}/api/generate-drawing`, {
            prompt: inputValue, 
            userId: "123",
            roomId: "456"
        });
        return response.data;
    }
    catch(error: any) {
        console.error("Error generating drawing:", error);
    }
}