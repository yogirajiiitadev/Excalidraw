"use client"

import { initDraw } from "@/app/draw";
import { WS_URL } from "@/config";
import { useEffect, useRef, useState } from "react";
import { Canvas } from "./Canvas";
import Loading from "./Loading"

export function RoomCanvas({roomId}: {
    roomId: string
}){
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const storedToken = localStorage.getItem("token");
    useEffect(()=>{
        const ws = new WebSocket(`${WS_URL}?token=${storedToken}`);
        ws.onopen = ()=>{
            console.log("Web socket connected");
            setSocket(ws);
            ws.send(JSON.stringify({
                type: "join_room",
                roomId
            }));
        }
    },[]);
    if(!socket){
        return <Loading comp="Canvas and fetching existing shapes" />
    }
    return <div>
        <Canvas roomId={roomId} ws={socket} />
    </div>
}