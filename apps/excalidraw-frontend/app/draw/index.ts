import axios from "axios";
import { HTTP_BACKEND } from "@/config";
type Shape = {
    type: "rect";
    x: number;
    y: number;
    width: number;  
    height: number;
} | {
    type: "circle";
    centerX: number;
    centerY: number;
    radius: number;
} | {
    type: "line";
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}


export async function initDraw(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket){
    const ctx = canvas.getContext("2d");

    let existingShapes: Shape[] = await getExistingShapes(roomId);
    if(!ctx){
        return;
    }

    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if(message.type === "chat"){
            const parsedShape = JSON.parse(message.message);
            console.log("parsedShape: ", parsedShape);
            existingShapes.push(parsedShape.currentShape);
            clearCanvas(existingShapes,canvas,ctx);
        }
    }

    clearCanvas(existingShapes,canvas,ctx);

    let clicked = false;
    let startX = 0;
    let startY = 0;
    
    canvas.addEventListener("mousedown",(e)=>{
        clicked = true;
        startX = e.clientX;
        startY = e.clientY;
    });

    canvas.addEventListener("mouseup",(e)=>{
        clicked = false;
        const width = e.clientX - startX;
        const height = e.clientY - startY;
        const currentShape: Shape = {
            type: "rect",
            x: startX,
            y: startY,
            width,
            height
        };

        existingShapes.push(currentShape);
        socket.send(JSON.stringify({
            type: "chat",   
            message: JSON.stringify({currentShape}),
            roomId  
        }));
        clearCanvas(existingShapes,canvas,ctx);
    });

    canvas.addEventListener("mousemove",(e)=>{
        if(clicked){
            const width = e.clientX - startX;
            const height = e.clientY - startY;
            clearCanvas(existingShapes,canvas,ctx);
            ctx.strokeStyle = "rgba(255, 255, 255)";
            ctx.strokeRect(startX,startY,width,height);
        }
    });
}

function clearCanvas(existingShapes: Shape[], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "rgba(0, 0, 0)";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    existingShapes.map(shape => {
        if(shape.type === "rect"){
            ctx.strokeStyle = "rgba(255, 255, 255)";
            ctx.strokeRect(shape.x,shape.y,shape.width,shape.height);
        }
    });
}


async function getExistingShapes(roomId: string){
    const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);
    const messages = res.data.messages;
    const shapes = messages.map((x: {message: any}) => {
        const parsedMessage = JSON.parse(x.message);
        return parsedMessage.currentShape;
    });
    return shapes;
}