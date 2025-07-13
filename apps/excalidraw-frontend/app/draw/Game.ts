import { Shapes } from "lucide-react";
import { getExistingShapes } from "./httpCalls";

export type Shape = {
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
    type: "pencil";
    startX: number;
    startY: number;
    endX: number;
    endY: number;
} | {
    type: "text";
    startX: number;
    startY: number;
    font: string;
    color: string;
    inputText: string;
};

type Tool = "rect" | "circle" | "pencil" | "text";

export class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private existingShapes: Shape[];
    private genAiShapes: Shape[] | null = [];
    private roomId: string;
    private socket: WebSocket;
    private clicked: boolean;
    private startX = 0;
    private startY = 0;
    private selectedTool = "pencil"; 
    private setOffLoading: () => void;

    private createTextInput(x: number, y: number) {
        const input = document.createElement("input");
        input.type = "text";
        input.style.position = "absolute";
        input.style.left = `${x}px`;
        input.style.top = `${y}px`;
        input.style.font = "20px Arial";
        input.style.color = "black";
        input.style.background = "grey";
        input.style.border = "none";
        input.style.outline = "none";
        input.style.padding = "2px";
        document.body.appendChild(input);
        input.focus();

        input.addEventListener("keydown", (event) => {            
            if (event.key === "Enter") {
                const text = input.value.trim();
                if (text) {
                    this.addTextToCanvas(text, x, y);
                }
                document.body.removeChild(input);
            } else if (event.key === "Backspace") {
                console.log("Backspace pressed, text: ", input.value);
            }
        });
        
        input.addEventListener("blur", () => {
            const text = input.value.trim();
            if (text) {
                this.addTextToCanvas(text, x, y);
            }
            document.body.removeChild(input);
            console.log("Input focus lost!!");
        });
    }

    private addTextToCanvas(text: string, x: number, y: number) {
        const textShape: Shape = {
            type: "text",
            startX: x,
            startY: y,
            inputText: text,
            font: "20px Arial",
            color: "white",
        };
    
        this.existingShapes.push(textShape);
        this.clearCanvas(false);
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(
                JSON.stringify({
                    type: "chat",
                    message: JSON.stringify({ currentShape: textShape }),
                    roomId: this.roomId,
                })
            );
        }
        else {
            console.error("WebSocket is not open. Cannot send text shape.");
        }
    }

    constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket, setOffLoading: () => void){ // constructors cant be async!!!
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.existingShapes = [];
        this.roomId = roomId;
        this.socket = socket;
        this.clicked = false;
        this.setOffLoading = setOffLoading;
        this.init();
        this.initHandlers();
        this.initMouseHandlers();
    }

    async init(){
        this.existingShapes = await getExistingShapes(this.roomId);
        this.setOffLoading();
        this.clearCanvas(false);
    }

    setShape(shape: Tool){
        this.selectedTool = shape;
    }

    setGenAiShapes(shapes: Shape[] | null){
        this.genAiShapes = shapes;
        console.log("Drawing received from Gen AI 2: ", this.genAiShapes);
    }

    initHandlers(){
        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if(message.type === "chat"){
                const parsedShape = JSON.parse(message.message);
                this.existingShapes.push(parsedShape.currentShape);
                this.clearCanvas(false);
            }
        }
    }

    mouseDownHandler = (e: MouseEvent) => {
        this.clicked = true;
        this.startX = e.clientX;
        this.startY = e.clientY;
    };

    mouseMoveHandler = (e: any) => {
        if(this.clicked){
            const width = e.clientX - this.startX;
            const height = e.clientY - this.startY;
            this.clearCanvas(false);
            
            if(this.selectedTool === "pencil"){
                this.ctx.beginPath();
                this.ctx.moveTo(this.startX,this.startY);
                this.ctx.lineTo(e.clientX,e.clientY);
                // arrow head code
                var headlen = 10;
                var dx = e.clientX - this.startX;
                var dy = e.clientY - this.startY;
                var angle = Math.atan2(dy, dx);
                this.ctx.lineTo(e.clientX - headlen * Math.cos(angle - Math.PI / 6), e.clientY - headlen * Math.sin(angle - Math.PI / 6));
                this.ctx.moveTo(e.clientX, e.clientY);
                this.ctx.lineTo(e.clientX - headlen * Math.cos(angle + Math.PI / 6), e.clientY - headlen * Math.sin(angle + Math.PI / 6));
                // arrow head code ends
                this.ctx.stroke();
            }
            else if(this.selectedTool === "circle"){
                const radius = Math.max(width,height)/2;
                const centerX = this.startX + radius;
                const centerY = this.startY + radius;
                this.ctx.beginPath();
                this.ctx.arc(centerX,centerY,Math.abs(radius),0,2*Math.PI);
                this.ctx.stroke();
                this.ctx.closePath();
            }
            else if(this.selectedTool === "rect"){
                this.ctx.strokeStyle = "rgba(255, 255, 255)";
                this.ctx.strokeRect(this.startX,this.startY,width,height);
            }
        }
    }

    mouseUpHandler = (e: any) => {
        this.clicked = false;
        const width = e.clientX - this.startX;
        const height = e.clientY - this.startY;
        let currentShape: null | Shape = null;
        if(this.selectedTool === "rect"){
            currentShape = {
                type: this.selectedTool,
                x: this.startX,
                y: this.startY,
                width,
                height
            };
        }
        else if(this.selectedTool === "circle"){
            const radius = Math.max(width, height)/2;
            currentShape = {
                type: this.selectedTool,
                radius: radius,
                centerX: this.startX + radius,
                centerY: this.startY + radius,
            };
        }
        else if(this.selectedTool === "pencil"){
            currentShape = {
                type: this.selectedTool,
                startX: this.startX,
                startY: this.startY,
                endX: width + this.startX,
                endY: height + this.startY
            };
        }

        if(!currentShape){
            return;
        }

        this.existingShapes.push(currentShape);

        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({
                type: "chat",   
                message: JSON.stringify({currentShape}),
                roomId: this.roomId  
            }));
        }
        this.clearCanvas(false);
    }

    mouseDoubleClickHandler = (e: any) => {
        this.clicked = true;
        this.startX = e.clientX;
        this.startY = e.clientY;
        if (this.selectedTool === "text") {
            this.createTextInput(this.startX, this.startY);
        }
    }

    destroy(){
        this.canvas.removeEventListener("mousedown",this.mouseDownHandler);

        this.canvas.removeEventListener("mouseup",this.mouseUpHandler);

        this.canvas.removeEventListener("mousemove",this.mouseMoveHandler);

        this.canvas.removeEventListener("dblclick",this.mouseDoubleClickHandler);
    }

    initMouseHandlers(){
        this.canvas.addEventListener("mousedown",this.mouseDownHandler);

        this.canvas.addEventListener("mouseup",this.mouseUpHandler);

        this.canvas.addEventListener("mousemove",this.mouseMoveHandler);

        this.canvas.addEventListener("dblclick",this.mouseDoubleClickHandler);
    }

    acceptGenAiDrawing(){
        if (this.socket.readyState === WebSocket.OPEN) {
            this.genAiShapes?.map((genAiShape: Shape) => {
                    this.socket.send(JSON.stringify({
                    type: "chat",   
                    message: JSON.stringify({genAiShape}),
                    roomId: this.roomId  
                }));
            })
        }
        this.genAiShapes?.map((genAiShape: Shape) => {
            this.existingShapes.push(genAiShape);
        });
        this.clearCanvas(false);
    }

    clearCanvas(isGenAi: boolean){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.ctx.fillStyle = "rgba(0, 0, 0)";
        this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
        // Clearing canvas and redrawing existing shapes
        const iteratingShapes = isGenAi ? this.genAiShapes : this.existingShapes;
        iteratingShapes?.map((shape) => {
            if(shape.type === "rect"){
                this.ctx.strokeStyle = "rgba(255, 255, 255)";
                this.ctx.strokeRect(shape.x,shape.y,shape.width,shape.height);
            }
            else if(shape.type === "circle"){
                this.ctx.beginPath();
                this.ctx.arc(shape.centerX,shape.centerY,Math.abs(shape.radius),0,2*Math.PI);
                this.ctx.stroke();
                this.ctx.closePath();
            }
            else if(shape.type === "pencil"){
                this.ctx.beginPath();
                this.ctx.moveTo(shape.startX,shape.startY);
                this.ctx.lineTo(shape.endX,shape.endY);
                // arrow head code starts
                var headlen = 10;
                var dx = shape.endX - shape.startX;
                var dy = shape.endY - shape.startY;
                var angle = Math.atan2(dy, dx);
                this.ctx.lineTo(shape.endX - headlen * Math.cos(angle - Math.PI / 6), shape.endY - headlen * Math.sin(angle - Math.PI / 6));
                this.ctx.moveTo(shape.endX, shape.endY);
                this.ctx.lineTo(shape.endX - headlen * Math.cos(angle + Math.PI / 6), shape.endY - headlen * Math.sin(angle + Math.PI / 6));
                // arrow head code ends
                this.ctx.stroke();
            }
            else if (shape.type === "text") {
                this.ctx.font = shape.font || "16px Arial";  
                this.ctx.fillStyle = shape.color || "white";
                this.ctx.fillText(shape.inputText, shape.startX, shape.startY);
            }
        });
    }
}