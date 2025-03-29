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
    private roomId: string;
    private socket: WebSocket;
    private clicked: boolean;
    private startX = 0;
    private startY = 0;
    private selectedTool = "pencil"; 

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
        console.log("Input element created inside createTextInput: ", input);

        input.addEventListener("keydown", (event) => {
            console.log("Event key pressed: ", event.key);
            
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
        this.clearCanvas();
        this.socket.send(
            JSON.stringify({
                type: "chat",
                message: JSON.stringify({ currentShape: textShape }),
                roomId: this.roomId,
            })
        );
    }

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

    mouseDownHandler = (e: MouseEvent) => {
        this.clicked = true;
        this.startX = e.clientX;
        this.startY = e.clientY;
        console.log("Current selected tool 2: ", this.selectedTool);
    };

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

    mouseDoubleClickHandler = (e: any) => {
        this.clicked = true;
        this.startX = e.clientX;
        this.startY = e.clientY;
        if (this.selectedTool === "text") {
            this.createTextInput(this.startX, this.startY);
        }
        console.log("Canvas was double-clicked at:", e.clientX, e.clientY);
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
            else if (shape.type === "text") {
                this.ctx.font = shape.font || "16px Arial";  
                this.ctx.fillStyle = shape.color || "white";
                this.ctx.fillText(shape.inputText, shape.startX, shape.startY);
            }
        });
    }
}