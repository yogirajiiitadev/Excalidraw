"use client";
import React from "react";
import { useRouter } from "next/navigation";

const RoomCard = ({ roomDetails }: { roomDetails: any }) => {
  const router = useRouter();

  return (
    <div className="bg-[rgba(48,148,182,0.95)] shadow-xl rounded-2xl overflow-hidden border border-[rgba(48,148,182,0.15)] transition-transform transform hover:scale-105 hover:shadow-2xl group cursor-pointer">
      <div className="p-6 flex flex-col h-full">
        <h2 className="text-2xl font-bold text-white tracking-tight group-hover:underline">
          {roomDetails.slug}
        </h2>
        <p className="text-white/80 mt-2 text-base min-h-[48px]">
          {roomDetails.description}
        </p>
        <p className="text-xs text-white/60 mt-2">
          Created on: {new Date(roomDetails.createdAt).toLocaleDateString()}
        </p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/canvas/${roomDetails.id}`);
          }}
          className="mt-6 w-full bg-white/90 text-[rgba(48,148,182,0.95)] font-semibold py-2 rounded-lg shadow hover:bg-white transition text-lg tracking-wide border border-white/60 hover:border-[rgba(48,148,182,0.95)] focus:outline-none focus:ring-2 focus:ring-white"
        >
          Join Room
        </button>
      </div>
    </div>
  );
};

export default RoomCard;
