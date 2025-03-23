import { getExistingShapes } from "./httpCalls";

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
    type: "pencil";
    startX: number;
    startY: number;
    endX: number;
    endY: number;
};

type Tool = "rect" | "circle" | "pencil";

export class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private existingShapes: Shape[];
    private roomId: string;
    private socket: WebSocket;
    private clicked: boolean;
    private startX = 0;
    private startY = 0;
    private selectedTool = "pencil"; 

    constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket){ // constructors cant be async!!!
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.existingShapes = [];
        this.roomId = roomId;
        this.socket = socket;
        this.clicked = false;
        this.init();
        this.initHandlers();
        this.initMouseHandlers();
    }

    async init(){
        this.existingShapes = await getExistingShapes(this.roomId);
        this.clearCanvas();
        console.log("Current selected tool: ", this.selectedTool);
    }

    setShape(shape: Tool){
        console.log("Selected Tool: ", shape);
        this.selectedTool = shape;
    }

    initHandlers(){
        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if(message.type === "chat"){
                const parsedShape = JSON.parse(message.message);
                console.log("parsedShape: ", parsedShape);
                this.existingShapes.push(parsedShape.currentShape);
                this.clearCanvas();
            }
        }
    }

    mouseDownHandler = (e: any) => {
        this.clicked = true;
        this.startX = e.clientX;
        this.startY = e.clientY;
        console.log("Current selected tool: ", this.selectedTool);
    }

    mouseMoveHandler = (e: any) => {
        if(this.clicked){
            const width = e.clientX - this.startX;
            const height = e.clientY - this.startY;
            this.clearCanvas();
            
            if(this.selectedTool === "pencil"){
                this.ctx.beginPath();
                this.ctx.moveTo(this.startX,this.startY);
                this.ctx.lineTo(e.clientX,e.clientY);
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

        this.socket.send(JSON.stringify({
            type: "chat",   
            message: JSON.stringify({currentShape}),
            roomId: this.roomId  
        }));
        this.clearCanvas();
    }

    destroy(){
        this.canvas.removeEventListener("mousedown",this.mouseDownHandler);

        this.canvas.removeEventListener("mouseup",this.mouseUpHandler);

        this.canvas.removeEventListener("mousemove",this.mouseMoveHandler);
    }

    initMouseHandlers(){
        this.canvas.addEventListener("mousedown",this.mouseDownHandler);

        this.canvas.addEventListener("mouseup",this.mouseUpHandler);

        this.canvas.addEventListener("mousemove",this.mouseMoveHandler);
    }

    clearCanvas(){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.ctx.fillStyle = "rgba(0, 0, 0)";
        this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);

        this.existingShapes.map((shape) => {
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
                this.ctx.stroke();
            }
        });
    }
}