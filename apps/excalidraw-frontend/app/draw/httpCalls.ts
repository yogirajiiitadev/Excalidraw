import { HTTP_BACKEND } from "@/config";
import axios from "axios";

export async function getExistingShapes(roomId: string){
    const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);
    const messages = res.data.messages;
    console.log("messages received from the backend: ", messages);
    const shapes = messages.map((x: {message: any}) => {
        const parsedMessage = JSON.parse(x.message);
        return parsedMessage.currentShape;
    });
    return shapes;
}