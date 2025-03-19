import { initDraw } from "@/app/draw";
import { useEffect, useRef } from "react";

export function Canvas({roomId, ws}:{roomId: string, ws: WebSocket}){
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(()=>{
        if(canvasRef.current){
            const canvas = canvasRef.current;
            
            initDraw(canvas, roomId, ws);
        }
    },[canvasRef]);

    return <canvas ref={canvasRef} width={2000} height={700}></canvas>
}