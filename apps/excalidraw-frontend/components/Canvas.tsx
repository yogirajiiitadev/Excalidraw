import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import { ArrowUpRightIcon, BrainCircuitIcon, Check, Circle, CrossIcon, PencilIcon, RectangleHorizontalIcon, TextIcon, X } from "lucide-react";
import { Game } from "@/app/draw/Game";
import Loading from "./Loading";
import {AIChatWindow} from "./AIChatWindow";
import { UUID } from "crypto";
import { Shape as ShapeType } from "@/app/draw/Game";

type Shape = "circle" | "rect" | "pencil" | "text";
export type chat = {
    role: "user" | "ai",
    content: string
}

const initialSystemMessage: chat[] = [
    {
        role: "ai",
        content: "Please enter the instruction to create the required drawing."
    }
]

export function Canvas({roomId, ws}:{roomId: string, ws: WebSocket}){
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedTool, setSelectedTool] = useState<Shape>("pencil");
    const [game, setGame] = useState<Game>();
    const [reload, setReload] = useState<boolean | undefined>(true);
    const [showAIChat, setShowAIChat] = useState<boolean>(false);
    const [aiSessionId, setAiSessionId] = useState<string>("");
    const [messages, setMessages] = useState<chat[]>(initialSystemMessage);
    const [drawingMessage, setDrawingMessage] = useState<ShapeType[] | null>(null);

    useEffect(() => {
        game?.setGenAiShapes(drawingMessage);
        console.log("Drawing received from Gen AI 1: ", drawingMessage);
        game?.clearCanvas(0);
    },[drawingMessage])

    useEffect(()=>{
        game?.setShape(selectedTool);
    },[selectedTool, game]);

    useEffect(()=>{
        if(canvasRef.current){
            const canvas = canvasRef.current;
            const g = new Game(canvas, roomId, ws, () => setReload(false));
            setGame(g);
            return () => {
                g.destroy();
            }
        }
    },[canvasRef]);

    return(
        <div style={{ height: "100vh", overflow: "hidden" }}>
            <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
            <TopBar selectedTool={selectedTool} setSelectedTool={setSelectedTool}/>
            <AIbutton onClick={() => {
                setShowAIChat((prev) => !prev);
                if(game) {
                    console.log("AI button clicked, triggering AI drawing...");
                }
            }}/>
            {showAIChat && !drawingMessage && <AIChatWindow setDrawingMessage={setDrawingMessage} messages={messages} setMessages={setMessages} onClose={() => setShowAIChat(false)} aiSessionId={aiSessionId} setAiSessionId={setAiSessionId} />}
            {drawingMessage && <VerdictPanel setDrawingMessages={setDrawingMessage} setMessages={setMessages} game={game} />}
            {reload && <Loading comp="Canvas and fetching existing shapes"/>}
        </div>
    ) 
}

function VerdictPanel({setDrawingMessages, setMessages, game}: {setDrawingMessages: any, setMessages: any, game: Game | undefined}){
    return (
        <div style={{ 
            position: "fixed", 
            bottom: 15, 
            left: "50%", 
            transform: "translateX(-50%)", // Centers the bar horizontally
            display: "flex", 
            justifyContent: "center",
            alignItems: "center",
            background: "rgba(0, 191, 255, 0.4)", // Optional: Adds a background for visibility
            boxShadow: "0 4px 15px rgba(70, 130, 180, 0.5), 0 0 12px rgba(0, 191, 255, 0.4)", // Optional: Adds a shadow
            padding: "8px", 
            borderRadius: "8px"
        }}>
            <div className="flex gap-1">
                <IconButton activated={false} icon={
                    <div className="flex items-center gap-2">
                        <Check />
                        <span>Accept</span>
                    </div>
                } 
                    onClick={() => {
                        game?.acceptGenAiDrawing();
                        setDrawingMessages(null);
                        setMessages(initialSystemMessage);
                    }} />
                <IconButton activated={false} icon={ 
                        <div className="flex items-center gap-2">
                            <X />
                            <span>Reject</span>
                        </div>
                    }
                    onClick={()=>{ 
                        game?.clearCanvas(1);
                        setDrawingMessages(null);
                        setMessages(initialSystemMessage);
                    }} />
            </div>
        </div>
    )
}

function TopBar({selectedTool, setSelectedTool}:{selectedTool: Shape, setSelectedTool: (s: Shape) => void}){
    return (
        <div style={{ 
            position: "fixed", 
            top: 10, 
            left: "50%", 
            transform: "translateX(-50%)", // Centers the bar horizontally
            display: "flex", 
            justifyContent: "center",
            alignItems: "center",
            background: "rgba(0, 191, 255, 0.4)", // Optional: Adds a background for visibility
            boxShadow: "0 4px 15px rgba(70, 130, 180, 0.5), 0 0 12px rgba(0, 191, 255, 0.4)", // Optional: Adds a shadow
            padding: "8px", 
            borderRadius: "8px"
        }}>
            <div className="flex gap-1">
                <IconButton activated={selectedTool === "pencil"} icon={<ArrowUpRightIcon/>} 
                    onClick={()=>{  setSelectedTool("pencil") }} />  
                <IconButton activated={selectedTool === "rect"} icon={<RectangleHorizontalIcon/>} 
                    onClick={()=>{ setSelectedTool("rect")  }} />  
                <IconButton activated={selectedTool === "circle"} icon={<Circle/>} 
                    onClick={()=>{ setSelectedTool("circle")  }} />
                <IconButton activated={selectedTool === "text"} icon={ <TextIcon/> }
                    onClick={()=>{ setSelectedTool("text")  }} />
            </div>
        </div>
    )
}

function AIbutton({onClick}: {onClick: () => void}){
    return (
        <>
            <div style={{ 
                position: "fixed", 
                bottom: 15, 
                right: 10, 
                transform: "translateX(-50%)", // Centers the bar horizontally
                display: "flex", 
                justifyContent: "center",
                alignItems: "center",
                // background: "rgba(0, 191, 255, 0.4)", // Optional: Adds a background for visibility
                boxShadow: "0 18px 35px rgba(70, 130, 180, 0.5)", // Optional: Adds a shadow
                padding: "8px", 
                borderRadius: "8px"
            }}>
                <IconButton
                icon={<BrainCircuitIcon className="h-6 w-6 text-white" />}
                onClick={onClick}
                activated={false}
                />
            </div>
        </>
    )
}