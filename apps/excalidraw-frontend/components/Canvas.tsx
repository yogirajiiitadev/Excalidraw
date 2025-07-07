import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import { ArrowUpRightIcon, BrainCircuitIcon, Circle, PencilIcon, RectangleHorizontalIcon, TextIcon } from "lucide-react";
import { Game } from "@/app/draw/Game";
import Loading from "./Loading";
import {AIChatWindow} from "./AIChatWindow";

type Shape = "circle" | "rect" | "pencil" | "text";

export function Canvas({roomId, ws}:{roomId: string, ws: WebSocket}){
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedTool, setSelectedTool] = useState<Shape>("pencil");
    const [game, setGame] = useState<Game>();
    const [reload, setReload] = useState<boolean | undefined>(true);
    const [showAIChat, setShowAIChat] = useState<boolean>(false);

    useEffect(()=>{
        game?.setShape(selectedTool);
        console.log("Selected Tool changed!!!!!");
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

    useEffect(()=>{
        console.log("Reload status changed: ", reload);
    },[reload]);

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
            {showAIChat && <AIChatWindow onClose={() => setShowAIChat(false)} />}
            {reload && <Loading comp="Canvas and fetching existing shapes"/>}
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
                bottom: 10, 
                right: 10, 
                transform: "translateX(-50%)", // Centers the bar horizontally
                display: "flex", 
                justifyContent: "center",
                alignItems: "center",
                // background: "rgba(0, 191, 255, 0.4)", // Optional: Adds a background for visibility
                boxShadow: "0 14px 25px rgba(70, 130, 180, 0.5)", // Optional: Adds a shadow
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