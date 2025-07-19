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

// function to check if each shape falls inside the deletion window
function getRelevantShapesToBeDeleted(deletionCoOrdinates: any, allShapes: any){
    return allShapes.filter((rawShape: any) => {
        const shape: any = JSON.parse(rawShape.message).currentShape ?? JSON.parse(rawShape.message).genAiShape;
        console.log("shape iteration: ", shape);
        console.log("deletionCoOrdinates: ", deletionCoOrdinates);

        if(shape.type === "rect"){
            return (deletionCoOrdinates.x > shape.x + shape.width 
                || deletionCoOrdinates.x + deletionCoOrdinates.width < shape.x
                || deletionCoOrdinates.y + deletionCoOrdinates.height < shape.y
                || deletionCoOrdinates.y > shape.y + shape.height
            ) ? false : true
        }else if(shape.type === "circle"){
            const closestX: number = Math.max(deletionCoOrdinates.x, Math.min(shape.centerX, deletionCoOrdinates.x + deletionCoOrdinates.width));
            const closestY = Math.max(deletionCoOrdinates.y, Math.min(shape.centerY, deletionCoOrdinates.y + deletionCoOrdinates.height));
            const dx = shape.centerX - closestX;
            const dy = shape.centerY - closestY;
            return (dx * dx + dy * dy) <= (shape.radius * shape.radius);
        }else if(shape.type === "pencil"){
            // skipping this for now, Maths getting a bit too compilcated.
        } else if(shape.type === "text"){
            // skipping this for now, Maths getting a bit too compilcated.
        }
    });
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
            console.log("message received in ws: ", message);
            
            if(JSON.parse(message)?.currentShape?.type === "delete"){
                const all_chats = await prismaClient.chat.findMany({
                    where:{
                        roomId: Number(roomId)
                    }
                });
                console.log("all chats: ", all_chats);
                const to_be_deleted_chats: any = getRelevantShapesToBeDeleted(JSON.parse(message)?.currentShape, all_chats);
                console.log("to be deleted chats: ", to_be_deleted_chats);
                try{
                    const deleteIDs = to_be_deleted_chats.map((chat: any) => chat.id);
                    await prismaClient.chat.deleteMany({
                        where: {
                            id: {
                                in: deleteIDs
                            }
                        }
                    }); 
                } catch(e){
                    console.error("Error deleting chat from DB: ", e);
                }
            }
            else{
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
            }
            // this approach is slow because it awaits the process of storing
            // the message in the database before sending it to all users
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