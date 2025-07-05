import { HTTP_BACKEND } from "@/config";
import axios from "axios";
import { SetStateAction } from "react";

export const fetch_all_rooms = async (token: string| null, setRooms: SetStateAction<any>, setLoading: SetStateAction<any>) => {
    if(!token) return [];
    const res = await axios.get(`${HTTP_BACKEND}/all-rooms`, {
        headers: {
            Authorization: token,
    }});
    setRooms(res.data.rooms);
    setLoading(false);
    return res.data.rooms;
}