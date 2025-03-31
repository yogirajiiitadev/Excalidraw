"use client";
import React from "react";
import { useRouter } from "next/navigation";

const RoomCard = ({ roomDetails }: { roomDetails: any }) => {
  const router = useRouter();

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 transition-transform transform hover:scale-105 hover:shadow-lg">
      <div className="p-5">
        <h2 className="text-xl font-semibold text-gray-900">
          {roomDetails.slug}
        </h2>
        <p className="text-gray-600 mt-2">{roomDetails.description}</p>
        <p className="text-sm text-gray-400 mt-2">
          Created on: {new Date(roomDetails.createdAt).toLocaleDateString()}
        </p>
        <button
          onClick={() => router.push(`/canvas/${roomDetails.id}`)}
          className="cursor-pointer mt-4 w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Join Room
        </button>
      </div>
    </div>
  );
};

export default RoomCard;
