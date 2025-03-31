"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetch_all_rooms } from "@/functions/fetchRooms";
import RoomCard from "@/components/RoomCard";
import { Shapes } from "lucide-react";
import {Modal} from 'antd';
import { handleCreateRoomSubmit } from "@/functions/handleCreateRoomSubmit";
import CommonFooter from "@/components/CommonFooter";

const Dashboard = () => {
  const router = useRouter();
  const [rooms, setRooms] = useState<any>([]);
  const [token, setToken] = useState<string | null>(null);
  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [roomDescription, setRoomDescription] = useState("");
  const [err, setErr] = useState(false);
  const [errDisplay, setErrDisplay] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    if (!storedToken) {
      console.log("No token found, redirecting to home page");
      router.push("/");
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetch_all_rooms(token, setRooms);
    }
  }, [token, loading]);

  return (
    <div>
      <div className="min-h-screen bg-gray-50 py-5 px-3 sm:px-6 pb-20">
        <nav className="bg-white shadow-md py-4 px-6 rounded-lg flex items-center justify-between">
          <div className="flex items-center">
            <Shapes className="h-12 w-12 text-blue-600" />
            <span className="ml-2 text-3xl font-semibold text-gray-900">Scriblio Dashboard</span>
          </div>
        </nav>
        <div className="px-8">
          <div className="flex justify-between items-center mt-6">
              <div className="mt-8 px-5">
                  <h2 className="text-2xl font-bold text-gray-900">Your Rooms</h2>
                  <p className="text-gray-600 mt-2">Manage and access all your collaborative rooms.</p>
              </div>
              <div>
              <button
                  onClick={() => {
                      setIsCreateRoomModalOpen(true);
                      setErr(false);
                      console.log("Create room triggered!!")}}
                  className="cursor-pointer p-3 mt-4 w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                  + Create Room
              </button>
              </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {rooms.length > 0 ? (
              rooms.map((room: any) => <RoomCard roomDetails={room} key={room.id} />)
              ) : (
              <p className="text-gray-500 text-center col-span-full">No rooms available.</p>
              )}
          </div>
        </div>
        <Modal
            centered
            title={<div className="text-2xl">Create Room</div>}
            open={isCreateRoomModalOpen}
            onOk={async () => {
              await handleCreateRoomSubmit({roomName, roomDescription, setErr, setErrDisplay, setRooms, setLoading, setIsCreateRoomModalOpen});
              console.log("Error boolean fetched : ", err);
            }}
            onCancel={() => {
              setIsCreateRoomModalOpen(false);
              setErr(false);
              setRoomName("");
              setRoomDescription("");
            }}>
            <div className="flex flex-col gap-2 mb-2"> 
                <div className="flex flex-col gap-2">
                    <label className="text-lg">Room Name</label>
                    <input className="p-2 text-md" value={roomName} type="text" placeholder="Please enter room name" onChange={(e: any)=>{
                      setRoomName(e.target.value);
                      setErr(false);
                      }} />
                </div>
                <div className="flex flex-col gap-2 mb-2">
                    <label className="text-lg">Room Description</label>
                    <input className="p-2 text-md" type="text" value={roomDescription} placeholder="Please enter room description" onChange={(e: any)=> {
                      setRoomDescription(e.target.value);
                      setErr(false);
                      }} />
                </div>
                {err && <div className="text-red-500 text-sm">{errDisplay}</div>}
            </div>
        </Modal>
        </div>
        <CommonFooter />
      </div>
  );
};

export default Dashboard;
