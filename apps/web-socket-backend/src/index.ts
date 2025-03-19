import {WebSocketServer, WebSocket} from "ws";
import { JWT_SECRET } from "@repo/backend-common/config";
import jwt, { JwtPayload } from "jsonwebtoken";
import {prismaClient} from "@repo/db/client";

const wss = new WebSocketServer({ port: 8080 });

interface User {
    userId: string; 
    ws: WebSocket;
    rooms: string[];
}

const users: User[] = [];

function checkUser(token:string): string | null{
    try{
        const decoded = jwt.verify(token, JWT_SECRET);
        if(typeof decoded === "string"){
            return null;
        }
        
        if(!decoded || !(decoded as JwtPayload).userId){
            return null;
        }
        return decoded.userId;
    }
    catch(e){
        return null;
    }
}

wss.on("connection", function connection(ws, request) {
    const url = request.url;
    if(!url){
        return;
    }
    const queryParams = new URLSearchParams(url.split("?")[1]);
    const token = queryParams.get("token") || "";
    const userId = checkUser(token);

    if(userId == null){
        ws.close();
        return null;
    }

    users.push({
        userId,
        rooms: [],
        ws
    });


    ws.on("message", async function message(data: string){
        const parsedData = JSON.parse(data as unknown as string);
        if(parsedData.type === "join_room"){
            const user = users.find(u => u.ws === ws);
                user?.rooms.push(parsedData.roomId);
        }
        else if(parsedData.type === "leave_room"){
            const roomId = parsedData.roomId;
            const user = users.find(u => u.ws === ws);
            if(user){
                user.rooms = user.rooms.filter(r => r !== roomId);
            }
            else{
                return;
            }
        }
        else if(parsedData.type === "chat"){
            const roomId = parsedData.roomId;
            const message = parsedData.message;
            try{
                await prismaClient.chat.create({
                    data: {
                        message: message,
                        roomId: Number(roomId),
                        userId: userId
                    }
                })
            } catch(e){
                console.error("Error inserting chat into DB: ", e);
            }
            const user = users.find(u => u?.ws === ws);
            if(user){
                const roomUsers = users.filter(u => u.rooms.includes(roomId));
                roomUsers.forEach(u => {
                    u.ws.send(JSON.stringify({
                        type: "chat",
                        message: message
                    }));
                });
            }
            else{
                return;
            }
        }
    });

    ws.on('error', console.error)

    ws.send("Hello! Message From Server!!");
});