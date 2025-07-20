"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetch_all_rooms } from "@/functions/fetchRooms";
import RoomCard from "@/components/RoomCard";
import { Shapes } from "lucide-react";
import {Modal} from 'antd';
import { handleCreateRoomSubmit } from "@/functions/handleCreateRoomSubmit";
import CommonFooter from "@/components/CommonFooter";
import Loading from "@/components/Loading";

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
  const handleLogOut = () => {
    localStorage.removeItem("token");
    router.push("/");
  }
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
      fetch_all_rooms(token, setRooms, setLoading);
    }
  }, [token, loading]);

  return (
    <div>
      <div className="min-h-screen bg-gradient-to-br from-[rgba(58,178,218,0.95)] via-white to-[rgba(28,82,100,0.95)] py-5 px-3 sm:px-6 pb-20">
        <nav className="bg-white/90 shadow-lg py-4 px-8 rounded-2xl flex items-center justify-between mb-8 border border-[rgba(33,59,68,0.12)] backdrop-blur-md">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <Shapes className="h-14 w-14 text-[rgba(48,148,182,0.95)] drop-shadow-lg" />
              <span className="ml-2 text-3xl font-extrabold text-gray-900 tracking-tight">Scriblio <span className='text-[rgba(48,148,182,0.95)]'>Dashboard</span></span>
            </div> 
            <button className="cursor-pointer px-3 py-1 bg-[rgba(48,148,182,0.95)] text-white font-semibold text-lg rounded-xl shadow-lg hover:bg-[rgba(48,148,182,1)] transition border-2 border-[rgba(48,148,182,0.15)] focus:outline-none focus:ring-2 focus:ring-[rgba(48,148,182,0.4)]"
                onClick={handleLogOut}>
                  Log out
            </button>
          </div>
        </nav>
        <div className="px-0 sm:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
              <div className="mt-8 px-5">
                  <h2 className="text-3xl font-bold text-white">Your Rooms</h2>
                  <p className="text-xl text-white mt-2">Manage and access all your collaborative rooms.</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={() => {
                      setIsCreateRoomModalOpen(true);
                      setErr(false);
                      console.log("Create room triggered!!")}}
                  className="cursor-pointer px-6 py-3 bg-[rgba(48,148,182,0.95)] text-white font-semibold text-lg rounded-xl shadow-lg hover:bg-[rgba(48,148,182,1)] transition border-2 border-[rgba(48,148,182,0.15)] focus:outline-none focus:ring-2 focus:ring-[rgba(48,148,182,0.4)]"
                  >
                  + Create Room
                </button>
              </div>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {rooms.length > 0 ? (
              rooms.map((room: any) => <RoomCard roomDetails={room} key={room.id} />)
              ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-16">
                <Shapes className="h-16 w-16 text-[rgba(48,148,182,0.15)] mb-4" />
                <p className="text-gray-400 text-lg font-medium">No rooms available. Create your first room!</p>
              </div>
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
            okButtonProps={{
              style: { backgroundColor: "rgba(0,120,160,0.95)", borderColor: "#1677ff", color: "white" }, 
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
        {loading && <Loading comp="Dashboard" />}
      </div>
  );
};

export default Dashboard;
