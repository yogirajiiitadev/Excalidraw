import { HTTP_BACKEND } from "@/config";
import axios from "axios";


export const handleCreateRoomSubmit = async({roomName, roomDescription, setErr, setErrDisplay, setRooms, setLoading, setIsCreateRoomModalOpen}
    : {roomName: any, roomDescription: any, setErr: any, setErrDisplay: any, setRooms: any, setLoading: any, setIsCreateRoomModalOpen: any}) => {
    const token = localStorage.getItem("token");
    const roomBody: any = {
        name: roomName,
        description: roomDescription,
    }
    try{
        const response = await axios.post(`${HTTP_BACKEND}/create-room`, roomBody, {
            headers: {
                Authorization: token,
            },
        });
        setErr(false);
        setErrDisplay("");
        console.log("Room created successfully");
        setLoading((loading: boolean) => !loading);
        setIsCreateRoomModalOpen(false);
    } catch(error: any){
        if(error.response.status === 411){
            setErr(true);
            setErrDisplay(error.response.data.error);
        } else if(error.response.status === 400) {
            setErr(true);
            setErrDisplay(error.response.data.error.issues[0].message);
            console.log("400 hit!!");
        } else {
            setErr(true);
            setErrDisplay("Error creating room");
        }
    }
}