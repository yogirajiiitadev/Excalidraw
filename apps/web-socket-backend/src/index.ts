import {WebSocketServer} from "ws";
import { JWT_SECRET } from "@repo/backend-common/config";
import jwt, { JwtPayload } from "jsonwebtoken";
const wss = new WebSocketServer({ port: 8080 });

function checkUser(token:string): string | null{
    const decoded = jwt.verify(token, JWT_SECRET);
    if(typeof decoded === "string"){
        return null;
    }
    
    if(!decoded || !(decoded as JwtPayload).userId){
        return null;
    }
    return decoded.userId;
}

wss.on("connection", function connection(ws, request) {
    const url = request.url;
    if(!url){
        return;
    }
    const queryParams = new URLSearchParams(url.split("?")[1]);
    const token = queryParams.get("token") || "";
    const userId = checkUser(token);

    if(!userId){
        ws.close();
    }

    ws.on('error', console.error)
    ws.on("message", function message(data) {
        console.log("received: %s", data);
    });
    ws.send("Hello! Message From Server!!");
});