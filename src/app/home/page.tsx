
"use client"
import React, { useEffect, useRef } from "react";
import { signOut } from "next-auth/react";
import { io, Socket } from "socket.io-client";
import WebSocketCall from "../components/WebSocketCall"

export default function Home() {
  const videoRef = useRef<HTMLImageElement>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io("ws://localhost:8080/home"); // Connect to your Flask server WebSocket endpoint

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("WebSocket connected");
    });

    socket.on("frame", (data: ArrayBuffer) => {
      // Convert ArrayBuffer to Blob
      const blob = new Blob([data], { type: "image/jpeg" });
      const imageUrl = URL.createObjectURL(blob);

      // Update the src attribute of the videoRef element with the new image
      if (videoRef.current) {
        videoRef.current.src = imageUrl;
      }
    });

    socket.on("disconnect", () => {
      console.log("WebSocket disconnected");
    });

    return () => {
      socket.disconnect(); // Cleanup WebSocket connection on component unmount
    };
  }, []);

  return (
    <>
      {videoRef.current && (
        <img
          ref={videoRef}
          alt="Webcam Feed"
          style={{ width: "100%" }}
        />
      )}
      {/* Render the WebSocketCall component and pass the socket instance */}
      {socketRef.current && <WebSocketCall socket={socketRef.current}></WebSocketCall>}
      {console.log(socketRef.current)}
      <button
        className="bg-white rounded-full border border-gray-200 text-gray-800 px-4 py-2 flex items-center space-x-2 hover:bg-gray-200"
        onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
      >
        Logout
      </button>
    </>
  );
  
}